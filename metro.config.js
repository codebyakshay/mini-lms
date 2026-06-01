const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Patch Metro server to fix react-native-css compatibility issue with modern Metro versions
// react-native-css emits raw watcher events that cause DependencyGraph to crash
const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware(middleware, metroServer) {
    const bundler = metroServer.getBundler().getBundler();
    const watcher = bundler.getWatcher();
    if (watcher && !watcher.__patched_for_added_files__) {
      watcher.__patched_for_added_files__ = true;
      const originalEmit = watcher.emit;
      watcher.emit = function (event, payload, ...args) {
        if (event === "change" && payload && payload.eventsQueue && !payload.changes) {
          const rootDir = bundler._projectRoot || process.cwd();
          const files = payload.eventsQueue.map(e => [
            path.relative(rootDir, e.filePath),
            { modifiedTime: e.metadata.modifiedTime }
          ]);
          const formattedPayload = {
            changes: {
              addedFiles: [],
              modifiedFiles: files,
              removedFiles: []
            },
            rootDir
          };
          return originalEmit.call(this, "change", formattedPayload, ...args);
        }
        return originalEmit.call(this, event, payload, ...args);
      };
    }
    return originalEnhanceMiddleware ? originalEnhanceMiddleware(middleware, metroServer) : middleware;
  }
};

module.exports = withNativewind(config, {
  // inline variables break PlatformColor in CSS variables
  inlineVariables: false,
  // We add className support manually
  globalClassNamePolyfill: false,
});
