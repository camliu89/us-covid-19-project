import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { colors } from '../styles/theme'

const imageStyles = {
  width: '50%',
  margin: '0 auto',
}

const StyledInfo = styled.div`
  text-align: center;
  color: ${colors.darkblue};
  p {
    margin-top: -50px;
    font-style: italic;
  }
  h2 {
    margin-top: 5rem;
  }
`
StyledInfo.displayName = 'StyledInfo'

const NotFoundPage: React.FC = () => {
  const profilePicture = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "404.png" }) {
        childImageSharp {
          fluid(maxWidth: 600, maxHeight: 600) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return (
    <Layout>
      <SEO title="404: Not found" />
      <Img
        fluid={profilePicture?.placeholderImage?.childImageSharp?.fluid}
        alt="Alexander Cam Liu"
        className="profile-picture"
        style={imageStyles}
      />
      <StyledInfo>
        <p>(Image by Beca Cam Liu)</p>
        <h2>404: Page Not Found</h2>
      </StyledInfo>
    </Layout>
  )
}

export default NotFoundPage
