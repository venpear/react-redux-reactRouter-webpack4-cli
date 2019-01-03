const webpack = require('webpack');
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 3000,              // 端口
		open: true,              // 自动打开浏览器
		hot: true,               // 开启热更新
		overlay: true,           // 浏览器页面上显示错误
		historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 引入需要的chunk
      chunks: ['vendor', 'index', 'utils']  
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin('css/style.css'),
    new ExtractTextWebpackPlugin('css/reset.css'),
    // 热更新，热更新不是刷新
    new webpack.HotModuleReplacementPlugin(),
  ]
})