/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Expo's default Metro config only registers `ios` and `android` as
// platforms, so Metro never tries `foo.web.js` before `foo.js` during
// `expo export --platform web`. That leaves third-party .web.js shims
// (react-native-gesture-handler/getShadowNodeFromRef.web.js, etc.)
// unused and the web bundle pulls in native renderer internals. Add
// `web` to the platform list so `.web.js`/`.web.ts(x)` resolution kicks in.
config.resolver.platforms = [...(config.resolver.platforms ?? []), "web"];

// @instantdb/react-native has no web shim of its own, so alias it to
// the browser-friendly @instantdb/react on web.
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const delegate = defaultResolve ?? context.resolveRequest;
  if (platform === "web" && moduleName === "@instantdb/react-native") {
    return delegate(context, "@instantdb/react", platform);
  }
  return delegate(context, moduleName, platform);
};

module.exports = config;
