# VISP native client

The app publishes the selected camera and microphone to a saved VISP SRT URL. It requires a physical phone and a development build; Expo Go does not include the native SRT module.

Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_SERVER_URL` to the API origin reachable by the device. After Twitch sign-in, the app creates and securely stores its publish URL automatically.

Expo SDK 57 sets the deployment target to iOS 16.4, so this app cannot retain the original iOS 15 target without downgrading Expo. The upstream libsrt 1.5.4 x86_64 simulator slice is incomplete; arm64 iPhones and Apple-silicon simulators are supported.

```sh
bun install
cd apps/native
bun run ios
```

The generated `ios/` project is committed because it contains the HaishinKit Swift Package Manager dependency and inline Swift sources. If the iOS project is regenerated with Expo Prebuild, re-run `scripts/sync-haishinkit.rb` with the `xcodeproj` gem from CocoaPods before installing pods.

Android 7 or newer is supported through Expo Prebuild and the pinned RootEncoder dependency. Use a physical device with USB debugging enabled; Expo Go does not include the native SRT module.

```sh
bun install
cd apps/native
bun run android
```

The generated `android/` directory is intentionally ignored. Expo recreates it from `app.json`, the inline Kotlin module, and the RootEncoder config plugin.
