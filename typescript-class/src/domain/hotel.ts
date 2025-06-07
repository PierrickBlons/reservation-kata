import { ConfirmedRegistration, DraftReservation } from './reservation'

// Value types
export type HotelName = string & { __brand: 'hotelName' }
export type PaxNumber = number & { __brand: 'paxNumber' }
export type Reference = string & { __brand: 'reference' }

export class Stay {
  constructor(
    public readonly begin: Date,
    public readonly end: Date,
  ) {
    if (begin >= end) {
      throw new Error('End date must be after begin date')
    }
  }
}

// Hotel
export type UnregisteredHotel = { type: 'unregisteredHotel'; hotel: HotelName }

type Room = {
  type: 'double' | 'single'
  pax: PaxNumber
}

type RoomAvailability = {
  rooms: Room[]
  availabilityPeriod: Stay
}

export type RegisteredHotel = {
  type: 'registeredHotel'
  hotel: HotelName
  rooms: RoomAvailability[]
}

type HasAvailableRoom = (
  registeredHotel: RegisteredHotel,
  requestedStay: Stay,
) => RegisteredHotelRoom

const hasAvailableRoom: HasAvailableRoom = (
  registeredHotel: RegisteredHotel,
  requestedStay: Stay,
) => {
  if (registeredHotel.rooms.length === 0) {
    return {
      type: 'registeredHotelRoomNotAvailable',
      hotel: registeredHotel.hotel,
    } satisfies RegisteredHotelRoomNotAvailable
  }

  const roomAvailability = registeredHotel.rooms.find(
    (roomAvailability) =>
      roomAvailability.availabilityPeriod.begin <= requestedStay.begin &&
      roomAvailability.availabilityPeriod.end >= requestedStay.end,
  )

  if (roomAvailability) {
    return {
      type: 'registeredHotelRoomAvailable',
      hotel: registeredHotel.hotel,
      stayPeriod: requestedStay,
      room: roomAvailability.rooms[0],
    } satisfies RegisteredHotelRoomAvailable
  }

  return {
    type: 'registeredHotelRoomNotAvailable',
    hotel: registeredHotel.hotel,
  } satisfies RegisteredHotelRoomNotAvailable
}

export const RegisteredHotel = {
  hasAvailableRoom,
}

export type Hotel = RegisteredHotel | UnregisteredHotel

//HotelRoom
type RegisteredHotelRoomAvailable = {
  type: 'registeredHotelRoomAvailable'
  hotel: HotelName
  stayPeriod: Stay
  room: Room
}

type HasRoomForOccupancy = (
  hotel: RegisteredHotelRoomAvailable,
  pax: PaxNumber,
) => RegisteredHotelRoomOccupancy

type RegisteredHotelRoomNotAvailable = {
  type: 'registeredHotelRoomNotAvailable'
  hotel: HotelName
}

type RegisteredHotelRoom =
  | RegisteredHotelRoomAvailable
  | RegisteredHotelRoomNotAvailable

// Hotel Room Occupancy
const hasRoomForOccupancy: HasRoomForOccupancy = (
  registeredHotelWithAvailableRoom,
  pax,
) => {
  if (registeredHotelWithAvailableRoom.room.pax >= pax) {
    return RegisteredHotelRoomOccupancyAvailable.create(
      registeredHotelWithAvailableRoom,
    )
  }
  return RegisteredHotelRoomOccupancyInsufficient.create(
    registeredHotelWithAvailableRoom,
  )
}

export const RegisteredHotelRoomAvailable = {
  hasRoomForOccupancy,
}

type RegisteredHotelRoomOccupancyAvailable = {
  type: 'registeredHotelRoomOccupancyAvailable'
  hotel: HotelName
  stayPeriod: Stay
  room: Room
}

const createRegisteredHotelRoomOccupancyAvailable = ({
  hotel,
  stayPeriod,
  room,
}) =>
  ({
    type: 'registeredHotelRoomOccupancyAvailable',
    hotel,
    stayPeriod,
    room,
  }) satisfies RegisteredHotelRoomOccupancyAvailable

type InitializeReservation = (
  registeredHotelRoomOccupancyAvailable: RegisteredHotelRoomOccupancyAvailable,
) => DraftReservation

const initializeReservation: InitializeReservation = (
  registeredHotelRoomOccupancyAvailable,
) => {
  return {
    pax: registeredHotelRoomOccupancyAvailable.room.pax,
    stay: registeredHotelRoomOccupancyAvailable.stayPeriod,
  } satisfies DraftReservation
}

type ConfirmReservation = (
  RegisteredHotelRoomOccupancyAvailable: RegisteredHotelRoomOccupancyAvailable,
  draftReservation: DraftReservation,
) => ConfirmedRegistration

const confirmReservation: ConfirmReservation = (
  registeredHotelRoomOccupancyAvailable,
  draftReservation,
) => {
  return {
    hotel: registeredHotelRoomOccupancyAvailable.hotel,
    pax: draftReservation.pax,
    stay: draftReservation.stay,
    reference: 'GHRKJIK-45' as Reference,
  } satisfies ConfirmedRegistration
}

export const RegisteredHotelRoomOccupancyAvailable = {
  create: createRegisteredHotelRoomOccupancyAvailable,
  initializeReservation,
  confirmReservation,
}

type RegisteredHotelRoomOccupancyInsufficient = {
  type: 'registeredHotelRoomOccupancyInsufficient'
  hotel: HotelName
}

const createRegisteredHotelRoomOccupancyInsufficient = (
  registeredHotelWithAvailableRoom: RegisteredHotelRoomAvailable,
): RegisteredHotelRoomOccupancyInsufficient => {
  return {
    type: 'registeredHotelRoomOccupancyInsufficient',
    hotel: registeredHotelWithAvailableRoom.hotel,
  } satisfies RegisteredHotelRoomOccupancyInsufficient
}

export const RegisteredHotelRoomOccupancyInsufficient = {
  create: createRegisteredHotelRoomOccupancyInsufficient,
}

type RegisteredHotelRoomOccupancy =
  | RegisteredHotelRoomOccupancyAvailable
  | RegisteredHotelRoomOccupancyInsufficient
