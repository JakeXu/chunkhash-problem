var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    
    new webpack.NamedModulesPlugin(),
    
    new webpack.optimize.DedupePlugin(),
    
    new HtmlWebpackPlugin({
      excludeChunks: ['manifest'],
      templateContent: function(templateParams, compilation) {
        Object.keys(compilation.assets).forEach((key) => {
          if (key.indexOf('manifest.') === 0) {
            templateParams.chunkManifest = compilation.assets[key]._value;
            delete compilation.assets[key];
          }
        })

        var indexTemplate = fs.readFileSync(path.resolve('./index.html'), 'utf8');
        var tmpl = require('blueimp-tmpl');

        return tmpl(indexTemplate, templateParams);
      },

      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),

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
