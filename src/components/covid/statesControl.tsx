import React, { useEffect } from 'react'
import axios from 'axios'
import { map, findIndex } from 'lodash'
import cn from 'classnames'
import styled from 'styled-components'

import { StateData } from '../../utils/types'

type ComponentProps = {
  states: StateData[]
  updateStates: any
}

const Controls = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;
  border-right: 1px solid;
  button {
    height: 2rem;
    width: 4rem;
    margin: 0.75rem;
    border: 1px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    &.is-us {
      background-color: lightgreen;
    }
    &.active {
      background-color: lightblue;
      &.is-us {
        background-color: green;
      }
      font-weight: 800;
    }
  }
`
Controls.displayName = 'Controls'

const StatesControl: React.FC<ComponentProps> = ({ states, updateStates }) => {
  const getStates = async () => {
    const state = await axios.get('https://api.covidtracking.com/v1/states/info.json')
    updateStates((draft) => {
      const mutatedStates = map(state.data, (d) => {
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

  const onClick = (s: StateData) => {
    updateStates((draft) => {
      const stateIndex = findIndex(states, (ast) => ast.territory === s.territory)
      draft[stateIndex].active = !draft[stateIndex].active
    })
  }

  return (
    <Controls className="controls">
      {map(states, (s, i) => {
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
    </Controls>
  )
}

export default StatesControl
