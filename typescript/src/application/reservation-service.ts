import Logger from '../diagnostics/logger'
import Metrics from '../diagnostics/metrics'
import {
  HotelName,
  PaxNumber,
  RegisteredHotel,
  RegisteredHotelRoomAvailable,
  RegisteredHotelRoomOccupancyAvailable,
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

    if (registeredHotel.type === 'unregisteredHotel') {
      const hotelNotFoundMessage = `Hotel ${registeredHotel.hotel} is not registered in our reservation system`
      logger.info(hotelNotFoundMessage)
      metrics.increment(`${hotelName}.reservations.hotelNotFound`)
      return { Error: hotelNotFoundMessage }
    }

    const hotelWithRoom = RegisteredHotel.hasAvailableRoom(
      registeredHotel,
      stay,
    )

    if (hotelWithRoom.type === 'registeredHotelRoomNotAvailable') {
      const roomNotAvailableMessage = `Hotel ${hotelWithRoom.hotel} doesn't have room for the selected period`
      logger.info(roomNotAvailableMessage)
      metrics.increment(`${hotelWithRoom.hotel}.reservations.roomNotAvailable`)
      return { Error: roomNotAvailableMessage }
    }

    const hotelAvailability = RegisteredHotelRoomAvailable.hasRoomForOccupancy(
      hotelWithRoom,
      paxNumber,
    )

    logger.debug(`Hotel ${hotelWithRoom.hotel} has room available`)

    if (hotelAvailability.type === 'registeredHotelRoomOccupancyAvailable') {
      logger.debug(`Hotel ${hotelWithRoom.hotel}: Room found for ${paxNumber}`)

      const draftReservation =
        RegisteredHotelRoomOccupancyAvailable.initializeReservation(
          hotelAvailability,
        )

      logger.debug(
        `Hotel ${hotelWithRoom.hotel}: Reservation option from ${stay.begin} to ${stay.end} for ${paxNumber} people`,
      )
      metrics.increment(`${hotelWithRoom.hotel}.reservations`)
      return RegisteredHotelRoomOccupancyAvailable.confirmReservation(
        hotelAvailability,
        draftReservation,
      )
    }

    const roomNotAvailableMessage = `No room found for ${paxNumber} people`
    logger.info(roomNotAvailableMessage)
    metrics.increment(
      `${hotelWithRoom.hotel}.reservations.occupancyNotAvailable`,
    )
    return { Error: roomNotAvailableMessage }
  },
})

export default reservationService
