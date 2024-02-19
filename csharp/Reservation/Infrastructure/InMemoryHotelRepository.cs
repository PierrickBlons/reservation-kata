using Reservation.Diagnostics;
using Reservation.Domain.Model;

namespace Reservation.Infrastructure;

public class InMemoryHotelRepository
{
    private readonly ILogger _logger;

    public InMemoryHotelRepository(ILogger logger)
    {
        _logger = logger;
    }

    public RegisteredHotel IsRegistered(string hotelName)
    {
        if (hotelName == "Unknown Hotel")
        {
            _logger.Error("Hotel not found, can't proceed with reservation");
            return null;
        }

        return new RegisteredHotel(hotelName);
    }
}