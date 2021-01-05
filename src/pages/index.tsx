import React, { useCallback, useState } from 'react'
import { useImmer } from 'use-immer'
import styled from 'styled-components'
import moment from 'moment'
import { map, some, findIndex } from 'lodash'

import Layout from '../components/layout'
import SEO from '../components/seo'
import CovidChart from '../components/covid/charts'
import TerritoryControl from '../components/covid/controls'
import DateRange from '../components/dateRange'

import { TerritoryData } from '../utils/types'
import { colors } from '../styles/theme'

import 'react-dates/initialize'

const StyledDashboard = styled.div`
  padding: 2rem;
  .controls {
    display: flex;
    padding-left: 1rem;
    button {
      border: 2px solid ${colors.powderblue};
      background: white;
      color: #484848;
      font-weight: 800;
      cursor: pointer;
      border-radius: 2px;
      padding: 0 1rem;
    }
    .DateRangePicker {
      margin-left: 1rem;
    }
  }
  .data {
    .empty-data {
      text-align: center;
      margin-top: 10rem;
      font-size: 2rem;
      button {
        background: white;
        border: none;
        font-size: 1.5rem;
        color: #0077b6;
        -webkit-text-stroke: thin;
        cursor: pointer;
      }
    }
    .charts {
      margin: 1rem auto;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
      > div {
        flex: 0 45%;
      }
    }
  }
`
StyledDashboard.displayName = 'StyledDashboard'

const IndexPage: React.FC = () => {
  const [territories, updateTerritories] = useImmer<TerritoryData[]>([
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

  const toggleTerritory = (s: TerritoryData) => {
    updateTerritories((draft) => {
      const stateIndex = findIndex(territories, (ast) => ast.territory === s.territory)
      draft[stateIndex].active = !draft[stateIndex].active
    })
  }

  const [showControls, setShowControls] = useState<boolean>(false)

  const renderTerritories = () => {
    const anyTerritories = some(territories, (t) => t.active)
    if (!anyTerritories) {
      return (
        <div className="empty-data">
          <h2>No territories selected</h2>
          <button onClick={() => setShowControls(true)}>+ add territories</button>
        </div>
      )
    }
    return (
      <div className="charts">
        {map(territories, (s, i) => {
          if (!s.active) return null
          return (
            <CovidChart
              territoryData={s}
              key={i}
              startDate={dates.startDate}
              endDate={dates.endDate}
              closeChart={() => toggleTerritory(s)}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Layout>
      <SEO title="Home" />
      <TerritoryControl
        territories={territories}
        updateTerritories={updateTerritories}
        show={showControls}
        setShow={setShowControls}
        toggleTerritory={toggleTerritory}
      />
      <StyledDashboard>
        <div className="controls">
          <button onClick={() => setShowControls(true)}>Show Territories</button>
          <DateRange
            startDate={dates.startDate}
            endDate={dates.endDate}
            dateName="covid"
            setStartDate={(date) => updateDatesCallback(date, 'startDate')}
            setEndDate={(date) => updateDatesCallback(date, 'endDate')}
          />
        </div>
        <div className="data">{renderTerritories()}</div>
      </StyledDashboard>
    </Layout>
  )
}

export default IndexPage
