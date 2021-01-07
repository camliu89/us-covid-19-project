import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

import { colors } from '../styles/theme'

type ComponentProps = {
  siteTitle: string
}

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  h1 {
    margin: 0;
    a {
      color: ${colors.starblue};
      text-decoration: none;
    }
  }
  .info-attribute {
    border: 2px solid #0077b6;
    padding: 1rem;
    width: 25%;
    line-height: 1.8rem;
    a {
      font-weight: 900;
      color: ${colors.starblue};
      text-decoration: underline;
    }
    @media screen and (max-width: 600px) {
      margin-top: 1rem;
      width: 100%;
    }
  }
`
StyledHeader.displayName = 'StyledHeader'

const Header: React.FC<ComponentProps> = ({ siteTitle }) => (
  <StyledHeader>
    <h1>
      <Link to="/">{siteTitle}</Link>
    </h1>
    <div className="info-attribute">
      The data is attributed to{' '}
      <a href="https://covidtracking.com/" target="__blank">
        The COVID Tracking Project at The Atlantic
      </a>{' '}
      under the{' '}
      <a href="https://creativecommons.org/licenses/by/4.0/" target="__blank">
        Creative Commons CC BY 4.0 license
      </a>
      .
    </div>
  </StyledHeader>
)

export default Header
