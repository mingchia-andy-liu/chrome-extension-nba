import React, {Fragment} from 'react'
import styled from 'styled-components'
import Card from '../components/Card'
import CardList from '../components/CardList';
import Links from '../components/Links'

const game = {
    hta: "PHI",
    htn: "76ers",
    vta: "BOS",
    vtn: "Boston",
    hs: 110,
    vs: 119,
    series: "BOS leads series 1-0",
    clk: "00:00.0",
    stt: "Final",
}

const Title = styled.h2`
    text-align: center;
`;

class PopUp extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Fragment>
                <Title>Today's Games</Title>
                <Links />
                <CardList />
            </Fragment>
        )
    }
}

export default PopUp
