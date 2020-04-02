const path = require('path')
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
var dotenv = require('dotenv');

module.exports = () => {
  // call dotenv and it will return an Object with a parsed key 
  const env = dotenv.config().parsed;
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  return {
    entry: './app/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index_bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] }
      ]
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins: [
      new HtmlWebpackPlugin({
        template: 'app/index.html',
        favicon: 'app/images/headerImg.ico'
      }),
      new CopyPlugin([
        { from: '_redirects' }
      ]),
      new webpack.DefinePlugin(envKeys)
    ],
    devServer: {
      historyApiFallback: true
    }
  }
}