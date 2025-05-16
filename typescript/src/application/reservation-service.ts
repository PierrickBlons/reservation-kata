import Logger from '../diagnostics/logger'
import Metrics from '../diagnostics/metrics'
import {
  HotelName,
  PaxNumber,
  confirmReservation,
  hasAvailableRoom,
  hasRoomForOccupancy,
  initializeReservation,
} from '../domain/hotel'
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

            logger.debug(`Hotel ${hotelWithRoom.hotel} has room available`)

            switch (hotelAvailability.type) {
              case 'registeredHotelRoomOccupancyAvailable': {
                logger.debug(
                  `Hotel ${hotelWithRoom.hotel}: Room found for ${paxNumber}`,
                )

                const draftReservation = initializeReservation(
                  hotelAvailability,
                  paxNumber,
                  stay,
                )

                logger.debug(
                  `Hotel ${hotelWithRoom.hotel}: Reservation option from ${stay.begin} to ${stay.end} for ${paxNumber} people`,
                )
                metrics.increment(`${hotelWithRoom.hotel}.reservations`)
                return confirmReservation(hotelAvailability, draftReservation)
              }
              case 'registeredHotelRoomOccupancyInsufficient': {
                const roomNotAvailableMessage = `No room found for ${paxNumber} people`
                logger.info(roomNotAvailableMessage)
                metrics.increment(
                  `${hotelWithRoom.hotel}.reservations.occupancyNotAvailable`,
                )
                return { Error: roomNotAvailableMessage }
              }
            }
          }
          case 'registeredHotelRoomNotAvailable': {
            const roomNotAvailableMessage = `Hotel ${hotelWithRoom.hotel} doesn't have room for the selected period`
            logger.info(roomNotAvailableMessage)
            metrics.increment(
              `${hotelWithRoom.hotel}.reservations.roomNotAvailable`,
            )
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
