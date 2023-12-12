using NFluent;
using Reservation.Application;
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
            var (begin, end) = (new DateTime(2023, 12, 01), new DateTime(2023, 12, 05));
        
            var confirmedReservation = new ReservationService(new DummyLogger(), new DummyMetrics()).Make(hotelName, paxNumber, (begin, end));

            Check.That(confirmedReservation.Hotel).Equals(hotelName);
            Check.That(confirmedReservation.Pax).Equals(paxNumber);
            Check.That(confirmedReservation.Stay.Begin).Equals(begin);
            Check.That(confirmedReservation.Stay.End).Equals(end);
            Check.That(confirmedReservation.Reference).Equals("GHRKJIK-45");
        }

        [Fact]
        public void Gives_null_when_hotel_is_not_found()
        {
            const string? hotelName = "Unknown Hotel";
            
            var confirmedReservation = new ReservationService(new DummyLogger(), new DummyMetrics()).Make(hotelName, 3, (new DateTime(), new DateTime()));

            Check.That(confirmedReservation).IsNull();
        }
    }
}
