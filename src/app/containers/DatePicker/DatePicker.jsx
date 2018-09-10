import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Flatpickr from 'react-flatpickr'
import moment from 'moment-timezone'
import { fetchGames } from '../Popup/actions'
import { dispatchChangeDate } from './actions'
import { SettingsConsumer } from '../../components/Context'
import { Theme } from '../../styles'


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
    height: calc(20px + 2vh);
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
    height: calc(20px + 2vh);
    cursor: pointer;
`

class DatePicker extends React.Component {
    constructor(props) {
        super(props)

        const {
            date: { date },
        } = this.props

        this.state = { date }
    }

    onClickArrow(offset) {
        const date = moment(this.state.date).add(offset, 'day')
        this.props.fetchGames(date.format('YYYYMMDD'))
        this.props.onChange(date.format('YYYYMMDD'))
        this.props.dispatchChangeDate(date.toDate())
        this.setState({ date: date.toDate() })
    }

    renderInput() {
        const { date } = this.state
        const { hide } = this.props

        if (hide) {
            return (
                <SettingsConsumer>
                    {({ state: { dark } }) => (
                        <StyledInput
                            dark={dark ? 1 : 0}
                            readOnly={true}
                            value={moment(date).format('YYYY-MM-DD')}
                        />
                    )}
                </SettingsConsumer>
            )
        }
        return (
            <SettingsConsumer>
                {({ state: { dark } }) => (
                    <StyledFlatpickr
                        // prevent chrome default action to auto-focus
                        tabIndex="-1"
                        autoFocus={false}

                        dark={dark ? 1 : 0}
                        value={date}
                        options={{
                            minDate: '2017-01-01',
                            maxDate: '2019-08-30',
                        }}
                        onChange={date => {
                            const d = moment(date[0])
                            const dateStr = d.format('YYYYMMDD')
                            this.props.fetchGames(dateStr)
                            this.props.onChange(dateStr)
                            this.props.dispatchChangeDate(d.toDate())
                            this.setState({date: d.toDate()})
                        }}
                    />
                )}
            </SettingsConsumer>
        )
    }

    render() {
        return (
            <Wrapper>
                <Arrow onClick={this.onClickArrow.bind(this, -1)} src="../../assets/png/arrow-left.png" />
                {this.renderInput()}
                <Arrow onClick={this.onClickArrow.bind(this, 1)} src="../../assets/png/arrow-right.png" />
            </Wrapper>
        )
    }
}

DatePicker.propTypes = {
    date: PropTypes.shape({
        date: PropTypes.object.isRequired,
    }),
    onChange: PropTypes.func.isRequired,
    dispatchChangeDate: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    hide: PropTypes.bool,
}

DatePicker.defaultProps = {
    hide: false,
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
