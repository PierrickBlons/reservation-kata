namespace Reservation.Domain.Model;

public class Reservation(string hotel, int pax, Stay stay)
{
    public int Pax => pax;
    public Stay Stay => stay;
    public string Hotel => hotel;

    public ConfirmedReservation Confirm() => new(Hotel, Pax, Stay, "GHRKJIK-45");
}
