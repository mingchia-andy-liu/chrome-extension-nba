import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flatpickr from 'react-flatpickr'
import moment from 'moment-timezone'
import * as actions from '../Popup/actions'
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

        this.state = { date: getAPIDate().toDate() }
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
                    this.props.fetchGames(moment(date[0]).format('YYYYMMDD'))
                    this.props.onChange(moment(date[0]).format('YYYYMMDD'))
                }}
            />
        )
    }
}

DatePicker.propTypes = {
    onChange: PropTypes.func.isRequired,
    dispatchChangeDate: PropTypes.func,
    fetchGames: PropTypes.func,
}

export default connect(null, actions)(DatePicker)
