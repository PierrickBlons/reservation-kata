namespace Reservation.Domain.Model;

public class ReservationBuilder
{
    private int _paxNumber;
    private Stay _stay;

    public ReservationBuilder WithOccupancy(int paxNumber)
    {
        _paxNumber = paxNumber;
        return this;
    }

    public ReservationBuilder WithStayPeriod((DateTime begin, DateTime end) stay)
    {
        _stay = new Stay(stay.begin, stay.end);
        return this;
    }

    public Reservation Build() => new(_paxNumber, _stay);
}
