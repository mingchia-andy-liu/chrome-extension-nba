import React from 'react'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import PlayoffColumn from '../../components/PlayoffColumn'
import { useGetPlayoffsQuery } from './api'
import { westSelector, eastSelector, finalSelector } from './selector'

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 40px; /* Space for connecting lines */
`

const renderContent = ({ isLoading, isError, refetch, west, east, final }) => {
  if (isLoading) return <Loader />
  if (isError) {
    return (
      <div role="alert">
        <p>Unable to load playoffs.</p>
        <button onClick={refetch}>Try again</button>
      </div>
    )
  }
  return (
    <div style={{ margin: '0 5%' }}>
      <ColumnWrapper>
        <PlayoffColumn title="RD1" series={west.first} side="left" />
        <PlayoffColumn title="RD2" series={west.second} side="left" />
        <PlayoffColumn title="WCF" series={west.final} side="left" />
        <PlayoffColumn title="FIN" series={final} side="center" />
        <PlayoffColumn title="ECF" series={east.final} side="right" />
        <PlayoffColumn title="RD2" series={east.second} side="right" />
        <PlayoffColumn title="RD1" series={east.first} side="right" />
      </ColumnWrapper>
    </div>
  )
}

const Playoffs = () => {
  const {
    data: series = [],
    isError,
    isLoading,
    refetch,
  } = useGetPlayoffsQuery()
  const west = westSelector(series)
  const east = eastSelector(series)
  const final = finalSelector(series)

  React.useEffect(() => {
    document.title = 'Box Scores | Playoffs'
  }, [])

  return (
    <Layout>
      <Layout.Header>{<Header index={2} />}</Layout.Header>
      <Layout.Content>
        {renderContent({ isLoading, isError, refetch, west, east, final })}
      </Layout.Content>
    </Layout>
  )
}

export default Playoffs
