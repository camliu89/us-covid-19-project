import React from 'react'
import styled from 'styled-components'

import Layout from '../components/layout'
import SEO from '../components/seo'

const StyledReleaseNotes = styled.div`
  .notes > ul > li {
    margin-bottom: 0.75rem;
  }
`

const NotFoundPage: React.FC = () => (
  <Layout>
    <StyledReleaseNotes>
      <SEO title="Release Notes" />
      <h2>Release Notes</h2>
      <div className="notes">
        <h3>0.1.0</h3>
        <ul>
          <li>
            Added sidebar with US States.
            <ul>
              <li>Clicking a state, show the state&apos;s chart</li>
            </ul>
          </li>
          <li>Added charts of each state and US.</li>
          <li>
            Added the following data points:
            <ul>
              <li>Positive Increase.</li>
              <li>Negative Increase.</li>
            </ul>
          </li>
          <li>Added date picker to filter data points in the charts.</li>
          <li>Added attribution to The COVID Tracking Project at The Atlantic.</li>
        </ul>
      </div>
    </StyledReleaseNotes>
  </Layout>
)

export default NotFoundPage
