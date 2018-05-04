import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import CardList from '../../components/CardList'
import { Tab, TabItem } from '../../components/Tab'
import { PlayByPlay, Summary, BoxScore } from '../../components/Scores'
import { Shadow } from '../../styles'
import * as actions from './actions'

const Wrapper = styled.div`
    display: grid;
    grid-template-areas:    "header header"
                            "cards content";
    grid-template-rows: 50px 1fr;
    grid-template-columns: minmax(27%, 300px) 1fr;
    grid-gap: 1em 1em;
    padding: 0 10px;
`;

const NavBar = styled.div`
    grid-area:    header;
    background-color: red;
`;
const Cards = styled.div`
    grid-area: cards;
`;
const Content = styled.div`
    ${Shadow}
    grid-area: content;
    background-color: #fff;
    overflow-y: scroll !important;
    padding: 10px;
    border-radius: 5px;
`;

class BoxScores extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            gid: '0041700212',
        }
    }

    componentDidMount() {
        this.props.live.games.forEach(({ gid }) => {
            this.props.fetchPlayByPlay(gid)
            this.props.fetchLiveGameBox(gid)
        })
    }

    renderSummary() {
        if (Object.keys(this.props.bs.gameDetails).length === 0) {

        } else {
            if (this.props.bs.gameDetails['0041700212'] &&
                this.props.bs.gameDetails['0041700212'].bs) {
                const {
                    hs,
                    vs,
                    htn,
                    vtn,
                    hss,
                    vss,
                } = this.props.bs.gameDetails['0041700212'].bs
                return (
                    <Summary hs={hs} vs={vs} htn={htn} vtn={vtn} vss={vss} hss={hss}/>
                )
            }
        }
    }

    renderBoxScores() {
        const { bs } = this.props
        if (Object.keys(bs.gameDetails).length !== 0 &&
            bs.gameDetails['0041700212'] &&
            bs.gameDetails['0041700212'].bs) {
            return (
                <React.Fragment>
                    <BoxScore players={bs.gameDetails['0041700212'].bs.hpstsg} />
                    <BoxScore players={bs.gameDetails['0041700212'].bs.vpstsg} />
                </React.Fragment>
            )
        }
    }

    render() {
        const { live, bs } = this.props
        if (bs.isLoading || live.isLoading) {
            return (
                <div>Loading...</div>
            )
        }
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
                    <CardList games={live.games}/>
                </Cards>
                <Content>
                    {this.renderSummary()}
                    {this.renderBoxScores()}
                </Content>
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live, bs }) => ({
    live,
    bs,
})

export default connect(mapStateToProps, actions)(BoxScores)
