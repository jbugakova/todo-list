const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'bundle.css': [
          path.resolve(__dirname, './src/scss/styles.scss')
        ],
        'bundle.js': [
          path.resolve(__dirname, './src/js/app.js')
        ]
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/images/icon-tasklist.png'
        }),
        new ExtractTextPlugin('bundle.css')
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.css/,
                    loader: 'css!style!autoprefixer!?browsers=last 12 versions',
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images'
                        }
                    },
                ],
            }
        ]
    }
};