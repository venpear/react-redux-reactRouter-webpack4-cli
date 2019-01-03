const path = require('path');
const webpack = require('webpack');
const argv = require('yargs-parser')(process.argv.slice(2));
// 区别是生产环境和开发环境
const prod = argv.mode == 'production' ? true : false;  
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
let plugin = [];
if (prod) {
  // 线上环境
	plugin.push(
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
		new CleanWebpackPlugin('dist')
	)
} else {
	//  开发环境
	plugin.push(
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
	)
}


module.exports = {
	// 入口文件
	entry: {
		index: './src/index.js',
		index2: './src/index2.js',
	},    
	output: {
		// 打包后的文件名称
		filename: prod ? '[name].[chunkhash].js' : '[name].js',
		// 打包后的目录，必须是绝对路径
		path: path.resolve('dist'),
		publicPath: "/"
	},
	module: {
		rules: [{
			enforce: "pre",
			test: /\.js$/,
			exclude: /node_modules/,
			include:/src/,
			loader: "eslint-loader",
		}, {
			test: /\.js$/,
			use: ['babel-loader'],
			include: /src/,             // 只转化src目录下的js
			exclude: /node_modules/     // 排除掉node_modules，优化打包速度
		}, {
			test: /\.less$/,            // 解析less
			use: ExtractTextWebpackPlugin.extract({
				fallback: "style-loader",	// 将css用link的方式引入就不再需要style-loader了
				use: ['css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析
			})
		}, {
			test: /\.scss$/,     // 解析scss
			use: ExtractTextWebpackPlugin.extract({
				fallback: "style-loader", // 将css用link的方式引入就不再需要style-loader了
				use: ['css-loader', 'postcss-loader', 'sass-loader'] // 从右向左解析
			})
		}, {
			test: /\.css$/,     // 解析css
			use: ExtractTextWebpackPlugin.extract({
				fallback: "style-loader", // 将css用link的方式引入就不再需要style-loader了
				use: ['css-loader', 'postcss-loader']
			})
		}, {
			test: /\.(jpe?g|png|gif)$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 8192,   					    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
					outputPath: 'images/'       // 图片打包后存放的目录
				}
			}]
		}, {
			test: /\.(htm|html)$/,
			use: 'html-withimg-loader'      // 打包页面img引用图片
		}, {
			test: /\.(eot|ttf|woff|svg)$/,  // 打包字体图片和svg图片
			use: 'file-loader'
		}]
	},
	plugins: plugin,
	devServer: {
		port: 3000,              // 端口
		open: true,              // 自动打开浏览器
		hot: true,               // 开启热更新
		overlay: true,           // 浏览器页面上显示错误
		historyApiFallback: true
	},
	resolve: {
		// 别名
		alias: {
			pages:path.join(__dirname,'src/pages'),
			component:path.join(__dirname,'src/component'),
			actions:path.join(__dirname,'src/redux/actions'),
			reducers:path.join(__dirname,'src/redux/reducers'),
		},
		// 省略后缀
		extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.less']
	},
  //  提取公共代码
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {   // 抽离第三方插件
					test: /node_modules/,   // 指定是node_modules下的第三方包
					chunks: 'initial',
					name: 'vendor',  // 打包后的文件名，任意命名    
					// 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
					priority: 10
				},
				utils: {
					// 抽离自己写的公共代码，utils这个名字可以随意起
					chunks: 'initial',
					name: 'utils',  // 任意命名
					minSize: 0      // 只要超出0字节就生成一个新包
				}
			}
		}
	},
	devtool: prod ? '' : 'inline-source-map'
}
