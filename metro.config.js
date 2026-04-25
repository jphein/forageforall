/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// On web, @instantdb/react-native pulls in react-native platform internals
// that Metro cannot resolve. Alias it to the web-compatible package instead.
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "@instantdb/react-native") {
    return (defaultResolve ?? context.resolveRequest)(
      context,
      "@instantdb/react",
      platform,
    );
  }
  return (defaultResolve ?? context.resolveRequest)(
    context,
    moduleName,
    platform,
  );
};

module.exports = config;
