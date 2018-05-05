import React from 'react'
import { connect } from 'react-redux'
import Flatpickr from 'react-flatpickr'
import moment from 'moment-timezone'
import * as actions from '../Popup/actions'


class DatePicker extends React.Component {
    render() {
        return (
            <Flatpickr
                value={new Date()}
                options={{
                    minDate: '2017-01-01',
                    maxDate: '2018-08-30',
                }}
                onChange={date => {
                    this.props.fetchGames(moment(date[0]).format('YYYYMMDD'))
                }}
            />
        )
    }
}


export default connect(null, actions)(DatePicker)
