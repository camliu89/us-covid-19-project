import React, { useMemo, useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import moment, { Moment } from 'moment'
import { compact, map, isEmpty, sortBy, upperCase } from 'lodash'
import axios from 'axios'
import styled from 'styled-components'

const StyledChart = styled.div`
  border: 1px solid;
  padding: 0 1rem 1rem;
  margin: 1rem 0;
`

type ComponentProps = {
  state?: string
  startDate: Moment
  endDate: Moment
}

const LineData: React.FC<ComponentProps> = ({ state, startDate, endDate }) => {
  const getData = async () => {
    let api = 'https://api.covidtracking.com/v1/us/daily.json'
    if (state) {
      api = `https://api.covidtracking.com/v1/states/${state}/daily.json`
    }
    const result = await axios.get(api)
    // sort by date in ASC order
    setData(sortBy(result.data, (d) => d.date))
  }

  const [data, setData] = useState([])
  // set data empty and fetch in `getData()`
  useEffect(() => {
    getData()
  }, [])

  // mutate the data to match the recharts data fields
  // also filter the data with the dates set
  const mutatedData = useMemo(
    () =>
      compact(
        map(data, (d) => {
          const date = moment(d.date.toString())
          const minDate = startDate || moment('20200101')
          const maxDate = endDate || moment()
          const isBetween = date.isBetween(minDate, maxDate)

          if (!isBetween) return null
          return {
            date: date.format('M/D/YY'),
            positiveIncrease: d.positiveIncrease || 0,
          }
        }),
      ),
    [startDate, endDate, data],
  )

  const renderChart = () => {
    if (isEmpty(data)) return <p>loading...</p>
    else {
      return (
        <>
          <h2>{state ? upperCase(state) : 'US'}</h2>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart
                data={mutatedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="positiveIncrease"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )
    }
  }

  return <StyledChart>{renderChart()}</StyledChart>
}

export default LineData
