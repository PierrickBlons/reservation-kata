export interface Metrics {
  increment: (metricName: string) => void
}

export class MetricsImpl implements Metrics {
  increment(metricName: string): void {
    console.log(`Metric incremented: ${metricName}`)
  }
}
