import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import moment from 'moment-timezone'
import DatePicker from '../DatePicker'
import CardList from '../../components/CardList'
import { DarkModeCheckbox, NoSpoilerCheckbox, BroadcastCheckbox } from '../../components/Checkbox'
import { DATE_FORMAT } from '../../utils/constant'
import { ButtonsWrapper } from '../../styles'
import { fetchGamesIfNeeded } from '../Popup/actions'
import { dispatchChangeDate } from '../DatePicker/actions'
import { fetchLiveGameBoxIfNeeded } from '../BoxScoresDetails/actions'
import { getDateFromQuery } from '../../utils/common'


const Wrapper = styled.div`
    grid-area: sidebar;
`

class Sidebar extends React.Component {
    static propTypes = {
        date: PropTypes.shape({
            date: PropTypes.object.isRequired,
        }),
        live: PropTypes.object.isRequired,

        fetchGamesIfNeeded: PropTypes.func.isRequired,
        fetchLiveGameBoxIfNeeded: PropTypes.func.isRequired,
        dispatchChangeDate: PropTypes.func.isRequired,

        history: PropTypes.object.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
            search: PropTypes.string.isRequired,
        }),
        match: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)

        const {
            match : { params : { id } },
            date: { date },
        } = this.props
        const dateStr = moment(date).format(DATE_FORMAT)
        const queryDate = getDateFromQuery(this.props)


        this.state = {
            id: id ? id : '',
            date: queryDate == null ? dateStr : queryDate,
        }
    }

    componentDidMount() {
        const { date } = this.state
        this.props.fetchGamesIfNeeded(date, null, true)
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

    selectGame = (e) => {
        const id = e.currentTarget.dataset.id
        const { location: { pathname } } = this.props
        if (pathname.startsWith('/boxscores')) {
            this.props.history.replace(`/boxscores/${id}`)
        } else {
            this.props.history.push(`/boxscores/${id}`)
        }
        const { date } = this.state
        this.props.fetchLiveGameBoxIfNeeded(date, id)
        this.setState({ id })
    }

    dateOnChange = () => {
        this.props.history.replace('/boxscores')
        this.setState({id: ''})
    }

    render() {
        const {live} = this.props
        const {date} = this.state

        return (
            <Wrapper>
                <DatePicker startDate={date} onChange={this.dateOnChange} />
                <ButtonsWrapper>
                    <DarkModeCheckbox />
                    <NoSpoilerCheckbox />
                    <BroadcastCheckbox />
                </ButtonsWrapper>
                <CardList
                    isLoading={live.isLoading}
                    games={live.games}
                    onClick={this.selectGame}
                    selected={this.state.id}
                />
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live, date }) => ({
    live,
    date,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchGamesIfNeeded,
        dispatchChangeDate,
        fetchLiveGameBoxIfNeeded,
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar))

