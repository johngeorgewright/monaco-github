import * as path from 'path'
import * as webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config: webpack.Configuration = {
  devtool: 'source-map',
  entry: {
    editor: './src/editor.ts',
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker.js',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker.js',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker.js',
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker.js',
    'yaml.worker': 'monaco-yaml/lib/esm/yaml.worker.js',
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
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
    new CopyPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
        },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'editor.html',
      template: './src/editor.html',
      title: 'Monaco GitHub',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      buffer: require.resolve('buffer/'),
    },
  },
  output: {
    clean: true,
    asyncChunks: false,
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
}

export default config
