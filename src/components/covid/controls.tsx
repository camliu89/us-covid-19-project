import React, { useEffect } from 'react'
import axios from 'axios'
import { map, findIndex } from 'lodash'
import cn from 'classnames'
import styled from 'styled-components'

import { TerritoryData } from '../../utils/types'
import { WritableDraft } from 'immer/dist/internal'
import { colors } from '../../styles/theme'

type ComponentProps = {
  territories: TerritoryData[]
  updateTerritories: (f: (draft: WritableDraft<TerritoryData>[]) => void | TerritoryData[]) => void
  show: boolean
  setShow?: (show: boolean) => void
}

const StyledControls = styled.div`
  .opacity-background.open {
    z-index: 1;
    position: fixed;
    inset: 0px;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease-out 0s, visibility 0.3s ease-out 0s;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .controls {
    display: flex;
    flex-flow: row wrap;
    padding: 0.5rem;
    justify-content: center;
    top: 0;
    bottom: 0;
    width: 15%;
    position: fixed;
    z-index: 2;
    overflow-x: hidden;
    background-color: white;
    // hide sidebar
    transition: all 0.5s ease;
    visibility: visible;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    button {
      height: 2rem;
      width: 4rem;
      margin: 0.75rem;
      border: 1px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      &.is-us {
        width: 100%;
      }
      &.active {
        background-color: ${colors.starblue};
        color: white;
        font-weight: 800;
      }
      &:hover {
        box-shadow: 10px 10px 5px whitesmoke;
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
      }
    }
    // add transition when showing the sidebar
    &.open {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
`
StyledControls.displayName = 'Controls'

const Controls: React.FC<ComponentProps> = ({ territories, updateTerritories, show, setShow }) => {
  const getStates = async () => {
    const states = await axios.get('https://api.covidtracking.com/v1/states/info.json')
    updateTerritories((draft) => {
      const mutatedStates = map(states.data, (d) => {
        return {
          territory: d.state,
          name: d.name,
          active: false,
        }
      })
      return [...draft, ...mutatedStates]
    })
  }

  useEffect(() => {
    getStates()
  }, [])

  console.log(show)

  const onClick = (s: TerritoryData) => {
    updateTerritories((draft) => {
      const stateIndex = findIndex(territories, (ast) => ast.territory === s.territory)
      draft[stateIndex].active = !draft[stateIndex].active
    })
  }

  return (
    <StyledControls>
      <div
        className={cn('opacity-background', cn({ open: show }))}
        onClick={() => setShow(false)}
      ></div>
      <div className={cn('controls', cn({ open: show }))}>
        {map(territories, (s, i) => {
          return (
            <button
              key={i}
              onClick={() => onClick(s)}
              className={cn({ active: s.active, 'is-us': s.territory === 'US' })}
            >
              {s.territory}
            </button>
          )
        })}
      </div>
    </StyledControls>
  )
}

export default Controls
