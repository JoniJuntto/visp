const {
	withProjectBuildGradle,
	withXcodeProject,
} = require("expo/config-plugins");

const dependency = "com.github.pedroSG94.RootEncoder:library:2.7.5";
const haishinKit = {
	name: "HaishinKit.swift",
	url: "https://github.com/HaishinKit/HaishinKit.swift.git",
	version: "2.2.5",
	products: ["HaishinKit", "SRTHaishinKit"],
};
const libsrtPhaseName = "[VISP] Select libsrt";
const libsrtLinkerFlag = '"-Wl,-force_load,$(DERIVED_FILE_DIR)/libsrt.a"';
// Archive sets BUILD_DIR under ArchiveIntermediates, so ../../SourcePackages is wrong.
// ${BUILD_DIR%Build/*}SourcePackages works for both regular and archive builds.
const libsrtScript = `set -eu
case "\${PLATFORM_NAME}" in
  iphoneos) slice="ios-arm64" ;;
  iphonesimulator) slice="ios-arm64_x86_64-simulator" ;;
  *) echo "Unsupported VISP platform: \${PLATFORM_NAME}" >&2; exit 1 ;;
esac
artifact_rel="SourcePackages/artifacts/haishinkit.swift/libsrt/libsrt.xcframework"
candidates="\${BUILD_DIR%Build/*}\${artifact_rel}
\${BUILD_DIR}/../../\${artifact_rel}
\${BUILD_DIR}/../\${artifact_rel}"
root=""
for candidate in $candidates; do
  if [ -f "\${candidate}/\${slice}/libsrt.a" ]; then
    root="$candidate"
    break
  fi
done
if [ -z "$root" ]; then
  echo "error: libsrt.a not found for slice \${slice}" >&2
  echo "BUILD_DIR=\${BUILD_DIR}" >&2
  echo "Tried:" >&2
  printf '  %s\\n' $candidates >&2
  exit 1
fi
cp -f "\${root}/\${slice}/libsrt.a" "\${DERIVED_FILE_DIR}/libsrt.a"
`;
const block = `
// Expo inline Kotlin sources compile in the :expo project.
project(":expo") {
  afterEvaluate {
    dependencies.add("implementation", "${dependency}")
  }
}

// RootEncoder 2.7.5 publishes Kotlin 2.3 metadata while Expo SDK 57 uses 2.1.
// Keep Expo's supported toolchain and relax only the affected compile boundaries.
gradle.projectsEvaluated {
  [project(":app"), project(":expo")].each { target ->
    target.tasks.matching {
      it.name.startsWith("compile") && it.name.endsWith("Kotlin")
    }.configureEach {
      compilerOptions.freeCompilerArgs.add("-Xskip-metadata-version-check")
    }
  }
}
`;

function addReference(list, value, comment) {
	if (!list.some((item) => item.value === value)) {
		list.push({ value, comment });
	}
}

function addHaishinKit(project) {
	const objects = project.hash.project.objects;
	const { firstProject } = project.getFirstProject();
	const { uuid: targetId, firstTarget: target } = project.getFirstTarget();
	const packageComment = `XCRemoteSwiftPackageReference "${haishinKit.name}"`;
	const packages = (objects.XCRemoteSwiftPackageReference ??= {});
	let packageId = Object.entries(packages).find(
		([key, value]) =>
			!key.endsWith("_comment") && value.repositoryURL.includes(haishinKit.url),
	)?.[0];

	if (!packageId) {
		packageId = project.generateUuid();
		packages[packageId] = {
			isa: "XCRemoteSwiftPackageReference",
			repositoryURL: `"${haishinKit.url}"`,
			requirement: { kind: "exactVersion", version: haishinKit.version },
		};
		packages[`${packageId}_comment`] = packageComment;
	}

	firstProject.packageReferences ??= [];
	addReference(firstProject.packageReferences, packageId, packageComment);
	target.packageProductDependencies ??= [];

	const products = (objects.XCSwiftPackageProductDependency ??= {});
	const buildFiles = objects.PBXBuildFile;
	const frameworks = project.pbxFrameworksBuildPhaseObj(targetId);
	for (const productName of haishinKit.products) {
		let productId = Object.entries(products).find(
			([key, value]) =>
				!key.endsWith("_comment") &&
				value.package === packageId &&
				value.productName === productName,
		)?.[0];
		if (!productId) {
			productId = project.generateUuid();
			products[productId] = {
				isa: "XCSwiftPackageProductDependency",
				package: packageId,
				package_comment: packageComment,
				productName,
			};
			products[`${productId}_comment`] = productName;
		}
		addReference(target.packageProductDependencies, productId, productName);

		let buildFileId = Object.entries(buildFiles).find(
			([key, value]) =>
				!key.endsWith("_comment") && value.productRef === productId,
		)?.[0];
		if (!buildFileId) {
			buildFileId = project.generateUuid();
			buildFiles[buildFileId] = {
				isa: "PBXBuildFile",
				productRef: productId,
				productRef_comment: productName,
			};
			buildFiles[`${buildFileId}_comment`] = `${productName} in Frameworks`;
		}
		addReference(frameworks.files, buildFileId, `${productName} in Frameworks`);
	}

	let phaseRef = target.buildPhases.find(
		(phase) => phase.comment === libsrtPhaseName,
	);
	if (!phaseRef) {
		const phase = project.addBuildPhase(
			[],
			"PBXShellScriptBuildPhase",
			libsrtPhaseName,
			targetId,
			{
				inputPaths: [],
				outputPaths: ['"$(DERIVED_FILE_DIR)/libsrt.a"'],
				shellPath: "/bin/sh",
				shellScript: libsrtScript,
			},
		);
		phase.buildPhase.inputFileListPaths = [];
		phase.buildPhase.outputFileListPaths = [];
		phaseRef = target.buildPhases.at(-1);
	}
	target.buildPhases = [
		phaseRef,
		...target.buildPhases.filter((phase) => phase !== phaseRef),
	];

	const configList = objects.XCConfigurationList[target.buildConfigurationList];
	for (const { value } of configList.buildConfigurations) {
		const settings = objects.XCBuildConfiguration[value].buildSettings;
		settings['"EXCLUDED_ARCHS[sdk=iphonesimulator*]"'] = "x86_64";
		const flags = settings.OTHER_LDFLAGS;
		settings.OTHER_LDFLAGS = Array.isArray(flags)
			? flags
			: flags
				? [flags]
				: ['"$(inherited)"'];
		if (!settings.OTHER_LDFLAGS.includes(libsrtLinkerFlag)) {
			settings.OTHER_LDFLAGS.push(libsrtLinkerFlag);
		}
	}

	return project;
}

module.exports = function withVispSrt(config) {
	config = withProjectBuildGradle(config, (config) => {
		if (!config.modResults.contents.includes(dependency)) {
			config.modResults.contents += block;
		}
		return config;
	});
	return withXcodeProject(config, (config) => {
		config.modResults = addHaishinKit(config.modResults);
		return config;
	});
};
