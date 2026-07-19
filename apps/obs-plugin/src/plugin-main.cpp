#include <QByteArray>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QString>
#include <QStringList>
#include <cmath>
#include <cstdint>

struct control_response {
	uint64_t command_version;
	bool desired_streaming;
	QString desired_scene;
};

static bool parse_control_response(const QByteArray &json, struct control_response *response)
{
	QJsonParseError error;
	const QJsonDocument document = QJsonDocument::fromJson(json, &error);
	if (error.error != QJsonParseError::NoError || !document.isObject())
		return false;
	const QJsonObject object = document.object();
	const QJsonValue version_value = object.value("commandVersion");
	const QJsonValue streaming_value = object.value("desiredStreaming");
	const QJsonValue scene_value = object.value("desiredScene");
	const double version = version_value.toDouble(-1);
	if (!version_value.isDouble() || version < 0 || std::floor(version) != version ||
	    !streaming_value.isBool() || (!scene_value.isNull() && !scene_value.isString()))
		return false;
	response->command_version = static_cast<uint64_t>(version);
	response->desired_streaming = streaming_value.toBool();
	response->desired_scene = scene_value.isString() ? scene_value.toString() : QString();
	return true;
}

static QByteArray make_control_request(bool streaming, uint64_t applied_version, const QStringList &scene_names,
				       const QString &current_scene)
{
	QJsonArray scenes;
	for (const QString &name : scene_names)
		scenes.append(name);
	const QJsonObject payload{
		{"streaming", streaming},
		{"appliedVersion", static_cast<qint64>(applied_version)},
		{"scenes", scenes},
		{"currentScene", current_scene.isNull() ? QJsonValue(QJsonValue::Null) : QJsonValue(current_scene)},
	};
	return QJsonDocument(payload).toJson(QJsonDocument::Compact);
}

#ifdef VISP_PROTOCOL_TEST

#include <cstdio>
#undef NDEBUG

/* assert() is compiled out under -DNDEBUG (Release), so use a check that is
 * always evaluated and reports failure regardless of the build configuration. */
#define CHECK(expr)                                            \
	do {                                                  \
		if (!(expr)) {                                \
			fprintf(stderr, "check failed: %s\n", #expr); \
			return 1;                             \
		}                                             \
	} while (0)

int main(void)
{
	struct control_response response = {};
	CHECK(parse_control_response("{\"commandVersion\":7,\"desiredStreaming\":true,\"desiredScene\":\"Main \\\"台\\\"\",\"pollAfterMs\":2000}",
				     &response));
	CHECK(response.command_version == 7 && response.desired_streaming &&
	      response.desired_scene == QString::fromUtf8("Main \"台\""));
	CHECK(parse_control_response("{\"desiredStreaming\":false,\"desiredScene\":null,\"commandVersion\":8}",
				     &response));
	CHECK(response.command_version == 8 && !response.desired_streaming && response.desired_scene.isNull());
	CHECK(!parse_control_response("{\"commandVersion\":9}", &response));
	const QJsonObject first_poll = QJsonDocument::fromJson(
		make_control_request(false, 8, {"Old scene", "Removed scene"}, QString()))
					       .object();
	CHECK(first_poll.value("currentScene").isNull());
	CHECK(first_poll.value("scenes").toArray().size() == 2);
	const QJsonObject renamed_poll = QJsonDocument::fromJson(
		make_control_request(true, 9, {QString::fromUtf8("Main \"台\""), "Renamed scene"}, "Renamed scene"))
					         .object();
	CHECK(renamed_poll.value("currentScene").toString() == "Renamed scene");
	CHECK(renamed_poll.value("scenes").toArray().at(0).toString() == QString::fromUtf8("Main \"台\""));
	CHECK(!renamed_poll.value("scenes").toArray().contains("Removed scene"));
	return 0;
}

#else

#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QDialog>
#include <QDialogButtonBox>
#include <QFileDialog>
#include <QFormLayout>
#include <QLabel>
#include <QLineEdit>
#include <QMessageBox>
#include <QObject>
#include <QPushButton>
#include <QSettings>
#include <QTimer>
#include <QUrl>
#include <QVBoxLayout>
#include <QWidget>
#include <obs-frontend-api.h>
#include <obs-module.h>
#include <plugin-support.h>
#include <util/config-file.h>

#define CONFIG_SECTION "visp"
#define DEFAULT_CONTROL_URL "https://app.example.com/api/obs/control"

OBS_DECLARE_MODULE()
OBS_MODULE_USE_DEFAULT_LOCALE(PLUGIN_NAME, "en-US")
OBS_MODULE_AUTHOR("VISP")

struct plugin_config {
	QString control_url;
	QString token;
};

static bool secure_url(const QString &value)
{
	const QUrl url(value);
	const bool local_http = url.scheme() == "http" &&
				(url.host() == "localhost" || url.host() == "127.0.0.1" || url.host() == "::1");
	return url.isValid() && !url.host().isEmpty() && (url.scheme() == "https" || local_http);
}

static plugin_config load_config()
{
	plugin_config result;
	char *path = obs_module_config_path("config.ini");
	config_t *config = NULL;
	if (!path)
		return result;
	if (config_open(&config, path, CONFIG_OPEN_ALWAYS) != CONFIG_SUCCESS) {
		obs_log(LOG_ERROR, "could not open configuration at %s", path);
		bfree(path);
		return result;
	}
	if (!config_has_user_value(config, CONFIG_SECTION, "control_url")) {
		config_set_string(config, CONFIG_SECTION, "control_url", DEFAULT_CONTROL_URL);
		config_set_string(config, CONFIG_SECTION, "token", "");
		config_save_safe(config, "tmp", NULL);
	}
	result.control_url = QString::fromUtf8(config_get_string(config, CONFIG_SECTION, "control_url"));
	result.token = QString::fromUtf8(config_get_string(config, CONFIG_SECTION, "token"));
	config_close(config);
	obs_log(LOG_INFO, "%s configuration from %s",
		!result.token.isEmpty() && secure_url(result.control_url) ? "loaded" : "waiting for", path);
	bfree(path);
	return result;
}

static bool save_config(const plugin_config &settings)
{
	char *path = obs_module_config_path("config.ini");
	config_t *config = NULL;
	if (!path)
		return false;
	if (config_open(&config, path, CONFIG_OPEN_ALWAYS) != CONFIG_SUCCESS) {
		obs_log(LOG_ERROR, "could not open configuration at %s", path);
		bfree(path);
		return false;
	}
	config_set_string(config, CONFIG_SECTION, "control_url", settings.control_url.toUtf8().constData());
	config_set_string(config, CONFIG_SECTION, "token", settings.token.toUtf8().constData());
	const bool saved = config_save_safe(config, "tmp", NULL) == CONFIG_SUCCESS;
	config_close(config);
	bfree(path);
	return saved;
}

class SettingsDialog final : public QDialog {
public:
	SettingsDialog(const plugin_config &settings, QWidget *parent) : QDialog(parent)
	{
		setWindowTitle("VISP Remote Control");
		setMinimumWidth(520);

		url.setText(settings.control_url.isEmpty() ? DEFAULT_CONTROL_URL : settings.control_url);
		token.setText(settings.token);
		token.setEchoMode(QLineEdit::PasswordEchoOnEdit);
		token.setPlaceholderText("Paste the token from the VISP dashboard");

		auto *form = new QFormLayout;
		form->addRow("Control URL", &url);
		form->addRow("Pairing token", &token);

		auto *import_button = new QPushButton("Import config.ini");
		connect(import_button, &QPushButton::clicked, this, [this]() { import_config(); });

		auto *buttons = new QDialogButtonBox(QDialogButtonBox::Save | QDialogButtonBox::Cancel);
		connect(buttons, &QDialogButtonBox::accepted, this, [this]() { validate_and_accept(); });
		connect(buttons, &QDialogButtonBox::rejected, this, &QDialog::reject);

		auto *layout = new QVBoxLayout(this);
		layout->addWidget(
			new QLabel("Paste a pairing token, or import the config downloaded from the VISP dashboard."));
		layout->addLayout(form);
		layout->addWidget(import_button, 0, Qt::AlignLeft);
		layout->addWidget(buttons);
	}

	plugin_config settings() const { return {url.text().trimmed(), token.text().trimmed()}; }

private:
	void import_config()
	{
		const QString path = QFileDialog::getOpenFileName(this, "Import VISP config", {}, "INI files (*.ini)");
		if (path.isEmpty())
			return;
		QSettings imported(path, QSettings::IniFormat);
		imported.beginGroup(CONFIG_SECTION);
		const QString imported_url = imported.value("control_url").toString().trimmed();
		const QString imported_token = imported.value("token").toString().trimmed();
		imported.endGroup();
		if (imported_url.isEmpty() || imported_token.isEmpty()) {
			QMessageBox::warning(this, "Invalid config",
					     "The file must contain [visp], control_url, and token.");
			return;
		}
		url.setText(imported_url);
		token.setText(imported_token);
	}

	void validate_and_accept()
	{
		const plugin_config value = settings();
		if (!secure_url(value.control_url)) {
			QMessageBox::warning(this, "Invalid control URL", "Use an HTTPS URL (or HTTP on localhost).");
			return;
		}
		if (value.token.isEmpty()) {
			QMessageBox::warning(this, "Missing token", "Paste a pairing token or import a config file.");
			return;
		}
		accept();
	}

	QLineEdit url;
	QLineEdit token;
};

static QStringList scene_names()
{
	QStringList names;
	struct obs_frontend_source_list scenes = {};
	obs_frontend_get_scenes(&scenes);
	for (size_t index = 0; index < scenes.sources.num; index++)
		names.append(QString::fromUtf8(obs_source_get_name(scenes.sources.array[index])));
	obs_frontend_source_list_free(&scenes);
	return names;
}

static QString current_scene_name()
{
	obs_source_t *scene = obs_frontend_get_current_scene();
	if (!scene)
		return {};
	const QString name = QString::fromUtf8(obs_source_get_name(scene));
	obs_source_release(scene);
	return name;
}

static bool set_current_scene(const QString &name)
{
	struct obs_frontend_source_list scenes = {};
	obs_frontend_get_scenes(&scenes);
	bool found = false;
	for (size_t index = 0; index < scenes.sources.num; index++) {
		obs_source_t *scene = scenes.sources.array[index];
		if (name == QString::fromUtf8(obs_source_get_name(scene))) {
			obs_frontend_set_current_scene(scene);
			found = true;
			break;
		}
	}
	obs_frontend_source_list_free(&scenes);
	return found;
}

class VispControl final : public QObject {
public:
	VispControl(const plugin_config &settings)
		: url(QUrl(settings.control_url)),
		  authorization("Bearer " + settings.token.toUtf8()),
		  network(this),
		  timer(this),
		  streaming(obs_frontend_streaming_active())
	{
		connect(&timer, &QTimer::timeout, this, [this]() { poll(); });
		timer.start(2000);
		poll();
	}

	~VispControl() override
	{
		timer.stop();
		if (pending) {
			disconnect(pending, nullptr, this, nullptr);
			pending->abort();
		}
	}

	void set_streaming(bool active) { streaming = active; }

private:
	void poll()
	{
		if (pending)
			return;
		QNetworkRequest request(url);
		request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
		request.setRawHeader("Authorization", authorization);
		request.setTransferTimeout(5000);
		request.setAttribute(QNetworkRequest::RedirectPolicyAttribute, QNetworkRequest::ManualRedirectPolicy);
		const QByteArray body = make_control_request(streaming, applied_version, scene_names(), current_scene_name());
		pending = network.post(request, body);
		connect(pending, &QNetworkReply::finished, this, [this, reply = pending]() {
			pending = nullptr;
			handle_response(reply);
			reply->deleteLater();
		});
	}

	void handle_response(QNetworkReply *reply)
	{
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		if (status == 401) {
			obs_log(LOG_ERROR, "pairing token was rejected; rotate it in the VISP dashboard");
			return;
		}
		if (reply->error() != QNetworkReply::NoError || status < 200 || status >= 300)
			return;

		const QByteArray body = reply->readAll();
		struct control_response response;
		if (!parse_control_response(body, &response)) {
			obs_log(LOG_WARNING, "control service returned an invalid response");
			return;
		}

		if (response.command_version <= applied_version)
			return;
		if (!response.desired_scene.isNull() && !set_current_scene(response.desired_scene)) {
			obs_log(LOG_WARNING, "requested scene is no longer available: %s",
				response.desired_scene.toUtf8().constData());
			return;
		}
		const bool active = obs_frontend_streaming_active();
		if (response.desired_streaming != active) {
			if (response.desired_streaming)
				obs_frontend_streaming_start();
			else
				obs_frontend_streaming_stop();
		}
		applied_version = response.command_version;
	}

	QUrl url;
	QByteArray authorization;
	QNetworkAccessManager network;
	QTimer timer;
	QNetworkReply *pending = nullptr;
	uint64_t applied_version = 0;
	bool streaming;
};

static VispControl *control;

static void apply_config(const plugin_config &settings)
{
	delete control;
	control = NULL;
	if (!settings.token.isEmpty() && secure_url(settings.control_url))
		control = new VispControl(settings);
}

static void open_settings(void *private_data)
{
	UNUSED_PARAMETER(private_data);
	auto *parent = static_cast<QWidget *>(obs_frontend_get_main_window());
	SettingsDialog dialog(load_config(), parent);
	if (dialog.exec() != QDialog::Accepted)
		return;
	const plugin_config settings = dialog.settings();
	if (!save_config(settings)) {
		QMessageBox::critical(parent, "VISP Remote Control", "Could not save the plugin configuration.");
		return;
	}
	apply_config(settings);
}

static void frontend_event(enum obs_frontend_event event, void *private_data)
{
	UNUSED_PARAMETER(private_data);
	if (!control)
		return;
	if (event == OBS_FRONTEND_EVENT_STREAMING_STARTED)
		control->set_streaming(true);
	else if (event == OBS_FRONTEND_EVENT_STREAMING_STOPPED)
		control->set_streaming(false);
}

const char *obs_module_description(void)
{
	return "Secure VISP remote start and stop control for OBS streaming";
}

bool obs_module_load(void)
{
	obs_frontend_add_event_callback(frontend_event, NULL);
	obs_frontend_add_tools_menu_item("VISP Remote Control", open_settings, NULL);
	apply_config(load_config());
	obs_log(LOG_INFO, "plugin loaded successfully (version %s)", PLUGIN_VERSION);
	return true;
}

void obs_module_unload(void)
{
	obs_frontend_remove_event_callback(frontend_event, NULL);
	delete control;
	control = NULL;
	obs_log(LOG_INFO, "plugin unloaded");
}

#endif
