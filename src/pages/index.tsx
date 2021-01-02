import React, { useCallback } from 'react'
import { useImmer } from 'use-immer'
import styled from 'styled-components'
import moment from 'moment'
import { map } from 'lodash'

import Layout from '../components/layout'
import SEO from '../components/seo'
import CovidChart from '../components/covid/charts'
import StatesControl from '../components/covid/statesControl'
import DateRange from '../components/dateRange'

import { StateData } from '../utils/types'

import 'react-dates/initialize'

const Dashboard = styled.div`
  display: flex;
  .controls {
    flex: 0 0 15%;
  }
  .data {
    flex: 0 85%;
    .charts {
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
      > div {
        flex: 0 45%;
      }
    }
  }
`
Dashboard.displayName = 'Dashboard'

const IndexPage: React.FC = () => {
  const [states, updateStates] = useImmer<StateData[]>([
    {
      territory: 'US',
      active: false,
      name: 'United States',
    },
  ])

  const [dates, updateDates] = useImmer({
    startDate: moment('20200101'),
    endDate: moment(),
  })

  // memoized the callback to update the dates
  const updateDatesCallback = useCallback(
    (date, field) => {
      updateDates((draft) => {
        draft[field] = date
      })
    },
    [dates],
  )

  return (
    <Layout>
      <SEO title="Home" />
      <Dashboard>
        <StatesControl states={states} updateStates={updateStates} />
        <div className="data">
          <DateRange
            startDate={dates.startDate}
            endDate={dates.endDate}
            dateName="covid"
            setStartDate={(date) => updateDatesCallback(date, 'startDate')}
            setEndDate={(date) => updateDatesCallback(date, 'endDate')}
          />
          <div className="charts">
            {map(states, (s, i) => {
              if (!s.active) return null
              return (
                <CovidChart
                  stateData={s}
                  key={i}
                  startDate={dates.startDate}
                  endDate={dates.endDate}
                />
              )
            })}
          </div>
        </div>
      </Dashboard>
    </Layout>
  )
}

export default IndexPage
