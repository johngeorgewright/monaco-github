import * as path from 'path'
import * as webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'

const config: webpack.Configuration = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } },
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: ['react-hot-loader/babel'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.woff2?$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new ForkTSCheckerPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
}

export default config
