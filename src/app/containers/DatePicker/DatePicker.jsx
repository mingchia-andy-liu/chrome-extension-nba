import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Flatpickr from 'react-flatpickr'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import { dispatchChangeDate } from './actions'
import { ThemeConsumer } from '../../components/Context'
import { Theme } from '../../styles'
import { DATE_FORMAT } from '../../utils/constant'
import { noop } from '../../utils/common'
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

  background-color: ${(props) =>
    props.dark ? Theme.dark.blockBackground : Theme.light.blockBackground};

  color: ${(props) => (props.dark ? Theme.dark.color : Theme.light.color)};
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

// https://www.nba.com/key-dates
const MIN_DATE = new Date('2019-09-02')
const MAX_DATE = new Date('2021-01-01')

const DatePicker = (
  { hide, onChange, dispatchChangeDate, resetLiveGameBox, date: { date } } = {
    hide: false,
    onChange: noop,
  }
) => {
  const onClickArrow = React.useCallback(
    (offset) => {
      const currDate = addDays(date, offset)
      if (isAfter(currDate, MAX_DATE) || isBefore(currDate, MIN_DATE)) {
        return
      }
      dispatchChangeDate(currDate)
      onChange(format(currDate, DATE_FORMAT))
      resetLiveGameBox()
    },
    [date, dispatchChangeDate, onChange, resetLiveGameBox]
  )

  const onClickNextDay = React.useCallback(() => {
    onClickArrow(1)
  }, [onClickArrow])

  const onClickPrevDay = React.useCallback(() => {
    onClickArrow(-1)
  }, [onClickArrow])

  const onDateChange = React.useCallback(
    (dates) => {
      dispatchChangeDate(dates[0])
      onChange(dates[0])
      resetLiveGameBox()
    },
    [dispatchChangeDate, onChange, resetLiveGameBox]
  )

  const renderInput = () => {
    if (hide) {
      return (
        <ThemeConsumer>
          {({ state: { dark } }) => (
            <StyledInput
              dark={dark ? 1 : undefined}
              readOnly={true}
              value={format(date, 'yyyy-MM-dd')}
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
            dark={dark ? 1 : undefined}
            value={format(date, 'yyyy-MM-dd')}
            options={{
              minDate: MIN_DATE,
              maxDate: MAX_DATE,
            }}
            onChange={onDateChange}
          />
        )}
      </ThemeConsumer>
    )
  }

  return (
    <Wrapper>
      <Arrow onClick={onClickPrevDay} src="../../assets/png/arrow-left.png" />
      {renderInput()}
      <Arrow onClick={onClickNextDay} src="../../assets/png/arrow-right.png" />
    </Wrapper>
  )
}

DatePicker.propTypes = {
  date: PropTypes.shape({
    date: PropTypes.object.isRequired,
  }),
  onChange: PropTypes.func,
  hide: PropTypes.bool,
  dispatchChangeDate: PropTypes.func.isRequired,
  resetLiveGameBox: PropTypes.func.isRequired,
}

const mapStateToProps = ({ date }) => ({
  date,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      dispatchChangeDate,
      resetLiveGameBox,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker)
