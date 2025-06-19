type Logger = {
  error: (log: string) => void
  debug: (log: string) => void
  info: (log: string) => void
}

type LogLevel = 'info' | 'debug' | 'error'

export const spyLogger = (
  logsBucket: Array<{ level: LogLevel; log: string }>,
) =>
  ({
    error: (log: string) => logsBucket.push({ level: 'error', log }),
    debug: (log: string) => logsBucket.push({ level: 'debug', log }),
    info: (log: string) => logsBucket.push({ level: 'info', log }),
  }) satisfies Logger

export default Logger
