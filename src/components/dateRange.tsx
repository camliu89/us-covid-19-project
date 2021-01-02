import React, { useState } from 'react'
import { DateRangePicker } from 'react-dates'
import { Moment } from 'moment'

import 'react-dates/lib/css/_datepicker.css'
import '../styles/react_dates_overrides.css'

type ComponentProps = {
  startDate?: Moment
  endDate?: Moment
  dateName: string
  setStartDate(startDate: Moment): void
  setEndDate(endDate: Moment): void
}

type OnChangeDate = {
  startDate: Moment
  endDate: Moment
}

const isOutsideFunc = () => false

const DateRange: React.FC<ComponentProps> = ({
  startDate,
  endDate,
  dateName,
  setStartDate,
  setEndDate,
}) => {
  const [focused, setFocused] = useState(null)

  const onChange = ({ startDate, endDate }: OnChangeDate) => {
    setStartDate(startDate)
    setEndDate(endDate)
  }
  return (
    <DateRangePicker
      startDate={startDate}
      startDateId={`${dateName}-start-date`}
      endDate={endDate}
      endDateId={`${dateName}-start-date`}
      onDatesChange={onChange}
      focusedInput={focused}
      onFocusChange={(focusedInput) => setFocused(focusedInput)}
      isOutsideRange={isOutsideFunc}
    />
  )
}

export default DateRange
