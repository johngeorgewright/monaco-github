import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

export interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const config: Configuration = {
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: './dist',
    },
  },
}

export default config
