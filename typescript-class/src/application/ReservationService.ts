import Logger from '../diagnostics/Logger'
import { Metrics } from '../diagnostics/Metrics'
import {
  HotelName,
  PaxNumber,
  RegisteredHotel,
  RegisteredHotelRoomAvailable,
  RegisteredHotelRoomOccupancyAvailable,
} from '../domain/hotel'
import { HotelRepository } from '../infrastructure/HotelRepository'

class ReservationService {
  private logger: Logger
  private metrics: Metrics
  private hotelRepository: HotelRepository

  constructor(
    logger: Logger,
    metrics: Metrics,
    hotelRepository: HotelRepository,
  ) {
    this.logger = logger
    this.metrics = metrics
    this.hotelRepository = hotelRepository
  }

  make(
    hotelName: HotelName,
    paxNumber: PaxNumber,
    stay: { begin: Date; end: Date },
  ) {
    this.logger.debug('Start making reservation')

    const registeredHotel = this.hotelRepository.isRegistered(hotelName)

    if (registeredHotel.type === 'unregisteredHotel') {
      const hotelNotFoundMessage = `Hotel ${registeredHotel.hotel} is not registered in our reservation system`
      this.logger.info(hotelNotFoundMessage)
      this.metrics.increment(`${hotelName}.reservations.hotelNotFound`)
      return { Error: hotelNotFoundMessage }
    }

    const hotelWithRoom = RegisteredHotel.hasAvailableRoom(
      registeredHotel,
      stay,
    )

    if (hotelWithRoom.type === 'registeredHotelRoomNotAvailable') {
      const roomNotAvailableMessage = `Hotel ${hotelWithRoom.hotel} doesn't have room for the selected period`
      this.logger.info(roomNotAvailableMessage)
      this.metrics.increment(
        `${hotelWithRoom.hotel}.reservations.roomNotAvailable`,
      )
      return { Error: roomNotAvailableMessage }
    }

    const hotelAvailability = RegisteredHotelRoomAvailable.hasRoomForOccupancy(
      hotelWithRoom,
      paxNumber,
    )

    this.logger.debug(`Hotel ${hotelWithRoom.hotel} has room available`)

    if (hotelAvailability.type === 'registeredHotelRoomOccupancyAvailable') {
      this.logger.debug(
        `Hotel ${hotelWithRoom.hotel}: Room found for ${paxNumber}`,
      )

      const draftReservation =
        RegisteredHotelRoomOccupancyAvailable.initializeReservation(
          hotelAvailability,
        )

      this.logger.debug(
        `Hotel ${hotelWithRoom.hotel}: Reservation option from ${stay.begin} to ${stay.end} for ${paxNumber} people`,
      )
      this.metrics.increment(`${hotelWithRoom.hotel}.reservations`)
      return RegisteredHotelRoomOccupancyAvailable.confirmReservation(
        hotelAvailability,
        draftReservation,
      )
    }

    const roomNotAvailableMessage = `No room found for ${paxNumber} people`
    this.logger.info(roomNotAvailableMessage)
    this.metrics.increment(
      `${hotelWithRoom.hotel}.reservations.occupancyNotAvailable`,
    )
    return { Error: roomNotAvailableMessage }
  }
}

export default ReservationService
