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
import { compact, map, isEmpty, sortBy } from 'lodash'
import axios from 'axios'
import styled from 'styled-components'
import cn from 'classnames'

import Loading from '../loading'

import { TerritoryData } from '../../utils/types'
import { colors } from '../../styles/theme'

import content from '../../data/test.json'

type ComponentProps = {
  territoryData: TerritoryData
  startDate: Moment
  endDate: Moment
  closeChart: () => void
}

const StyledChart = styled.div`
  border: 2px solid ${colors.blizzard};
  padding: 0 1rem 1rem;
  margin: 1rem 0;
  position: relative;
  .chart-container {
    .close {
      opacity: 0;
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      background: ${colors.blizzard};
      padding: 5px;
      cursor: pointer;
      font-size: 3rem;
      font-weight: 900;
      transition: 0.4s;
    }
  }
  &:hover {
    .chart-container .close {
      opacity: 1;
    }
  }
`
StyledChart.displayName = 'StyledChart'

const LineData: React.FC<ComponentProps> = ({ territoryData, startDate, endDate, closeChart }) => {
  const getData = async () => {
    // let api = 'https://api.covidtracking.com/v1/us/daily.json'
    // if (territoryData && territoryData.territory !== 'US') {
    //   api = `https://api.covidtracking.com/v1/states/${territoryData.territory}/daily.json`
    // }
    //const result = await axios.get(api)
    const result = content
    // sort by date in ASC order
    //setData(sortBy(result.data, (d) => d.date))
    setData(sortBy(result, (d) => d.date))
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
    if (isEmpty(data)) return <Loading />
    else {
      return (
        <div className="chart-container">
          <div className="close" onClick={() => closeChart()}>
            &times;
          </div>
          <h2>{territoryData.name}</h2>
          <div style={{ width: '100%', height: 200 }}>
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
        </div>
      )
    }
  }

  return (
    <StyledChart className={cn({ 'is-us': territoryData.territory === 'US' })}>
      {renderChart()}
    </StyledChart>
  )
}

export default LineData
