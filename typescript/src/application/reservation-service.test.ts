import { afterEach, describe, expect, it } from 'vitest'
import { spyLogger } from '../diagnostics/logger'
import { spyMetrics } from '../diagnostics/metrics'
import { HotelName, PaxNumber, Reference, Stay } from '../domain/hotel'
import { ConfirmedRegistration } from '../domain/reservation'
import { inMemoryHotelRepository } from '../infrastructure/hotel-repository'
import reservationService from './reservation-service'

const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days)
  return date
}

const dateBegin = addDays(new Date(), 1)
const metricsBucket = []
const logsBucket = []

describe('reservation service make should', () => {
  afterEach(() => {
    metricsBucket.splice(0)
    logsBucket.splice(0)
  })

  it('give confirmedregistration with reference number', () => {
    const hotel = 'La Corniche' as HotelName
    const pax = 2 as PaxNumber
    const begin = dateBegin
    const end = addDays(new Date(), 2)

    const confirmedReservation = reservationService(
      spyLogger(logsBucket),
      spyMetrics(metricsBucket),
      inMemoryHotelRepository,
    ).make(hotel, pax, Stay.create(begin, end))

    expect(confirmedReservation).toEqual({
      hotel,
      pax,
      stay: Stay.create(begin, end),
      reference: 'GHRKJIK-45' as Reference,
    } satisfies ConfirmedRegistration)
    expect({ metrics: metricsBucket, logs: logsBucket }).toMatchSnapshot()
  })

  it('give hotel not registered in our reservation system error message when hotel is not registered', () => {
    const unknownHotel = 'Unknown Hotel' as HotelName

    const failedReservation = reservationService(
      spyLogger(logsBucket),
      spyMetrics(metricsBucket),
      inMemoryHotelRepository,
    ).make(
      unknownHotel,
      3 as PaxNumber,
      Stay.create(addDays(new Date(), 3), addDays(new Date(), 6)),
    )

    expect(failedReservation).toEqual({
      Error: `Hotel ${unknownHotel} is not registered in our reservation system`,
    })
    expect({ metrics: metricsBucket, logs: logsBucket }).toMatchSnapshot()
  })

  it('give roomNotAvailable when hotel has no room for the requested period', () => {
    const hotel = 'Sofitel' as HotelName

    const failedReservation = reservationService(
      spyLogger(logsBucket),
      spyMetrics(metricsBucket),
      inMemoryHotelRepository,
    ).make(
      hotel,
      3 as PaxNumber,
      Stay.create(addDays(new Date(), 60), addDays(new Date(), 62)),
    )

    expect(failedReservation).toEqual({
      Error: `Hotel ${hotel} doesn't have room for the selected period`,
    })
    expect({ metrics: metricsBucket, logs: logsBucket }).toMatchSnapshot()
  })

  it('give occupancyNotAvailable when hotel has no occupancy for the period', () => {
    const unavailableHotel = 'Continental' as HotelName
    const requestedPaxNumber = 42 as PaxNumber

    const failedReservation = reservationService(
      spyLogger(logsBucket),
      spyMetrics(metricsBucket),
      inMemoryHotelRepository,
    ).make(
      unavailableHotel,
      requestedPaxNumber,
      Stay.create(addDays(new Date(), 7), addDays(new Date(), 9)),
    )

    expect(failedReservation).toEqual({
      Error: `No room found for ${requestedPaxNumber} people`,
    })
    expect({ metrics: metricsBucket, logs: logsBucket }).toMatchSnapshot()
  })

  it('give error when requested stay endDate is before startDate', () => {
    const hotel = 'La Corniche' as HotelName
    const pax = 2 as PaxNumber
    const begin = dateBegin
    const end = addDays(new Date(), -1)

    expect(() =>
      reservationService(
        spyLogger(logsBucket),
        spyMetrics(metricsBucket),
        inMemoryHotelRepository,
      ).make(hotel, pax, Stay.create(begin, end)),
    ).toThrow('End date must be after begin date')

    expect({ metrics: metricsBucket, logs: logsBucket }).toMatchSnapshot()
  })
})
