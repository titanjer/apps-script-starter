/**
 * @file webpack.config.js
 * @author Amit Agarwal
 * @email amit@labnol.org
 *
 * Google Apps Script Starter Kit
 * https://github.com/labnol/apps-script-starter
 */

const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const destination = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'none',
  context: __dirname,
  entry: `${src}/index.ts`,
  output: {
    filename: `code.[contentHash].js`,
    path: destination,
    libraryTarget: 'this',
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          mangle: {},
          compress: {
            drop_console: false,
            drop_debugger: isProduction,
          },
          output: {
            beautify: !isProduction,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: true,
          failOnError: false,
          fix: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${src}/**/*.html`,
          flatten: true,
          to: destination,
        },
        {
          from: `${src}/../appsscript.json`,
          to: destination,
        },
        {
          from: `${src}/../functions/*.js`,
          to: destination,
          flatten: true,
        },
      ],
    }),
    new GasPlugin({
      comments: false,
      source: 'digitalinspiration.com',
    }),
  ],
};
