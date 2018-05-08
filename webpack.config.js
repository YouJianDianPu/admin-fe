/*
* @Author: YouJDP
* @Date:   2018-02-20 13:19:28
* @Last Modified by:   YouJDP
* @Last Modified time: 2018-04-18 15:24:13
*/

var webpack             = require('webpack');
var path                = require('path');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

// 环境变量, dev, (test), online
var WEBPACK_ENV            = process.env.WEBPACK_ENV || 'dev'; 

// webpack config
var config = {
    entry:{
        'app'       : ['./src/index.jsx']
    },
    externals:{
        '$'         :'window.jQuery',
        'jquery'    :'window.jQuery'
    },
    // path && publickPath
    output: {
        path        : __dirname + '/dist_back/',
        publicPath  : WEBPACK_ENV === 'online' ? '//s.happymmall.com/admin-fe/dist/' : '/dist_back/',
        filename    : 'js/[name].js'
    },
    resolve: {
        alias: {
            node_modules    : path.join(__dirname, '/node_modules'),
            lib             : path.join(__dirname, '/src/lib'),
            util            : path.join(__dirname, '/src/util'),
            component       : path.join(__dirname, '/src/component'),
            service         : path.join(__dirname, '/src/service'),
            page            : path.join(__dirname, '/src/page'),
            images          : path.join(__dirname, '/src/images')
        }
    },
    module: {
        // noParse: [],
        loaders: [
            {
                test: /\.css$/, loader: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback : 'style-loader'
                })
            },
            {test: /\.scss$/, loader: ExtractTextPlugin.extract({
                use: 'css-loader!sass-loader',
                fallback : 'style-loader'
            })},
            {test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=0&name=resource/[name].[ext]'},
            {test: /\.(string)$/, loader: 'html-loader' },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
        ]
    },
    plugins: [
        // 提出公共部分 
        new webpack.optimize.CommonsChunkPlugin({
            name        : 'vendors',
            filename    : 'js/base.js'
        }),
        // 单独处理css
        new ExtractTextPlugin('css/[name].css'),
        // html 加载
        new HtmlWebpackPlugin({
            filename        : 'view/index.html',
            title           : 'QS 后台管理系统',
            template        : './src/index.html',
            favicon         : './favicon.ico',
            inject          : true,
            hash            : true,
            chunks          : ['vendors', 'app'],
            chunksSortMode  : 'dependency',
            minify          : {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
    ]
};

// 开发环境下，使用devServer热加载
if(WEBPACK_ENV === 'dev'){
    config.entry.app.push('webpack-dev-server/client?http://localhost:8080');
}

module.exports = config;
