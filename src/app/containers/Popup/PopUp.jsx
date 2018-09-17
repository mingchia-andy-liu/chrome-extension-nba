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

import browser from '../../utils/browser'

const Wrapper = styled(Column)`
    padding: 10px;
    width: 100%;
    min-width: 330px;
`

class PopUp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isPopup: false,
            date: moment(this.props.date.date).format('YYYYMMDD'),
        }
        // check if popup is opened in the "popup" or in a tab
        // if it is in a popup winodw, there is no tab
        browser.tabs.getCurrent((tab) => {
            if (!tab) {
                this.setState({ isPopup: true })
            }
        })
    }

    componentDidMount() {
        const {
            date: { date },
        } = this.props
        const dateStr = moment(date).format('YYYYMMDD')
        this.props.fetchGamesIfNeeded(dateStr, null, true)
    }

    selectGame(e) {
        const { isPopup, date } = this.state
        const id = e.currentTarget.dataset.id
        if (isPopup) {
            browser.tabs.create({ url: `/index.html#/boxscores/${id}?date=${date}` })
        } else {
            this.props.history.push(`/boxscores/${id}`)
        }
    }

    selectDate(date) {
        this.setState({date})
    }

    render() {
        const { live } = this.props
        return (
            <Wrapper>
                <DatePicker hide={true} onChange={this.selectDate.bind(this)}/>
                <Links />
                <CardList selected={'0'} isLoading={live.isLoading} games={live.games} onClick={this.selectGame.bind(this)}/>
            </Wrapper>
        )
    }
}

PopUp.propTypes = {
    live: PropTypes.object.isRequired,
    date: PropTypes.shape({
        date: PropTypes.object.isRequired,
    }),
    fetchGamesIfNeeded: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
}

const mapStateToProps = ({ live, date }) => ({
    live,
    date,
})

export default withRouter(connect(mapStateToProps, actions)(PopUp))
