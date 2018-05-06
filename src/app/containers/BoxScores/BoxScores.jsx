import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CardList from '../../components/CardList'
import DatePicker from '../../containers/DatePicker'
import { Tab, TabItem } from '../../components/Tab'
import { PlayByPlay, Summary, PlayerStats } from '../../components/Scores'
import TeamInfo from '../../components/TeamInfo'
import Overlay from '../../components/Overlay'
import Loader from '../../components/Loader'
import { Shadow, Row } from '../../styles'
import { isWinning } from '../../utils/format'
import getAPIDate from '../../utils/getApiDate'
import { fetchLiveGameBox } from './actions'
import { fetchGames } from '../Popup/actions'

const Wrapper = styled.div`
    display: grid;
    grid-template-areas:    "header header"
                            "cards content";
    grid-template-rows: 50px 1fr;
    grid-template-columns: minmax(27%, 300px) 1fr;
    grid-gap: 1em 1em;
    padding: 0 10px;
`
const NavBar = styled.div`
    grid-area:    header;
    background-color: red;
`
const Cards = styled.div`
    grid-area: cards;
`
const Content = styled.div`
    ${Shadow}
    grid-area: content;
    background-color: #fff;
    overflow-y: scroll !important;
    padding: 10px;
    border-radius: 5px;
`

const Title = styled(Row)`
    font-size: calc(12px + 1vw);
`

const StyledTitleItem = styled.div`
    padding: 0 10px;
    ${props => !props.winning && 'opacity:0.5;'};
`

const StyledScore= styled(StyledTitleItem)`
    padding: 0 10px;
    ${props => props.winning ? 'color: green;' : 'opacity:0.5;'};
`

class BoxScores extends React.Component {
    constructor(props) {
        super(props)

        const { match : {params : { id } } } = this.props
        this.state = {
            id: id ? id : '0',
            quarter: 0,
            date: getAPIDate().format('YYYYMMDD'),
        }
    }

    componentDidMount() {
        this.props.fetchGames(getAPIDate().format('YYYYMMDD'))
        if (this.state.id !== '0') {
            this.props.fetchLiveGameBox(getAPIDate().format('YYYYMMDD'), this.state.id)
        }
    }

    renderTitle(bsData) {
        const {
            home: {
                abbreviation: hta,
                nickname: htn,
                score: hs,
            },
            visitor: {
                abbreviation: vta,
                nickname: vtn,
                score: vs,
            },
        } = bsData
        return (
            <Title>
                <TeamInfo ta={vta} tn={vtn}  winning={isWinning(vs, hs)}/>
                <StyledScore winning={isWinning(vs, hs)}> {vs} </StyledScore>
                -
                <StyledScore winning={isWinning(hs, vs)}> {hs} </StyledScore>
                <TeamInfo ta={hta} tn={htn}  winning={isWinning(hs, vs)}/>
            </Title>
        )

    }

    renderSummary(bsData) {
        const {
            home,
            visitor,
        } = bsData
        return <Summary home={home} visitor={visitor}/>
    }

    renderPlyaerStats(bsData) {
        const {
            home: { players: { player: homePlayers } },
            visitor: { players: { player: visitorPlayers } },
        } = bsData
        return <PlayerStats hps={homePlayers} vps={visitorPlayers} />
    }

    renderPlaybyPlay(pbpData) {
        return <PlayByPlay pbp={pbpData} />
    }

    renderContent() {
        const { bs: { bsData, pbpData} } = this.props
        if (Object.keys(bsData).length !== 0 && pbpData.length !== 0) {
            return (
                <React.Fragment>
                    {this.renderTitle(bsData)}
                    <h3>Summary</h3>
                    {this.renderSummary(bsData)}
                    <h3>Player Stats</h3>
                    {this.renderPlyaerStats(bsData)}
                    <h3>Play By Play</h3>
                    {this.renderPlaybyPlay(pbpData)}
                </React.Fragment>
            )
        } else {
            if (this.state.id === '0') {
                return <Overlay text={'Click on a game to view details'}/>
            } else {
                return <Overlay />
            }
        }
    }

    selecteGame(e) {
        const id = e.currentTarget.dataset.id
        const { date } = this.state
        this.props.fetchLiveGameBox(date, id)
        this.setState({ id })
    }

    render() {
        const {
            live,
            bs,
        } = this.props

        return (
            <Wrapper>
                <NavBar>
                    <Tab startIndex={0}>
                        <TabItem to="/" label="Options"/>
                        <TabItem to="/" label="Standings"/>
                        <TabItem to="/" label="Playoff"/>
                    </Tab>
                </NavBar>
                <Cards>
                    <DatePicker onChange={(date) =>
                        this.setState({
                            id: '0',
                            date,
                        })}
                    />
                    <CardList isLoading={live.isLoading} games={live.games} onClick={this.selecteGame.bind(this)}/>
                </Cards>
                <Content>
                    {bs.isLoading
                        ? <Loader />
                        : this.renderContent()
                    }
                </Content>
            </Wrapper>
        )
    }
}

BoxScores.propTypes = {
    live: PropTypes.object,
    bs: PropTypes.shape({
        bsData: PropTypes.object.isRequired,
        pbpData: PropTypes.object.isRequired,
    }),
    date: PropTypes.shape({
        date: PropTypes.object.isRequired,
    }),
    match: PropTypes.object.isRequired,
    fetchLiveGameBox: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
}

const mapStateToProps = ({ live, bs, date }) => ({
    live,
    bs,
    date,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchLiveGameBox,
        fetchGames,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BoxScores)
