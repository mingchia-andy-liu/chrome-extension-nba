import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Card from '../components/Card'
import CardList from '../components/CardList';
import Links from '../components/Links'
import { Column } from '../styles'

const Wrapper = styled(Column)`
    padding: 0 10px;
    width: 100%;
`;

const Title = styled.h2`
    text-align: center;
`;

class PopUp extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Wrapper>
                <Title>Today's Games</Title>
                <Links />
                <CardList games={this.props.live.games}/>
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live }) => ({
    live
})

export default connect(mapStateToProps, null)(PopUp)
