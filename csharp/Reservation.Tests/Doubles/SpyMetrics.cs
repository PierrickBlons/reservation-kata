using Reservation.Diagnostics;

namespace Reservation.Tests.Doubles;

public class SpyMetrics : IMetrics
{
    public Dictionary<string, int> Metrics = new();

    public void Error(string message) => throw new NotImplementedException();
    public void Increment(string metricName) => Metrics.Add(metricName, 1);
}