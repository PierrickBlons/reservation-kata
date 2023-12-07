namespace Reservation.Domain.Model;

public class ConfirmedReservation(string hotel, int pax, Stay stay, string reference)
{
    public string Hotel => hotel;
    public int Pax => pax;
    public Stay Stay => stay;
    public string Reference => reference;
}
