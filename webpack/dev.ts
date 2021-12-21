import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import common from './common'
import serve from './serve'

export default merge(common, serve, {
  entry: {
    'ts-react': ['react-hot-loader/patch', './src/index.tsx'],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '@mol-ads/control-panel',
    }),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
})
