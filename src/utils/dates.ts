import moment, { Moment } from 'moment'

export const START_DATE_NUMBER = 20200101

/**
 * Convert a number in the format of YYYYMMDD (i.e. 20200522) to a Moment object
 * @param number The format is YYYYMMDD
 */
export const numberToMoment = (number: number): Moment => {
  return moment(number.toString())
}
