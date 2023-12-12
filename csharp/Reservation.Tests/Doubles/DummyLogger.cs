using Reservation.Diagnostics;

namespace Reservation.Tests.Doubles;

public class DummyLogger : ILogger
{
    public void Debug(string message) {}

    public void Info(string message) {}
    public void Error(string message) {}
}
