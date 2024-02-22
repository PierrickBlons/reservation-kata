using Reservation.Diagnostics;

namespace Reservation.Tests.Doubles;

public class SpyLogger : ILogger
{
    public List<string> Logs = new();
        
    public void Debug(string message) => Logs.Add($"DEBUG: {message}");

    public void Info(string message) => Logs.Add($"INFO: {message}");
    public void Error(string message) => Logs.Add($"ERROR: {message}");
}
