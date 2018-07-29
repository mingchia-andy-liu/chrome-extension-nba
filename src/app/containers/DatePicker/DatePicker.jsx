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


const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`

const StyledFlatpickr = styled(Flatpickr)`
    text-align: center;
    font-size: calc(17px + 0.2vw);
    background-color: #f9f9f9;
    border-radius: 5px;
    border: none;
    width: 100%;
    height: calc(20px + 2vh);
`

const Arrow = styled.img`
    height: calc(20px + 2vh);
    cursor: pointer;
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

    onClickArrow(offset) {
        const date = moment(this.state.date).add(offset, 'day')
        this.props.fetchGames(date.format('YYYYMMDD'))
        this.props.onChange(date.format('YYYYMMDD'))
        this.props.dispatchChangeDate(date.toDate())
        this.setState({ date: date.toDate() })
    }

    render() {
        const { date } = this.state
        return (
            <Wrapper>
                <Arrow onClick={this.onClickArrow.bind(this, -1)} src="../../assets/png/arrow-left.png" />
                <StyledFlatpickr
                    // prevent chrome default action to auto-focus
                    tabIndex="-1"
                    autoFocus={false}

                    value={date}
                    options={{
                        minDate: '2017-01-01',
                        maxDate: '2019-08-30',
                    }}
                    onChange={date => {
                        const dateStr = moment(date[0]).format('YYYYMMDD')
                        this.props.fetchGames(dateStr)
                        this.props.onChange(dateStr)
                        this.props.dispatchChangeDate(moment(date[0]).toDate())
                    }}
                />
                <Arrow onClick={this.onClickArrow.bind(this, 1)} src="../../assets/png/arrow-right.png" />
            </Wrapper>
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
