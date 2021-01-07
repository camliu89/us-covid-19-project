import React, { useEffect } from 'react'
import axios from 'axios'
import { map } from 'lodash'
import cn from 'classnames'
import styled from 'styled-components'

import { Territory } from '../../utils/types'
import { WritableDraft } from 'immer/dist/internal'
import { colors } from '../../styles/theme'

type ComponentProps = {
  territories: Territory[]
  updateTerritories: (f: (draft: WritableDraft<Territory>[]) => void | Territory[]) => void
  show: boolean
  setShow?: (show: boolean) => void
  toggleTerritory: (s: Territory) => void
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
    top: 0;
    bottom: 0;
    width: 20%;
    position: fixed;
    z-index: 2;
    overflow-x: hidden;
    background-color: white;
    // hide sidebar
    transition: all 0.5s ease;
    visibility: visible;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);

    // add transition when showing the sidebar
    &.open {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    .header {
      text-align: center;
      background-color: ${colors.darkblue};
      color: ${colors.powderblue};
      padding: 1rem;
      font-size: 1.4rem;
      font-weight: 600;
    }
    .territories {
      display: flex;
      flex-flow: row wrap;
      padding: 0.5rem;
      justify-content: center;
      button {
        height: 2rem;
        width: 4rem;
        margin: 0.75rem;
        border: 1px solid transparent;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
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
    }
  }
`
StyledControls.displayName = 'Controls'

const Controls: React.FC<ComponentProps> = ({
  territories,
  updateTerritories,
  show,
  setShow,
  toggleTerritory,
}) => {
  const getStates = async () => {
    const states = await axios.get('https://api.covidtracking.com/v1/states/info.json')
    updateTerritories((draft) => {
      const mutatedStates = map(states.data, (d) => {
        return {
          abbreviation: d.state,
          name: d.name,
          active: false,
          data: null,
        }
      })
      return [...draft, ...mutatedStates]
    })
  }

  useEffect(() => {
    getStates()
  }, [])

  return (
    <StyledControls>
      <div
        className={cn('opacity-background', cn({ open: show }))}
        onClick={() => setShow(false)}
      ></div>
      <div className={cn('controls', cn({ open: show }))}>
        <div className="header">Territories</div>
        <div className="territories">
          {map(territories, (s, i) => {
            return (
              <button
                key={i}
                onClick={() => toggleTerritory(s)}
                className={cn({ active: s.active, 'is-us': s.abbreviation === 'US' })}
              >
                {s.abbreviation}
              </button>
            )
          })}
        </div>
      </div>
    </StyledControls>
  )
}

export default Controls
