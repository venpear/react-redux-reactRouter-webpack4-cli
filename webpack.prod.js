const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
			template: './src/index.html',
			// 会在打包好的bundle.js后面加上hash串
			hash: true,
			// 引入需要的chunk
			chunks: ['vendor', 'index', 'utils']
		}),
		// 拆分后会把css文件放到dist目录下的css/style.css
		new ExtractTextWebpackPlugin('css/style.[chunkhash].css'),
		new ExtractTextWebpackPlugin('css/reset.[chunkhash].css'),
		new CleanWebpackPlugin('dist'),
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
})