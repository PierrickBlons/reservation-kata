using Reservation.Observability;

namespace Reservation.Tests.Doubles;

public class DummyLogger : ILogger
{
    public void Debug(string message) { }

    public void Info(string message) {}
}