using Reservation.Diagnostics;
using Reservation.Domain.Model;
using Reservation.Infrastructure;

namespace Reservation.Application
{
    public class ReservationService(ILogger logger, IMetrics metrics, InMemoryHotelRepository inMemoryHotelRepository)
    {
        public Result<ConfirmedReservation> Make(string hotelName, int paxNumber, (DateTime begin, DateTime end) stay)
        {
            logger.Debug($"{nameof(ReservationService)} : Start making reservation");

            var registeredHotel = inMemoryHotelRepository.IsRegistered(hotelName);
            if (registeredHotel == null)
            {
                var hotelNotRegisteredMessage = $"{nameof(ReservationService)} : Hotel {hotelName} is not registered in our reservation system";
                logger.Debug(hotelNotRegisteredMessage);
                return Result.Fail<ConfirmedReservation>(hotelNotRegisteredMessage);
            }

            if (!registeredHotel.HasAvailableRooms(stay))
            {
                var roomNotAvailableMessage = $"Hotel {hotelName} doesn't have room for the selected period";
                logger.Debug($"{ nameof(ReservationService)} : {roomNotAvailableMessage}");
                metrics.Increment($"{hotelName}.reservations.roomNotAvailable");
                return Result.Fail<ConfirmedReservation>(roomNotAvailableMessage);
            }

            logger.Debug($"{nameof(ReservationService)} : Hotel {hotelName} has available rooms");

            if (!registeredHotel.HasRoomForOccupancy(paxNumber))
            {
                var noRoomFoundMessage = $"No room found for {paxNumber} people";
                logger.Debug($"{nameof(ReservationService)} : {noRoomFoundMessage}");
                metrics.Increment($"{hotelName}.reservations.occupancyNotAvailable");
                return Result.Fail<ConfirmedReservation>(noRoomFoundMessage);
            }
            logger.Debug($"{nameof(ReservationService)} : Room found for {paxNumber} people");

            var reservation = registeredHotel.InitializeReservation(stay, paxNumber);
            logger.Debug($"{nameof(ReservationService)} : Room available from {stay.begin:yyyyMMdd} to {stay.end:yyyyMMdd}");

            var confirmedReservation = registeredHotel.Confirm(reservation);
            logger.Info($"{nameof(ReservationService)} : Reservation {confirmedReservation.Reference} is confirmed");

            metrics.Increment($"{hotelName}.reservations");

            return Result.Ok(confirmedReservation);
        }
    }
}
