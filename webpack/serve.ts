import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const config: Configuration = {
  devServer: {
    hot: true,
    static: {
      directory: './dist',
    },
  },
}

export default config
