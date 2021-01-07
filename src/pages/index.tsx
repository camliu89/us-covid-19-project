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

import { Territory, TerritoryData } from '../utils/types'
import { colors } from '../styles/theme'

import 'react-dates/initialize'

const StyledDashboard = styled.div`
  margin-top: 1rem;
  .controls {
    display: flex;
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
    @media screen and (max-width: 600px) {
      flex-flow: column;
      button {
        padding: 1rem;
      }
      .DateRangePicker {
        margin-left: 0;
        margin-top: 0.5rem;
      }
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
        @media screen and (max-width: 600px) {
          flex: 0 100%;
        }
      }
    }
  }
`
StyledDashboard.displayName = 'StyledDashboard'

const IndexPage: React.FC = () => {
  const [showControls, setShowControls] = useState<boolean>(false)

  const [territories, updateTerritories] = useImmer<Territory[]>([
    {
      abbreviation: 'US',
      active: false,
      name: 'United States',
      data: null,
    },
  ])

  const [dataPoints, updateDataPoints] = useImmer([
    {
      name: 'positiveIncrease',
      show: true,
      color: '#cf1b42',
    },
    {
      name: 'negativeIncrease',
      show: true,
      color: '#8884d8',
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

  const toggleTerritory = (t: Territory) => {
    updateTerritories((draft) => {
      const stateIndex = findIndex(territories, (ts) => ts.abbreviation === t.abbreviation)
      draft[stateIndex].active = !draft[stateIndex].active
    })
  }

  const updateTerritoryData = (t: Territory, data: TerritoryData[]) => {
    updateTerritories((draft) => {
      const stateIndex = findIndex(territories, (ts) => ts.abbreviation === t.abbreviation)
      draft[stateIndex].data = data
    })
  }

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
        {map(territories, (t, i) => {
          if (!t.active) return null
          return (
            <CovidChart
              territory={t}
              key={i}
              startDate={dates.startDate}
              endDate={dates.endDate}
              toggleTerritory={toggleTerritory}
              updateTerritoryData={updateTerritoryData}
              dataPoints={dataPoints}
            />
          )
        })}
      </div>
    )
  }

  const renderDataPointsCheckBoxes = () => {
    return map(dataPoints, (dp, i) => (
      <div key={i} className="data-points">
        <input
          type="checkbox"
          id={dp.name}
          name={dp.name}
          value={dp.name}
          checked={dp.show}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked
            const value = e.target.value
            updateDataPoints((draft) => {
              const dpIndex = findIndex(draft, (d) => d.name === value)
              draft[dpIndex].show = checked
            })
          }}
        />
        <label htmlFor={dp.name}>{dp.name}</label>
      </div>
    ))
  }

  return (
    <>
      <SEO title="Home" />
      <TerritoryControl
        territories={territories}
        updateTerritories={updateTerritories}
        show={showControls}
        setShow={setShowControls}
        toggleTerritory={toggleTerritory}
      />
      <Layout>
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
            {renderDataPointsCheckBoxes()}
          </div>
          <div className="data">{renderTerritories()}</div>
        </StyledDashboard>
      </Layout>
    </>
  )
}

export default IndexPage
