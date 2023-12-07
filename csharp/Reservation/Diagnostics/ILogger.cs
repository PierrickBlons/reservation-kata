namespace Reservation.Observability;

public interface ILogger
{
    void Debug(string message);
    void Info(string message);
}
