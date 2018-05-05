import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import CardList from '../../components/CardList'
import DatePicker from '../../containers/DatePicker'
import Links from '../../components/Links'
import { Column } from '../../styles'
import * as actions from './actions'
import getAPIDate from '../../utils/getApiDate'

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
        this.props.fetchGames(getAPIDate().format('YYYYMMDD'))
    }

    render() {
        return (
            <Wrapper>
                <DatePicker />
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
