import { HotelName, PaxNumber, Reference } from './hotel'

export type DraftReservation = {
  pax: PaxNumber
  stay: { begin: Date; end: Date }
}

export type ConfirmedRegistration = {
  hotel: HotelName
  pax: PaxNumber
  stay: { begin: Date; end: Date }
  reference: Reference
}
