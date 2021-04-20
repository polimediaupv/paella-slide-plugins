const path = require('path');
const config = require('./webpack.common');

config.entry = './src/index.js',
config.output = {
	path: path.join(__dirname, "dist"),
	filename: 'paella-slide-plugins.js',
	library: 'paella-slide-plugins',
	libraryTarget: 'umd'
};

module.exports = config;