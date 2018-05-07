import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment-timezone'
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
`

class PopUp extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const {
            date: {
                date,
                isDirty,
            },
        } = this.props
        const dateStr = isDirty
            ? moment(date).format('YYYYMMDD')
            : getAPIDate().format('YYYYMMDD')
        this.props.fetchGames(dateStr)
    }

    selecteGame(e) {
        const id = e.currentTarget.dataset.id
        this.props.history.push(`/boxscores/${id}`)
    }

    render() {
        const { live } = this.props
        return (
            <Wrapper>
                <DatePicker onChange={() => {}}/>
                <Links />
                <CardList isLoading={live.isLoading} games={live.games} onClick={this.selecteGame.bind(this)}/>
            </Wrapper>
        )
    }
}

PopUp.propTypes = {
    live: PropTypes.object.isRequired,
    date: PropTypes.shape({
        date: PropTypes.object.isRequired,
    }),
    fetchGames: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
}

const mapStateToProps = ({ live, date }) => ({
    live,
    date,
})

export default withRouter(connect(mapStateToProps, actions)(PopUp))
