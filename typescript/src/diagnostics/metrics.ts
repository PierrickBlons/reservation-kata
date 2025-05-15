type Metrics = {
  increment: (metricName: string) => void
}

export const metrics = {
  increment: (metricName: string) => {
    console.log(`Metric incremented: ${metricName}`)
  },
}

export default Metrics
