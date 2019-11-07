const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
  // Make src files outside of this dir resolve modules in our node_modules folder
  if (!config.resolve) {
    config.resolve = {};
  }

  config.resolve.modules = [
    path.resolve(__dirname, '.'),
    path.resolve(__dirname, 'node_modules'),
    'node_modules',
  ];

  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(new webpack.EnvironmentPlugin(['MapboxAccessToken']));

  return config;
};
