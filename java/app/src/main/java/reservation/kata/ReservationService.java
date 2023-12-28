package reservation.kata;

import com.codahale.metrics.MetricRegistry;
import org.slf4j.Logger;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.slf4j.LoggerFactory.getLogger;

class ReservationService {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final MetricRegistry metrics;

    public ReservationService(MetricRegistry metrics) {
        this.metrics = metrics;
    }
    private static final Logger log = getLogger(ReservationService.class);


    public ConfirmedReservation make(String hotelName, int paxNumber, LocalDate start, LocalDate end) {
        log.debug("Start making reservation");

        if ("Unknown Hotel".equals(hotelName)) {
            log.error("Hotel not found, can't proceed with reservation");
            return null;
        }

        var searchRoom = new Reservation.Builder().forHotel(hotelName);
        log.debug("Hotel {} has available rooms", hotelName);

        var searchRoomWithOccupancy = searchRoom.withOccupancy(paxNumber);
        log.debug("Room found for {} people", paxNumber);

        var reservation = searchRoomWithOccupancy.withStayPeriod(start, end).build();
        log.debug("Room available from {} to {}", start.format(formatter), end.format(formatter));

        var confirmedReservation = reservation.confirm();
        log.info("Reservation {} is confirmed", confirmedReservation.reference());
        metrics.counter(hotelName + ".reservations").inc();
        return confirmedReservation;
    }
}
