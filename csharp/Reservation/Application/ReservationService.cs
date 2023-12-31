using Reservation.Diagnostics;
using Reservation.Domain.Model;

namespace Reservation.Application;

public class ReservationService(ILogger logger, IMetrics metrics)
{
    public ConfirmedReservation Make(string hotelName, int paxNumber, (DateTime begin, DateTime end) stay)
    {
        logger.Debug($"{nameof(ReservationService)} : Start making reservation");

        if (hotelName == "Unknown Hotel")
        {
            logger.Error("Hotel not found, can't proceed with reservation");
            return null;
        }

        var searchRoom = new ReservationBuilder().ForHotel(hotelName);
        logger.Debug($"{nameof(ReservationService)} : Hotel {hotelName} has available rooms");

        var searchRoomWithOccupancy = searchRoom.WithOccupancy(paxNumber);
        logger.Debug($"{nameof(ReservationService)} : Room found for {paxNumber} people");

        var reservation = searchRoomWithOccupancy.WithStayPeriod(stay).Build();
        logger.Debug($"{nameof(ReservationService)} : Room available from {stay.begin:yyyyMMdd} to {stay.end:yyyyMMdd}");

        var confirmedReservation = reservation.Confirm();
        logger.Info($"{nameof(ReservationService)} : Reservation {confirmedReservation.Reference} is confirmed");
        metrics.Increment($"{hotelName}.reservations");
        return confirmedReservation;
    }
}
