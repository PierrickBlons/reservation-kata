import {
  Hotel,
  HotelName,
  PaxNumber,
  RegisteredHotel,
  UnregisteredHotel,
} from '../domain/hotel'

export interface HotelRepository {
  isRegistered: (hotelName: HotelName) => Hotel
}

const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days)
  return date
}

export class InMemoryHotelRepository implements HotelRepository {
  private logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  isRegistered(hotelName: HotelName): Hotel {
    if (hotelName === 'Unknown Hotel') {
      this.logger.error("Hotel not found, can't proceed with reservation")
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
  }
}
