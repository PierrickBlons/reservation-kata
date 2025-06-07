interface Logger {
  error: (message: string) => void
  debug: (message: string) => void
  info: (message: string) => void
}

export default Logger
