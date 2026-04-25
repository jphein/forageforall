import type { ExpoConfig } from "expo/config";

/**
 * Expo app config.
 *
 * Before building you MUST set these env vars (see .env.example):
 *   GOOGLE_MAPS_IOS_KEY, GOOGLE_MAPS_ANDROID_KEY, INSTANT_APP_ID
 *   EXPO_PUBLIC_GOOGLE_MAPS_WEB_KEY  (web only — HTTP-referrer restricted key)
 */
const config: ExpoConfig = {
  name: "Forage for All",
  slug: "forage-for-all",
  owner: "kasdf",
  scheme: "forage",
  version: "0.1.5",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#F4EDDC",
  },
  ios: {
    bundleIdentifier: "org.forageforall.app",
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_KEY,
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Forage needs your location to show nearby finds and to center the map. Your location is never sold or shared.",
      NSCameraUsageDescription:
        "Take photos of fruit trees and edible plants to share with the community.",
      NSPhotoLibraryUsageDescription:
        "Attach photos of your finds from your photo library.",
    },
  },
  android: {
    package: "org.forageforall.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#F4EDDC",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY,
      },
    },
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
    ],
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow Forage to use your location to show what's ripe nearby.",
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow Forage to access your camera to document finds.",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "Allow Forage to access photos to attach to listings.",
      },
    ],
  ],
  extra: {
    instantAppId:
      process.env.INSTANT_APP_ID ?? "32870e24-647d-452a-ab13-fdaa0a8d8564",
    router: { origin: false },
    eas: {
      projectId: "19ec7145-38b0-4627-bf42-7ae7332d44e8",
    },
  },
  experiments: {
    // GitHub Pages serves the web bundle at /forageforall/app/, so every
    // static asset URL in index.html needs to be prefixed with that path.
    // Overridable at build time — `expo start --web` doesn't need it, and
    // a custom deploy target (Vercel, etc.) can pass its own value.
    baseUrl: process.env.EXPO_BASE_URL ?? "",
  },
};

export default config;
