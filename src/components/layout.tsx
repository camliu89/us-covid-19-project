import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

import Header from './header'

import '../styles/global.css'
import { colors } from '../styles/theme'

const StyledLayout = styled.div`
  .header-main {
    padding: 1.5rem 2rem;
  }
  .footer {
    text-align: center;
    padding: 0.75rem 0;
    border-top: 1px solid;
    background: ${colors.darkblue};
    color: ${colors.powderblue};
    font-weight: 800;
    box-shadow: 0 0 10px;
    position: fixed;
    width: 100%;
    bottom: 0;
    a {
      text-decoration: none;
      color: ${colors.powderblue};
    }
  }
`
StyledLayout.displayName = 'StyledLayout'

const Layout: React.FC = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <StyledLayout>
      <div className="header-main">
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main>{children}</main>
      </div>
      <div className="footer">
        Copyright © <a href="mailto:acamliu89@gmail.com">Alexander Cam Liu</a> -{' '}
        {new Date().getFullYear()}
      </div>
    </StyledLayout>
  )
}

export default Layout
