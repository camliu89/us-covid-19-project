import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

import { colors } from '../styles/theme'

type ComponentProps = {
  siteTitle: string
}

const StyledHeader = styled.div`
  padding: 1.5rem 3rem;
  h1 {
    margin: 0;
    a {
      color: ${colors.starblue};
      text-decoration: none;
    }
  }
`
StyledHeader.displayName = 'StyledHeader'

const Header: React.FC<ComponentProps> = ({ siteTitle }) => (
  <StyledHeader>
    <div>
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
    </div>
  </StyledHeader>
)

export default Header
