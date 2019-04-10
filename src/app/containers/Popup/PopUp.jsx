import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment-timezone'
import CardList from '../../components/CardList'
import { DarkModeCheckbox, NoSpoilerCheckbox, BroadcastCheckbox } from '../../components/Checkbox'
import DatePicker from '../../containers/DatePicker'
import Links from '../../components/Links'
import { Column, ButtonsWrapper } from '../../styles'
import * as actions from './actions'
import { DATE_FORMAT } from '../../utils/constant'

import browser from '../../utils/browser'

const Wrapper = styled(Column)`
    padding: 10px;
    width: 100%;
    min-width: 370px;
`

class PopUp extends React.Component {
    static propTypes = {
        live: PropTypes.object.isRequired,
        date: PropTypes.shape({
            date: PropTypes.object.isRequired,
        }),
        fetchGamesIfNeeded: PropTypes.func.isRequired,
        history: PropTypes.shape({
            push: PropTypes.func.isRequired,
        }),
    }

    constructor(props) {
        super(props)

        this.state = {
            isPopup: false,
            date: moment(this.props.date.date).format(DATE_FORMAT),
        }
        // check if popup is opened in the "popup" or in a tab
        // if it is in a popup window, there is no tab
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
        const dateStr = moment(date).format(DATE_FORMAT)
        this.props.fetchGamesIfNeeded(dateStr, null, true)
        document.title = 'Box Scores | Popup'
    }

    componentDidUpdate(prevProps) {
        const prevDate = prevProps.date.date
        const {
            fetchGamesIfNeeded,
            date: {
                date: currDate,
            },
        } = this.props
        if(!moment(currDate).isSame(prevDate)) {
            // props is already updated date, force update.
            fetchGamesIfNeeded(moment(currDate).format(DATE_FORMAT), null, true, false)
        }
    }

    selectGame(e) {
        const { isPopup, date } = this.state
        const id = e.currentTarget.dataset.id
        if (isPopup) {
            browser.tabs.create({ url: `/index.html#/boxscores/${id}?date=${date}` })
            window.close()
        } else {
            this.props.history.push(`/boxscores/${id}`)
        }
    }

    selectDate = (date) => {
        this.setState({date})
    }

    render() {
        const { live } = this.props
        return (
            <Wrapper>
                <DatePicker hide={this.state.isPopup} onChange={this.selectDate}/>
                <Links />
                <ButtonsWrapper>
                    <DarkModeCheckbox />
                    <NoSpoilerCheckbox />
                    <BroadcastCheckbox />
                </ButtonsWrapper>
                <CardList
                    selected={'0'}
                    isLoading={live.isLoading}
                    games={live.games}
                    onClick={this.selectGame.bind(this)}
                />
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live, date }) => ({
    live,
    date,
})

export default withRouter(connect(mapStateToProps, actions)(PopUp))
