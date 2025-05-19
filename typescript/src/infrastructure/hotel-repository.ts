import Logger from '../diagnostics/logger'
import {
  Hotel,
  HotelName,
  PaxNumber,
  RegisteredHotel,
  UnregisteredHotel,
} from '../domain/hotel'

export type HotelRepository = (logger: Logger) => {
  isRegistered: (hotelName: HotelName) => Hotel
}

const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days)
  return date
}

export const inMemoryHotelRepository: HotelRepository = (logger) => ({
  isRegistered: (hotelName: HotelName) => {
    if (hotelName === 'Unknown Hotel') {
      logger.error("Hotel not found, can't proceed with reservation")
      return {
        type: 'unregisteredHotel',
        hotel: hotelName,
      } satisfies UnregisteredHotel
    }

    return {
      type: 'registeredHotel',
      hotel: hotelName,
      rooms: [
        {
          rooms: [
            {
              type: 'double',
              pax: 2 as PaxNumber,
            },
          ],
          availabilityPeriod: {
            begin: new Date(),
            end: addDays(new Date(), 30),
          },
        },
      ],
    } satisfies RegisteredHotel
  },
})
