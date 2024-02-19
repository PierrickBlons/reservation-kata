using NFluent;
using Reservation.Application;
using Reservation.Infrastructure;
using Reservation.Tests.Doubles;

namespace Reservation.Tests
{
    public class ReservationServiceMakeShould
    {
        [Fact]
        public void Gives_ConfirmedReservation_matching_the_search_criteria()
        {
            const string? hotelName = "La Corniche";
            const int paxNumber = 2;
            var (begin, end) = (DateTime.Now.AddDays(12), DateTime.Now.AddDays(18));

            var dummyLogger = new DummyLogger();
            var confirmedReservation = new ReservationService(dummyLogger, new DummyMetrics(), new InMemoryHotelRepository(dummyLogger))
                .Make(hotelName, paxNumber, (begin, end))
                .Value;

            Check.That(confirmedReservation.Hotel).Equals(hotelName);
            Check.That(confirmedReservation.Pax).Equals(paxNumber);
            Check.That(confirmedReservation.Stay.Begin).Equals(begin);
            Check.That(confirmedReservation.Stay.End).Equals(end);
            Check.That(confirmedReservation.Reference).Equals("GHRKJIK-45");
        }

        [Fact]
        public void Gives_notRegisteredHotel_when_hotel_is_not_found()
        {
            const string? hotelName = "Unknown Hotel";

            var dummyLogger = new DummyLogger();
            var failedReservation = new ReservationService(dummyLogger, new DummyMetrics(), new InMemoryHotelRepository(dummyLogger))
                .Make(hotelName, 3, (new DateTime(), new DateTime()));

            Check.That(failedReservation.Error).Equals("ReservationService : Hotel Unknown Hotel is not registered in our reservation system");
        }

        [Fact]
        public void Gives_roomNotAvailable_when_hotel_is_not_found()
        {
            const string hotelName = "Sofitel";

            var dummyLogger = new DummyLogger();
            var failedReservation = new ReservationService(dummyLogger, new DummyMetrics(), new InMemoryHotelRepository(dummyLogger))
                .Make(hotelName, 3, (DateTime.Now.AddDays(-10), DateTime.Now.AddDays(-8)));

            Check.That(failedReservation.Error).Equals($"Hotel {hotelName} doesn't have room for the selected period");
        }

        [Fact]
        public void Gives_occupancyNotAvailable_when_hotel_is_not_found()
        {
            const string hotelName = "Continental";

            var dummyLogger = new DummyLogger();
            var paxNumber = 42;
            var failedReservation = new ReservationService(dummyLogger, new DummyMetrics(), new InMemoryHotelRepository(dummyLogger))
                .Make(hotelName, paxNumber, (DateTime.Now.AddDays(6), DateTime.Now.AddDays(9)));

            Check.That(failedReservation.Error).Equals($"No room found for {paxNumber} people");
        }
    }
}
