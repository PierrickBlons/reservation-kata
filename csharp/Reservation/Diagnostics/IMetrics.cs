namespace Reservation.Diagnostics;

public interface IMetrics
{
    void Increment(string metricName);
}