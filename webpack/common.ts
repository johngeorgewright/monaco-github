import * as path from 'path'
import * as webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import MonacoEditorPlugin from 'monaco-editor-webpack-plugin'

const config: webpack.Configuration = {
  devtool: 'source-map',
  entry: {
    'monaco-github': './src/index.ts',
    // 'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    // 'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    // 'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    // 'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    // 'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
  },
  module: {
    rules: [
      {
        test: /\.(c|m)?(j|t)s?$/,
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
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|woff2?)$/,
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
    new MonacoEditorPlugin({
      customLanguages: [
        {
          label: 'yaml',
          entry: [],
          worker: {
            id: 'yaml',
            entry: 'monaco-yaml/lib/esm/yaml.worker',
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      buffer: require.resolve('buffer/'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
}

export default config
