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
import { fetchLiveGameBoxIfNeeded, fetchGameHighlightIfNeeded } from '../BoxScoresDetails/actions'


const Wrapper = styled.div`
    grid-area: sidebar;
`

class Sidebar extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        date: PropTypes.object.isRequired,
        live: PropTypes.object.isRequired,

        fetchGamesIfNeeded: PropTypes.func.isRequired,
        fetchLiveGameBoxIfNeeded: PropTypes.func.isRequired,
        fetchGameHighlightIfNeeded: PropTypes.func.isRequired,
        dispatchChangeDate: PropTypes.func.isRequired,

        history: PropTypes.object.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
            search: PropTypes.string.isRequired,
        }),
    }

    constructor(props) {
        super(props)

        const { id } = this.props
        this.state = { id: id ? id : '' }
    }

    componentDidMount() {
        const { date } = this.props
        const dateStr = moment(date).format(DATE_FORMAT)
        this.props.fetchGamesIfNeeded(dateStr, null, true)
    }

    componentDidUpdate(prevProps) {
        const prevDate = prevProps.date
        const {
            fetchGamesIfNeeded,
            date: currDate,
        } = this.props
        if(!moment(currDate).isSame(prevDate)) {
            // props is already updated date, force update.
            fetchGamesIfNeeded(moment(currDate).format(DATE_FORMAT), null, true, false)
        }
    }

    selectGame = (e) => {
        const id = e.currentTarget.dataset.id
        const { location: { pathname }, date } = this.props
        if (pathname.startsWith('/boxscores')) {
            this.props.history.replace(`/boxscores/${id}`)
        } else {
            this.props.history.push(`/boxscores/${id}`)
        }
        const dateStr = moment(date).format(DATE_FORMAT)
        this.props.fetchLiveGameBoxIfNeeded(dateStr, id).then(() => {
            this.props.fetchGameHighlightIfNeeded(id)
        })
        this.setState({ id })
    }

    dateOnChange = () => {
        this.props.history.replace('/boxscores')
        this.setState({id: ''})
    }

    render() {
        const {live, date} = this.props

        return (
            <Wrapper>
                <DatePicker startDate={date} onChange={this.dateOnChange} />
                <ButtonsWrapper>
                    <DarkModeCheckbox />
                    <NoSpoilerCheckbox />
                    <BroadcastCheckbox />
                </ButtonsWrapper>
                <CardList
                    hasError={live.hasError}
                    isLoading={live.isLoading}
                    isSidebar={true}
                    games={live.games}
                    onClick={this.selectGame}
                    selected={this.state.id}
                />
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live }) => ({
    live,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchGamesIfNeeded,
        dispatchChangeDate,
        fetchLiveGameBoxIfNeeded,
        fetchGameHighlightIfNeeded,
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar))

