import Logger from '../diagnostics/logger'
import Metrics from '../diagnostics/metrics'
import {
  HotelName,
  PaxNumber,
  Reference,
  hasAvailableRoom,
  hasRoomForOccupancy,
} from '../domain/hotel'
import { ConfirmedRegistration } from '../domain/registration'
import { HotelRepository } from '../infrastructure/hotel-repository'

const reservationService = (
  logger: Logger,
  metrics: Metrics,
  hotelRepository: HotelRepository,
) => ({
  make: (
    hotelName: HotelName,
    paxNumber: PaxNumber,
    stay: { begin: Date; end: Date },
  ) => {
    logger.debug('Start making reservation')
    const reference = 'GHRKJIK-45' as Reference

    const registeredHotel = hotelRepository(logger).isRegistered(hotelName)

    switch (registeredHotel.type) {
      case 'registeredHotel': {
        const hotelWithRoom = hasAvailableRoom(registeredHotel, stay)

        switch (hotelWithRoom.type) {
          case 'registeredHotelRoomAvailable': {
            const hotelAvailability = hasRoomForOccupancy(
              hotelWithRoom,
              paxNumber,
            )
            switch (hotelAvailability.type) {
              case 'registeredHotelRoomOccupancyAvailable': {
                return {
                  hotel: hotelAvailability.hotel,
                  pax: paxNumber,
                  stay,
                  reference,
                } satisfies ConfirmedRegistration
              }
              case 'registeredHotelRoomOccupancyInsufficient': {
                const roomNotAvailableMessage = `No room found for ${paxNumber} people`
                logger.info(roomNotAvailableMessage)
                return { Error: roomNotAvailableMessage }
              }
            }
          }
          case 'registeredHotelRoomNotAvailable': {
            const roomNotAvailableMessage = `Hotel ${hotelWithRoom.hotel} doesn't have room for the selected period`
            logger.info(roomNotAvailableMessage)
            return { Error: roomNotAvailableMessage }
          }
        }
      }
      case 'unregisteredHotel': {
        const hotelUnknownError = `Hotel ${hotelName} is not registered in our reservation system`
        logger.info(hotelUnknownError)
        return { Error: hotelUnknownError }
      }
    }
  },
})

export default reservationService
