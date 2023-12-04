module.exports = function override(config, env) {
    // 确保 fallback 字段存在
    config.resolve.fallback = config.resolve.fallback || {};
    
    // 添加 buffer 和 timers 的 polyfill
    config.resolve.fallback.buffer = require.resolve('buffer/');
    config.resolve.fallback.timers = require.resolve('timers-browserify');
    config.resolve.fallback.stream = require.resolve('stream-browserify');

    return config;
  };
  