import { describe, expect, it } from 'vitest'
import { metrics } from '../diagnostics/metrics'
import { HotelName, PaxNumber, Reference, Stay } from '../domain/hotel'
import { ConfirmedRegistration } from '../domain/reservation'
import { inMemoryHotelRepository } from '../infrastructure/hotel-repository'
import reservationService from './reservation-service'

const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days)
  return date
}

describe('reservation service make should', () => {
  it('give confirmedregistration with reference number', () => {
    const hotel = 'La Corniche' as HotelName
    const paxNumber = 2 as PaxNumber
    const begin = addDays(new Date(), 1)
    const end = addDays(new Date(), 2)

    const confirmedReservation = reservationService(
      console,
      metrics,
      inMemoryHotelRepository,
    ).make(hotel, paxNumber, Stay.create(begin, end))

    expect(confirmedReservation).toEqual({
      hotel,
      pax: paxNumber,
      stay: Stay.create(begin, end),
      reference: 'GHRKJIK-45' as Reference,
    } satisfies ConfirmedRegistration)
  })

  it('give hotel not registered in our reservation system error message when hotel is not registered', () => {
    const unknownHotel = 'Unknown Hotel' as HotelName

    const failedReservation = reservationService(
      console,
      metrics,
      inMemoryHotelRepository,
    ).make(
      unknownHotel,
      3 as PaxNumber,
      Stay.create(addDays(new Date(), 3), addDays(new Date(), 6)),
    )

    expect(failedReservation).toEqual({
      Error: `Hotel ${unknownHotel} is not registered in our reservation system`,
    })
  })

  it('give roomNotAvailable when hotel has no room for the requested period', () => {
    const hotel = 'Sofitel' as HotelName

    const failedReservation = reservationService(
      console,
      metrics,
      inMemoryHotelRepository,
    ).make(
      hotel,
      3 as PaxNumber,
      Stay.create(addDays(new Date(), 60), addDays(new Date(), 62)),
    )

    expect(failedReservation).toEqual({
      Error: `Hotel ${hotel} doesn't have room for the selected period`,
    })
  })

  it('give occupancyNotAvailable when hotel has no occupancy for the period', () => {
    const unavailableHotel = 'Continental' as HotelName
    const requestedPaxNumber = 42 as PaxNumber

    const failedReservation = reservationService(
      console,
      metrics,
      inMemoryHotelRepository,
    ).make(
      unavailableHotel,
      requestedPaxNumber,
      Stay.create(addDays(new Date(), 7), addDays(new Date(), 9)),
    )

    expect(failedReservation).toEqual({
      Error: `No room found for ${requestedPaxNumber} people`,
    })
  })
})
