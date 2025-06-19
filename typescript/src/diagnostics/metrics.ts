type Metrics = {
  increment: (metricName: string) => void
}

export const metrics = {
  increment: (metricName: string) => {
    console.log(`Metric incremented: ${metricName}`)
  },
}

export const spyMetrics = (
  metricsBucket: Array<{ name: string; value: number }>,
) =>
  ({
    increment: (metricName: string) => {
      metricsBucket.push({ name: metricName, value: 1 }) // simple here has we won't have test making multiple reservations on the same hotel
    },
  }) satisfies Metrics

export default Metrics
