import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { colors } from '../styles/theme'

const StyledLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 10vh;
  margin-top: 1rem;
  .loader {
    width: 40px;
    height: 40px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 5px solid ${colors.skyblue};
    border-right: 10px solid transparent;
    -webkit-animation: spinner 0.6s linear infinite;
    animation: spinner 0.6s linear infinite;
    @keyframes spinner {
      to {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
      }
    }
  }
`

const Loading = (): ReactElement => {
  return (
    <StyledLoader>
      <div className="loader" />
    </StyledLoader>
  )
}
Loading.displayName = 'Loading'

export default Loading
