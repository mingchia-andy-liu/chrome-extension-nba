import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flatpickr from 'react-flatpickr'
import moment from 'moment-timezone'
import { fetchGames } from '../Popup/actions'
import { dispatchChangeDate } from './actions'
import getAPIDate from '../../utils/getApiDate'


const StyledFlatpickr = styled(Flatpickr)`
    text-align: center;
    font-size: calc(17px + 0.2vw);
    background-color: #f9f9f9;
    border-radius: 5px;
    border: none;
    width: 100%;
    margin: 10px 0;
`

class DatePicker extends React.Component {
    constructor(props) {
        super(props)

        const {
            date: {
                date,
                isDirty,
            },
        } = this.props

        this.state = {
            date: isDirty ? date : getAPIDate().toDate(),
        }
    }

    render() {
        const { date } = this.state
        return (
            <StyledFlatpickr
                value={date}
                options={{
                    minDate: '2017-01-01',
                    maxDate: '2018-08-30',
                }}
                onChange={date => {
                    const dateStr = moment(date[0]).format('YYYYMMDD')
                    this.props.fetchGames(dateStr)
                    this.props.onChange(dateStr)
                    this.props.dispatchChangeDate(moment(date[0]).toDate())
                }}
            />
        )
    }
}

DatePicker.propTypes = {
    date: PropTypes.shape({
        date: PropTypes.object.isRequired,
        isDirty: PropTypes.bool.isRequired,
    }),
    onChange: PropTypes.func.isRequired,
    dispatchChangeDate: PropTypes.func,
    fetchGames: PropTypes.func,
}

const mapStateToProps = ({ date }) => ({
    date,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchChangeDate,
        fetchGames,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(DatePicker)
