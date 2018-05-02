import React, {Fragment} from 'react'
import styled from 'styled-components'
import Card from '../components/Card'
import CardList from '../components/CardList';
import Links from '../components/Links'

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
