/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const slsw = require('serverless-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const isLocal = slsw.lib.webpack.isLocal
// TODO - migration files unbundle - https://github.com/typeorm/typeorm/blob/master/docs/faq.md#how-to-use-webpack-for-the-backend
// * N.B. Maybe optimization object prevents reloading
module.exports = {
  optimization: {
    minimize: false
  },
  mode: isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.ts']
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              useCache: true,
              babelCore: '@babel/core'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CheckerPlugin(),
    new HardSourceWebpackPlugin()
  ]
}
