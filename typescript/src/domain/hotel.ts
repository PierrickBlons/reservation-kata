import { ConfirmedRegistration, DraftReservation } from "./reservation";

export type HotelName = string & { __brand: 'hotelName' }
export type PaxNumber = number & { __brand: 'paxNumber' }
export type Reference = string & { __brand: 'reference' }

export type UnregisteredHotel = { type: 'unregisteredHotel'; hotel: HotelName }
type Room = {
  type: 'double' | 'single'
}

export type RegisteredHotel = {
  type: 'registeredHotel'
  hotel: HotelName
  rooms: Room[]
}

export type Hotel = RegisteredHotel | UnregisteredHotel

type HasAvailableRoom = (
  registeredHotel: RegisteredHotel,
  requestedStay: { begin: Date; end: Date },
) => RegisteredHotelRoom

type RegisteredHotelRoomAvailable = {
  type: 'registeredHotelRoomAvailable'
  hotel: HotelName
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

type InitializeReservation = (registeredHotelRoomOccupancyAvailable : RegisteredHotelRoomOccupancyAvailable, pax : PaxNumber, stay : { begin : Date, end : Date }) => DraftReservation

type ConfirmReservation = (RegisteredHotelRoomOccupancyAvailable: RegisteredHotelRoomOccupancyAvailable, draftReservation : DraftReservation) => ConfirmedRegistration

export const hasRoomForOccupancy: HasRoomForOccupancy = (
  registeredHotelWithAvailableRoom,
  pax,
) => {
  const MAX_OCCUPANCY = 10 as PaxNumber
  if (pax < MAX_OCCUPANCY) {
    return {
      type: 'registeredHotelRoomOccupancyAvailable',
      hotel: registeredHotelWithAvailableRoom.hotel,
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
  requestedStay: { begin: Date; end: Date },
) => {
  if (registeredHotel.rooms.length > 0 && requestedStay.begin > new Date()) {
    return {
      type: 'registeredHotelRoomAvailable',
      hotel: registeredHotel.hotel,
      room: registeredHotel.rooms[0],
    } satisfies RegisteredHotelRoomAvailable
  }
  return {
    type: 'registeredHotelRoomNotAvailable',
    hotel: registeredHotel.hotel,
  } satisfies RegisteredHotelRoomNotAvailable
}

export const initializeReservation : InitializeReservation = (
  registeredHotelRoomOccupancyAvailable,
  pax,
  stay
) => {
  return {
    pax,
    stay,
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
