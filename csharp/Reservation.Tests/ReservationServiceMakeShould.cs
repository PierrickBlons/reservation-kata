using NFluent;
using Reservation.Application;
using Reservation.Observability;

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
        
            var confirmedReservation = new ReservationService(new DummyLogger()).Make(hotelName, paxNumber, (begin, end));

            Check.That(confirmedReservation.Hotel).Equals(hotelName);
            Check.That(confirmedReservation.Pax).Equals(paxNumber);
            Check.That(confirmedReservation.Stay.Begin).Equals(begin);
            Check.That(confirmedReservation.Stay.End).Equals(end);
            Check.That(confirmedReservation.Reference).Equals("GHRKJIK-45");
        }
    }

    public class DummyLogger : ILogger
    {
        public void Debug(string message) { }

        public void Info(string message) {}
    }
}
