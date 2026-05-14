/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string
  export default src
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism/one-dark.js' {
  import type { CSSProperties } from 'react'
  const styles: Record<string, CSSProperties>
  export default styles
}
