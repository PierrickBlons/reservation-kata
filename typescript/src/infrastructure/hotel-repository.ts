import Logger from '../diagnostics/logger'
import {
  Hotel,
  HotelName,
  RegisteredHotel,
  UnregisteredHotel,
} from '../domain/hotel'

export type HotelRepository = (logger: Logger) => {
  isRegistered: (hotelName: HotelName) => Hotel
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
          type: 'double',
        },
      ],
    } satisfies RegisteredHotel
  },
})
