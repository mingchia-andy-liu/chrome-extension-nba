import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Flatpickr from 'react-flatpickr'
import moment from 'moment-timezone'
import { dispatchChangeDate } from './actions'
import { ThemeConsumer } from '../../components/Context'
import { Theme } from '../../styles'
import { DATE_FORMAT } from '../../utils/constant'
import {noop} from '../../utils/common'
import { resetLiveGameBox } from '../BoxScoresDetails/actions'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`

const inputCSS = css`
    text-align: center;
    font-size: calc(17px + 0.2vw);
    border-radius: 5px;
    border: none;
    width: 100%;
    height: 30px;
    cursor: pointer;

    background-color: ${(props) => (props.dark
        ? Theme.dark.blockBackground
        : Theme.light.blockBackground
    )};

    color: ${(props) => (props.dark
        ? Theme.dark.color
        : Theme.light.color
    )};
`

const StyledFlatpickr = styled(Flatpickr)`
    ${inputCSS}
`

const StyledInput = styled.input`
    ${inputCSS}
`

const Arrow = styled.img`
    width: 30px;
    height: 30px;
    cursor: pointer;
`

class DatePicker extends React.Component {
    static propTypes = {
        date: PropTypes.shape({
            date: PropTypes.object.isRequired,
        }),
        onChange: PropTypes.func,
        hide: PropTypes.bool,
        startDate: PropTypes.string,
        dispatchChangeDate: PropTypes.func.isRequired,
        resetLiveGameBox: PropTypes.func.isRequired,
    }

    static defaultProps = {
        hide: false,
        onChange: noop,
    }

    constructor(props) {
        super(props)

        const {
            date: { date },
            startDate,
        } = this.props

        if (startDate) {
            this.state = { date: moment(startDate, DATE_FORMAT).toDate() }
        } else {
            this.state = { date }
        }
    }

    onClickNextDay = () => {
        this.onClickArrow(1)
    }

    onClickPrevDay = () => {
        this.onClickArrow(-1)
    }

    onClickArrow(offset) {
        const date = moment(this.state.date).add(offset, 'day')
        if (date.isAfter('2019-09-01') || date.isBefore('2018-09-01')) {
            return
        }
        this.props.dispatchChangeDate(date.toDate())
        this.props.onChange(date.format(DATE_FORMAT))
        this.props.resetLiveGameBox()
        this.setState({ date: date.toDate() })
    }

    onDateChange = (date) => {
        const d = moment(date[0])
        const dateObj = d.toDate()
        this.props.dispatchChangeDate(dateObj)
        this.props.onChange(dateObj)
        this.props.resetLiveGameBox()
        this.setState({date: dateObj})
    }

    renderInput() {
        const { date } = this.state
        const { hide } = this.props

        if (hide) {
            return (
                <ThemeConsumer>
                    {({ state: { dark } }) => (
                        <StyledInput
                            dark={dark ? 1 : undefined}
                            readOnly={true}
                            value={moment(date).format('YYYY-MM-DD')}
                        />
                    )}
                </ThemeConsumer>
            )
        }
        return (
            <ThemeConsumer>
                {({ state: { dark } }) => (
                    <StyledFlatpickr
                        // prevent chrome default action to auto-focus
                        tabIndex="-1"
                        autoFocus={false}

                        dark={dark ? 1: undefined}
                        value={date}
                        options={{
                            minDate: '2018-09-01',
                            maxDate: '2019-08-30',
                        }}
                        onChange={this.onDateChange}
                    />
                )}
            </ThemeConsumer>
        )
    }

    render() {
        return (
            <Wrapper>
                <Arrow onClick={this.onClickPrevDay} src="../../assets/png/arrow-left.png" />
                {this.renderInput()}
                <Arrow onClick={this.onClickNextDay} src="../../assets/png/arrow-right.png" />
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ date }) => ({
    date,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchChangeDate,
        resetLiveGameBox,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(DatePicker)
