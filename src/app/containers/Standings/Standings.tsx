import * as React from 'react'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import * as actions from './actions'
import { mediaQuery } from '../../styles'

const Cell = styled.td`
  width: 10vw;
  height: 1.8em !important;
  text-align: center;
  vertical-align: middle;
  ${mediaQuery`width: 20vw;`}
`

const NonMainCell = styled(Cell)`
  ${mediaQuery`display: none !important;`}
`

const HeaderCell = styled(Cell)`
  width: 10vw;
  font-weight: 700;
  background-color: #046fdb;
  color: #fff;
  ${mediaQuery`width: 20vw;`}
`

const NonMainHeaderCell = styled(HeaderCell)`
  ${mediaQuery`display: none !important;`}
`

const Row = styled.tr`
  ${(props) => (props.border ? 'border-bottom: 1px solid blue;' : '')}
`

const List = styled.ul`
  list-style: none;
  padding: 0 1em;
`

const ListItem = styled.li`
  padding-bottom: 5px;
`

const renderConference = (team, i) => {
  return (
    <Row key={`${team.id}-${i}`}>
      <Cell style={{ width: '5vw' }}>
        {i + 1}
        {team.playoffCode && `- ${team.playoffCode}`}
      </Cell>
      <Cell>{team.name}</Cell>
      <Cell>{team.win}</Cell>
      <Cell>{team.loss}</Cell>
      <Cell>{Math.round(team.percentage * 100)}%</Cell>
      <Cell>{team.gamesBehind}</Cell>
      <NonMainCell>{team.homeRecord}</NonMainCell>
      <NonMainCell>{team.awayRecord}</NonMainCell>
      <NonMainCell>{team.lastTenRecord}</NonMainCell>
      <NonMainCell>
        {team.streak >= 0 ? `W ${team.streak}` : `L ${Math.abs(team.streak)}`}
      </NonMainCell>
    </Row>
  )
}

const renderHeader = (conf) => {
  const headers = ['Home Record', 'Road Record', 'L10 Streak', 'Streak']

  return (
    <Row>
      <HeaderCell>Rank</HeaderCell>
      <HeaderCell>Team</HeaderCell>
      <HeaderCell>Win</HeaderCell>
      <HeaderCell>Loss</HeaderCell>
      <HeaderCell>Win %</HeaderCell>
      <HeaderCell>GB</HeaderCell>
      {headers.map((element) => (
        <NonMainHeaderCell key={`stats-${element}-${conf}`}>
          {element}
        </NonMainHeaderCell>
      ))}
    </Row>
  )
}

const renderContent = (east, west, isLoading) => {
  if (isLoading) return <Loader />

  return (
    <React.Fragment>
      <h3>East</h3>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {renderHeader('east')}
          {east.map((team, i) => renderConference(team, i))}
        </tbody>
      </table>
      <h3>West</h3>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {renderHeader('west')}
          {west.map((team, i) => renderConference(team, i))}
        </tbody>
      </table>
      <List>
        <ListItem>
          <strong>x</strong> - Clinched Playoff Berth
        </ListItem>
        <ListItem>
          <strong>o</strong> - Eliminated from Playoff contention
        </ListItem>
        <ListItem>
          <strong>nw</strong> - Clinched Northwest Division
        </ListItem>
        <ListItem>
          <strong>c</strong> - Clinched Central Division
        </ListItem>
        <ListItem>
          <strong>p</strong> - Clinched Pacific Division
        </ListItem>
        <ListItem>
          <strong>se</strong> - Clinched Southeast Division
        </ListItem>
        <ListItem>
          <strong>e</strong> - Clinched Eastern Conference
        </ListItem>
        <ListItem>
          <strong>sw</strong> - Clinched Southwest Division
        </ListItem>
        <ListItem>
          <strong>w</strong> - Clinched Western Conference
        </ListItem>
        <ListItem>
          <strong>a</strong> - Clinched Atlantic Division
        </ListItem>
      </List>
    </React.Fragment>
  )
}

const Standings = ({ fetchStandings, east, west, isLoading }) => {
  React.useEffect(() => {
    fetchStandings()
    document.title = 'Box Scores | Standings'
  }, [])

  return (
    <Layout>
      <Layout.Header>{<Header index={1} />}</Layout.Header>
      <Layout.Content>{renderContent(east, west, isLoading)}</Layout.Content>
    </Layout>
  )
}

Standings.propTypes = {
  east: PropTypes.array.isRequired,
  fetchStandings: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  west: PropTypes.array.isRequired,
}

const mapStateToProps = ({ standings: { east, west, isLoading } }) => ({
  east,
  isLoading,
  west,
})

export default connect(mapStateToProps, actions)(Standings)
