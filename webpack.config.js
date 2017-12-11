var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9000,
  },
  plugins: [new HtmlWebpackPlugin(), new CopyWebpackPlugin([{ from: 'src/models', to: 'models' }])],
};