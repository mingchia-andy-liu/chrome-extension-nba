import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import * as actions from './actions'
import { Media } from '../../styles'

const Cell = styled.td`
    width: 10vw;
    height: 1.8em !important;
    text-align: center;
    vertical-align: middle;
    ${ Media.handheld` width: 20vw; `}
`

const NonMainCell = styled(Cell)`
    ${ Media.handheld` display: none !important; `}
`

const HeaderCell = styled(Cell)`
    width: 10vw;
    font-weight: 700;
    background-color: #046fdb;
    color: #fff;
    ${ Media.handheld` width: 20vw; `}
`

const NonMainHeaderCell = styled(HeaderCell)`
    ${ Media.handheld` display: none !important; `}
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

class Standings extends React.Component {
    static propTypes = {
        east: PropTypes.array.isRequired,
        fetchStandings: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        west: PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchStandings()
    }

    renderHeader(conf) {
        const headers = [
            'GB',
            'Home Record',
            'Road Record',
            'L10 Streak',
            'Streak',
            'PF',
            'PA',
            'Differences'
        ]

        return (
            <Row>
                <HeaderCell>Rank</HeaderCell>
                <HeaderCell>Team</HeaderCell>
                <HeaderCell>Win</HeaderCell>
                <HeaderCell>Loss</HeaderCell>
                <HeaderCell>Win %</HeaderCell>
                {headers.map(element => (
                    <NonMainHeaderCell key={`stats-${element}-${conf}`}>{element}</NonMainHeaderCell>
                ))}
            </Row>
        )
    }

    renderConference(team, i) {
        return (
            <Row key={`${team.id}-${i}`}>
                <Cell style={{width: '5vw'}}>{i+1}</Cell>
                <Cell>{team.name}{team.playoffCode}</Cell>
                <Cell>{team.win}</Cell>
                <Cell>{team.loss}</Cell>
                <Cell>{(Math.round(team.percentage * 100))}%</Cell>
                <NonMainCell>{team.gamesBehind}</NonMainCell>
                <NonMainCell>{team.homeRecord}</NonMainCell>
                <NonMainCell>{team.awayRecord}</NonMainCell>
                <NonMainCell>{team.lastTenRecord}</NonMainCell>
                <NonMainCell>
                    {team.streak >= 0
                        ? `W ${team.streak}`
                        : `L ${Math.abs(team.streak)}`}
                </NonMainCell>
                <NonMainCell>{team.pf}</NonMainCell>
                <NonMainCell>{team.pa}</NonMainCell>
                <NonMainCell>{team.diff}</NonMainCell>
            </Row>
        )
    }

    renderContent() {
        const { east, west, isLoading } = this.props
        if (isLoading) return <Loader />
        return (
            <React.Fragment>
                <h3>East</h3>
                <table style={{borderCollapse: 'collapse'}}>
                    <tbody>
                        {this.renderHeader('east')}
                        {east.map((team, i) => this.renderConference(team, i))}
                    </tbody>
                </table>
                <h3>West</h3>
                <table style={{borderCollapse: 'collapse'}}>
                    <tbody>
                        {this.renderHeader('west')}
                        {west.map((team, i) => this.renderConference(team, i))}
                    </tbody>
                </table>
                <List>
                    <ListItem><strong>x</strong> - Clinched Playoff Berth</ListItem>
                    <ListItem><strong>o</strong> - Eliminated from Playoff contention</ListItem>
                    <ListItem><strong>nw</strong> - Clinched Northwest Division</ListItem>
                    <ListItem><strong>c</strong> - Clinched Central Division</ListItem>
                    <ListItem><strong>p</strong> - Clinched Pacific Division</ListItem>
                    <ListItem><strong>se</strong> - Clinched Southeast Division</ListItem>
                    <ListItem><strong>e</strong> - Clinched Eastern Conference</ListItem>
                    <ListItem><strong>sw</strong> - Clinched Southwest Division</ListItem>
                    <ListItem><strong>w</strong> - Clinched Western Conference</ListItem>
                    <ListItem><strong>a</strong> - Clinched Atlantic Division</ListItem>
                </List>
            </React.Fragment>
        )
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={2}/>}</Layout.Header>
                <Layout.Content>
                    {this.renderContent()}
                </Layout.Content>
            </Layout>
        )
    }
}

const mapStateToProps = ({ standings: { east, west, isLoading } }) => ({
    east,
    isLoading,
    west,
})

export default connect(mapStateToProps, actions)(Standings)
