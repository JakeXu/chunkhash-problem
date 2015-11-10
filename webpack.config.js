var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var webpack = require('webpack');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

var out = path.join(__dirname, 'build');

// clear output
rimraf.sync(out);
fs.mkdirSync(out);

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    main: ['./entry.js'],
    vendor: ['./vendor.js']
  },

  output: {
    path: out,
    filename: '[name].[chunkhash].js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),

    new webpack.optimize.CommonsChunkPlugin({name: 'meta', chunks: ['vendor']}),

    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest'
    }),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.OccurenceOrderPlugin(true),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  }
};
