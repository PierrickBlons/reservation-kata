import { ConfirmedRegistration, DraftReservation } from './reservation'

export type HotelName = string & { __brand: 'hotelName' }
export type PaxNumber = number & { __brand: 'paxNumber' }
export type Reference = string & { __brand: 'reference' }

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

export type Hotel = RegisteredHotel | UnregisteredHotel

type HasAvailableRoom = (
  registeredHotel: RegisteredHotel,
  requestedStay: Stay,
) => RegisteredHotelRoom

type RegisteredHotelRoomAvailable = {
  type: 'registeredHotelRoomAvailable'
  hotel: HotelName
  stayPeriod: Stay
  room: Room
}

type RegisteredHotelRoomNotAvailable = {
  type: 'registeredHotelRoomNotAvailable'
  hotel: HotelName
}

type RegisteredHotelRoom =
  | RegisteredHotelRoomAvailable
  | RegisteredHotelRoomNotAvailable

type RegisteredHotelRoomOccupancyAvailable = {
  type: 'registeredHotelRoomOccupancyAvailable'
  hotel: HotelName
  stayPeriod: Stay
  room: Room
}

type RegisteredHotelRoomOccupancyInsufficient = {
  type: 'registeredHotelRoomOccupancyInsufficient'
  hotel: HotelName
}

type RegisteredHotelOccupancy =
  | RegisteredHotelRoomOccupancyAvailable
  | RegisteredHotelRoomOccupancyInsufficient

type HasRoomForOccupancy = (
  hotel: RegisteredHotelRoomAvailable,
  pax: PaxNumber,
) => RegisteredHotelOccupancy

export type Stay = {
  begin: Date
  end: Date
}

type InitializeReservation = (
  registeredHotelRoomOccupancyAvailable: RegisteredHotelRoomOccupancyAvailable,
) => DraftReservation

type ConfirmReservation = (
  RegisteredHotelRoomOccupancyAvailable: RegisteredHotelRoomOccupancyAvailable,
  draftReservation: DraftReservation,
) => ConfirmedRegistration

export const hasRoomForOccupancy: HasRoomForOccupancy = (
  registeredHotelWithAvailableRoom,
  pax,
) => {
  if (registeredHotelWithAvailableRoom.room.pax >= pax) {
    return {
      type: 'registeredHotelRoomOccupancyAvailable',
      hotel: registeredHotelWithAvailableRoom.hotel,
      stayPeriod: registeredHotelWithAvailableRoom.stayPeriod,
      room: registeredHotelWithAvailableRoom.room,
    } satisfies RegisteredHotelRoomOccupancyAvailable
  }
  return {
    type: 'registeredHotelRoomOccupancyInsufficient',
    hotel: registeredHotelWithAvailableRoom.hotel,
  } satisfies RegisteredHotelRoomOccupancyInsufficient
}

export const hasAvailableRoom: HasAvailableRoom = (
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

export const initializeReservation: InitializeReservation = (
  registeredHotelRoomOccupancyAvailable,
) => {
  return {
    pax: registeredHotelRoomOccupancyAvailable.room.pax,
    stay: registeredHotelRoomOccupancyAvailable.stayPeriod,
  } satisfies DraftReservation
}

export const confirmReservation: ConfirmReservation = (
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
