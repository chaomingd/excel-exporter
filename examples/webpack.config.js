const path = require('path')
const webpack = require('webpack');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname,'./index.ts'),
  devtool: 'inline-sourcemap',
  mode: 'development',
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: 'main.js',
  },
  devServer: {
    port: 3000,
    hot: true,
    contentBase: path.resolve(__dirname,'public'),
    publicPath: '/',
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { 
        test: /\.(js|jsx|mjs)$/, 
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts", ".js"],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html'
    })
  ]
}