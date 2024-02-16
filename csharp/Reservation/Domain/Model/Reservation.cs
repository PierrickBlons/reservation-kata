namespace Reservation.Domain.Model;

public class Reservation(int pax, Stay stay)
{
    public int Pax => pax;
    public Stay Stay => stay;
}
