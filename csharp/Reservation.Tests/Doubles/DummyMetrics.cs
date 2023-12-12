using Reservation.Diagnostics;

namespace Reservation.Tests.Doubles;

public class DummyMetrics : IMetrics
{
    public void Increment(string metricName) {}
}