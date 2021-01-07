import React, { useMemo, useEffect } from 'react'
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

import { Territory, TerritoryData } from '../../utils/types'
import { colors } from '../../styles/theme'
import { generateRandomData } from '../../utils/data'

type ComponentProps = {
  territory: Territory
  startDate: Moment
  endDate: Moment
  toggleTerritory: (t: Territory) => void
  updateTerritoryData: (t: Territory, data: TerritoryData[]) => void
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

const LineData: React.FC<ComponentProps> = ({
  territory,
  startDate,
  endDate,
  toggleTerritory,
  updateTerritoryData,
}) => {
  const getData = async () => {
    const env = process.env.GATSBY_ENV

    let result: { data: TerritoryData[] }
    if (env === 'DEVELOPMENT1') {
      result = {
        data: generateRandomData(20),
      }
    } else {
      let api = 'https://api.covidtracking.com/v1/us/daily.json'
      if (territory && territory.abbreviation !== 'US') {
        api = `https://api.covidtracking.com/v1/states/${territory.abbreviation}/daily.json`
      }
      result = await axios.get(api)
    }
    // sort by date in ASC order
    updateTerritoryData(
      territory,
      sortBy(result.data, (d) => d.date),
    )
  }

  // set data empty and fetch in `getData()`
  useEffect(() => {
    if (territory && !territory.data) {
      getData()
    }
  }, [])

  // mutate the data to match the recharts data fields
  // also filter the data with the dates set
  const mutatedData: TerritoryData[] = useMemo(
    () =>
      compact(
        map(territory.data, (d) => {
          const date = moment(d.date.toString())
          const minDate = startDate || moment('20200101')
          const maxDate = endDate || moment()
          const isBetween = date.isBetween(minDate, maxDate)

          if (!isBetween) return null
          return {
            date: date.format('M/D/YY'),
            positiveIncrease: d.positiveIncrease || 0,
            negativeIncrease: d.negativeIncrease || 0,
          }
        }),
      ),
    [startDate, endDate, territory.data],
  )

  const renderChart = () => {
    if (isEmpty(territory.data)) return <Loading />
    else {
      return (
        <div className="chart-container">
          <div className="close" onClick={() => toggleTerritory(territory)}>
            &times;
          </div>
          <h2>{territory.name}</h2>
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
                  stroke="#cf1b42"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="negativeIncrease"
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
    <StyledChart className={cn({ 'is-us': territory.abbreviation === 'US' })}>
      {renderChart()}
    </StyledChart>
  )
}

export default LineData
