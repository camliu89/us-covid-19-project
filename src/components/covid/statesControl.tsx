import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { map, lowerCase, findIndex } from 'lodash'
import cn from 'classnames'
import styled from 'styled-components'

type ComponentProps = {
  activeStates: any
  updateActiveStates: any
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
    &.active {
      background-color: lightblue;
      font-weight: 800;
    }
  }
`
Controls.displayName = 'Controls'

const StatesControl: React.FC<ComponentProps> = ({ activeStates, updateActiveStates }) => {
  const getStates = async () => {
    const state = await axios.get('https://api.covidtracking.com/v1/states/info.json')
    setStates(map(state.data, (d) => d.state))
  }

  const [states, setStates] = useState<string[]>([])

  useEffect(() => {
    getStates()
  }, [])

  const onClick = (s: string, activeStateIndex: number) => {
    updateActiveStates((draft) => {
      const state = lowerCase(s)
      if (activeStateIndex >= 0) draft.splice(activeStateIndex, 1)
      else draft.push(state)
    })
  }

  return (
    <Controls className="controls">
      {map(states, (s, i) => {
        const activeStateIndex = findIndex(activeStates, (ast) => ast === lowerCase(s))
        return (
          <button
            key={i}
            onClick={() => onClick(s, activeStateIndex)}
            className={cn({ active: activeStateIndex >= 0 })}
          >
            {s}
          </button>
        )
      })}
    </Controls>
  )
}

export default StatesControl
