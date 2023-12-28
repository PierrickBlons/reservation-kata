package reservation.kata;

import com.codahale.metrics.MetricRegistry;

import java.time.LocalDate;

public class App {

    public static void main(String[] args) {
        ReservationService reservationService = new ReservationService(new MetricRegistry());

        LocalDate start = LocalDate.now().plusDays(7);
        String hotelName = "Raffles";
        int paxNumber = 2;

        reservationService.make(hotelName, paxNumber, start, start.plusDays(7));
    }
}
