import merge from 'webpack-merge'
import common from './common'

export default merge(common, {
  entry: {
    'ts-react': './src/index.tsx',
  },
  mode: 'production',
})
