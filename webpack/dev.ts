import merge from 'webpack-merge'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import common from './common'
import serve from './serve'

export default merge(common, serve, {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [new ForkTSCheckerPlugin()],
})
