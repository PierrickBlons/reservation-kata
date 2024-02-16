namespace Reservation.Domain.Model;

public class RegisteredHotel(string hotelName)
{
    private readonly List<Reservation> _reservations = new();

    public bool HasAvailableRooms((DateTime begin, DateTime end) stay) => stay.begin > DateTime.Now;

    public bool HasRoomForOccupancy(int paxNumber) => paxNumber < 10;

    public Reservation InitializeReservation((DateTime begin, DateTime end) stay, int paxNumber)
    {
        var reservation = new ReservationBuilder()
            .WithOccupancy(paxNumber)
            .WithStayPeriod(stay)
            .Build();

        _reservations.Add(reservation);

        return reservation;
    }

    public ConfirmedReservation Confirm(Reservation reservation) =>
        new(hotelName, reservation.Pax, reservation.Stay, "GHRKJIK-45");
}
