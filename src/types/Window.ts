import type { Environment as MonacoEnvironment } from 'monaco-editor'

declare global {
  interface Window {
    MonacoEnvironment: MonacoEnvironment
  }
}

export {}
