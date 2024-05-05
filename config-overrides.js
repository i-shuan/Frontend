module.exports = function override(config, env) {
  // Ensure the fallback field exists in the resolve object
  config.resolve.fallback = config.resolve.fallback || {};

  // Add polyfills for buffer, timers, and stream
  config.resolve.fallback.buffer = require.resolve('buffer/');
  config.resolve.fallback.timers = require.resolve('timers-browserify');
  config.resolve.fallback.stream = require.resolve('stream-browserify');

  // Modify the webpack rules to safely exclude @mediapipe/tasks-vision from source-map-loader
  config.module.rules = config.module.rules.map(rule => {
      if (rule.loader && rule.loader.includes('source-map-loader')) {
          if (Array.isArray(rule.exclude)) {
              rule.exclude.push(/@mediapipe[\\/]tasks-vision/);
          } else if (rule.exclude) {
              // Convert existing exclusion to an array if it isn't already
              rule.exclude = [rule.exclude, /@mediapipe[\\/]tasks-vision/];
          } else {
              // Set the exclude property as a new array with the needed exclusion
              rule.exclude = [/@mediapipe[\\/]tasks-vision/];
          }
      }
      return rule;
  });

  return config;
};
