import React, {Fragment} from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Card from '../components/Card'
import CardList from '../components/CardList';
import Links from '../components/Links'
import { Tab, TabItem } from '../components/Tab'
import { PlayByPlay, Summary } from '../components/Scores'
import { Shadow } from '../styles'

const Wrapper = styled.div`
    display: grid;
    grid-template-areas:    "header header"
                            "cards content";
    grid-template-rows: 50px 1fr;
    grid-template-columns: minmax(30%, 300px) 1fr;
    grid-gap: 1em 1em;
    padding: 0 10px;
`;

const NavBar = styled.div`
    grid-area:    header;
    background-color: red;
`;
const Cards = styled.div`
    grid-area: cards;
    background-color: blue;

`;
const Content = styled.div`
    ${Shadow}
    grid-area: content;
    background-color: #fff;
    overflow-y: scroll !important;
    padding: 10px;
    border-radius: 5px;
`;

const Title = styled.h2`
    text-align: center;
`;

const home = {
    name: 'home',
    summary: [
        {
            value: 0,
            score: 10
        },
        {
            value: 1,
            score: 10
        },
        {
            value: 2,
            score: 10
        },
        {
            value: 3,
            score: 10
        },
        {
            value: 4,
            score: 10
        },
        {
            value: 5,
            score: 10
        }
    ],
    score: 20
}

const visitor = {
    name: 'asd',
    summary: [
        {
            value: 0,
            score: 10
        },
        {
            value: 1,
            score: 10
        },
        {
            value: 2,
            score: 10
        },
        {
            value: 3,
            score: 10
        },
        {
            value: 4,
            score: 10
        },
        {
            value: 5,
            score: 10
        }
    ],
    score: 21
}

class BoxScores extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Wrapper>
                <NavBar>
                    <Tab startIndex={0}>
                        <TabItem to="/" label="Options"/>
                        <TabItem to="/" label="Standings"/>
                        <TabItem to="/" label="Playoff"/>
                    </Tab>
                 </NavBar>
                <CardList games={this.props.live.games}/>
                <Content>
                    <Summary home={home} visitor={visitor} />
                    <Summary home={home} visitor={visitor} />
                </Content>
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live }) => ({
    live
})

export default connect(mapStateToProps, null)(BoxScores)
