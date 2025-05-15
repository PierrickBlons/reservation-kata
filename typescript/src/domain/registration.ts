import { HotelName, PaxNumber, Reference } from './hotel'

export type ConfirmedRegistration = {
  hotel: HotelName
  pax: PaxNumber
  stay: { begin: Date; end: Date }
  reference: Reference
}
