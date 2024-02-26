package reservation.kata;

import com.codahale.metrics.Counter;
import com.codahale.metrics.MetricRegistry;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class ReservationServiceTest {

    @Test
    public void givesConfirmedReservationMatchingTheSearchCriteria() {
        String hotelName = "La Corniche";
        int paxNumber = 2;
        LocalDate begin = LocalDate.of(2023, 12, 1);
        LocalDate end = LocalDate.of(2023, 12, 5);
        MetricRegistry metricRegistry = mock(MetricRegistry.class);
        given(metricRegistry.counter("La Corniche.reservations")).willReturn(mock(Counter.class));
        var reservationService = new ReservationService(metricRegistry);

        var confirmedReservation = reservationService.make(hotelName, paxNumber, begin, end);

        assertNotNull(confirmedReservation);
        assertEquals(hotelName, confirmedReservation.hotel());
        assertEquals(paxNumber, confirmedReservation.pax());
        assertEquals(begin, confirmedReservation.stay().start());
        assertEquals(end, confirmedReservation.stay().end());
        assertEquals("GHRKJIK-45", confirmedReservation.reference());
    }

    @Test
    public void givesNullWhenHotelIsNotFound() {
        String hotelName = "Unknown Hotel";
        var reservationService = new ReservationService(mock(MetricRegistry.class));

        var confirmedReservation = reservationService.make(hotelName, 3, LocalDate.now(), LocalDate.now());

        assertNull(confirmedReservation);
    }
}

