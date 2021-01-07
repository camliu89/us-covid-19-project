import moment from 'moment'
import { map, range, random } from 'lodash'
import { TerritoryData } from './types'

export const generateRandomData = (number: number): TerritoryData[] => {
  return map(range(1, number), (n) => {
    const date = moment()
      .subtract(n - 1, 'days')
      .format('YYYYMMDD')
    const positiveIncrease = random(100, 10000) * 1

    return {
      date: parseInt(date),
      positiveIncrease,
    }
  })
}
