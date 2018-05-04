import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Card from '../../components/Card'
import CardList from '../../components/CardList';
import Links from '../../components/Links'
import { Column } from '../../styles'
import * as actions from './actions'

const Wrapper = styled(Column)`
    padding: 0 10px;
    width: 100%;
    min-width: 330px;
`;

const Title = styled.h2`
    text-align: center;
`;

class PopUp extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchGames()
    }

    render() {
        return (
            <Wrapper>
                <Title>Today&apos;s Games</Title>
                <Links />
                <CardList games={this.props.live.games}/>
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live }) => ({
    live
})

export default connect(mapStateToProps, actions)(PopUp)
