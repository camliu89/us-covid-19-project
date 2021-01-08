import React from 'react'
import styled from 'styled-components'
import { map, findIndex } from 'lodash'

import { colors } from '../../../styles/theme'
import { DataPoints } from '../../../utils/types'
import { WritableDraft } from 'immer/dist/internal'

type ComponentProps = {
  dataPoints: DataPoints[]
  updateDataPoints: (f: (draft: WritableDraft<DataPoints>[]) => void | DataPoints[]) => void
}
const StyledDataPoints = styled.div`
  .dropdown {
    border: 2px solid #caf0f8;
    background: white;
    color: ${colors.default};
    font-weight: 800;
    border-radius: 10px;
    cursor: pointer;
    padding: 0 1rem;
    &:hover {
      .checkboxes {
        display: block;
      }
    }
  }
  .checkboxes {
    display: none;
    position: absolute;
    border: 2px solid #caf0f8;
    border-radius: 5px;
    padding: 1.5rem;
    z-index: 1;
    left: 230px;
    background: white;
  }
`
StyledDataPoints.displayName = 'StyledDataPoints'

const StyledCheckbox = styled.label`
  // W3 Schools: https://www.w3schools.com/howto/howto_css_custom_checkbox.asp
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked ~ .checkmark {
      background-color: ${(props) => props.color};
      &:after {
        display: block;
      }
    }
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    border: 1px solid ${colors.default};
    &:after {
      content: '';
      position: absolute;
      display: none;
      left: 7px;
      top: 3px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
  &:hover input ~ .checkmark {
    box-shadow: 5px whitesmoke;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
`
StyledCheckbox.displayName = 'StyledDataPoints'

const DataPointsDropdown: React.FC<ComponentProps> = ({ dataPoints, updateDataPoints }) => {
  const renderDataPointsCheckBoxes = () => {
    return (
      <StyledDataPoints className="data-points">
        <div className="dropdown">
          <p>Data Points</p>
          <div className="checkboxes">
            {map(dataPoints, (dp, i) => (
              <StyledCheckbox htmlFor={dp.id} key={i} className="container" color={dp.color}>
                {dp.name}
                <input
                  type="checkbox"
                  id={dp.id}
                  name={dp.id}
                  value={dp.id}
                  checked={dp.show}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const checked = e.target.checked
                    const value = e.target.value
                    updateDataPoints((draft) => {
                      const dpIndex = findIndex(draft, (d) => d.id === value)
                      draft[dpIndex].show = checked
                    })
                  }}
                />
                <span className="checkmark"></span>
              </StyledCheckbox>
            ))}
          </div>
        </div>
      </StyledDataPoints>
    )
  }

  return <>{renderDataPointsCheckBoxes()}</>
}

export default DataPointsDropdown
