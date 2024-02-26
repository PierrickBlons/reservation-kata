package reservation.kata;

import java.time.LocalDate;

public record Reservation(String hotel, int pax, Stay stay) {

    public ConfirmedReservation confirm() {
        return new ConfirmedReservation(hotel, pax, stay, "GHRKJIK-45");
    }

    public static class Builder {
        private String hotelName;
        private int paxNumber;
        private Stay stay;

        public Builder forHotel(String hotelName) {
            this.hotelName = hotelName;
            return this;
        }

        public Builder withOccupancy(int paxNumber) {
            this.paxNumber = paxNumber;
            return this;
        }

        public Builder withStayPeriod(LocalDate begin, LocalDate end) {
            stay = new Stay(begin, end);
            return this;
        }

        public Reservation build() {
            return new Reservation(hotelName, paxNumber, stay);
        }
    }
}
