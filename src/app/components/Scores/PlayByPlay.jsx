import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ThemeConsumer } from '../Context'
import { Cell, HeaderCell, Table, Row } from '../../utils/format'
import { getOddRowColor } from '../../utils/common'
import { QUARTER_NAMES } from '../../utils/constant'
import { RowCSS } from '../../styles'
import { getLogoColorByName } from '../../utils/teams'

const Wrapper = styled.div`
  width: 100%;
`

const Title = styled.div`
  ${RowCSS}
  padding: 5px 0;
`

const Hint = styled.div`
  padding: 0 5px;
  color: white;
  background-color: ${(props) => props.backgroundColor};

  &:not(:first-child) {
    margin: 0 5px;
  }
`

const QtrBtn = styled.a`
  padding: 0 10px;
  cursor: pointer;
  ${(props) => props.selected && 'background-color: #046fdb; color: white;'}
`

const ScoreCell = styled(Cell)`
  background-color: ${(props) =>
    (props.changes && '#1b5e20') || (props.tied && '#7c4dff')};
  color: ${(props) => (props.changes || props.tied) && 'white'};
`

const renderHeaderRow = () => (
  <Row>
    <HeaderCell style={{ padding: '0 3vw' }}>{'Clock'}</HeaderCell>
    <HeaderCell style={{ padding: '0 3vw' }}>{'Team'}</HeaderCell>
    <HeaderCell style={{ padding: '0 3vw' }}>{'Score'}</HeaderCell>
    <HeaderCell style={{ width: '100%' }}>{'Play'}</HeaderCell>
  </Row>
)

const renderPBPRow = (plays, period, isDark) => {
  if (plays && plays.length === 0) {
    return (
      <Row>
        {' '}
        <Cell> No Data Avaiable </Cell>{' '}
      </Row>
    )
  }
  const filtered = plays.filter((play) => +play.period === period).reverse()

  return filtered.map((play, i) => {
    const {
      clock: _clock,
      teamTricode: team_abr,
      scoreHome: home_score,
      scoreAway: visitor_score,
      changes,
      description: _description,
      isFieldGoal
    } = play
    const color = getLogoColorByName(team_abr, null)
    const LOGO = color == null 
      ? <Cell />
      : <Cell style={{ color: 'white', backgroundColor: color }}>
      {team_abr}
    </Cell>

    const SCORE =
      isFieldGoal && !_description.includes('MISS') ? (
        <ScoreCell
          changes={changes ? 1 : undefined}
          tied={home_score === visitor_score ? 1 : undefined}
        >
          {visitor_score} : {home_score}
        </ScoreCell>
      ) : (
        <Cell></Cell>
      )

    const description = _description;
    let clock = _clock.substring(2).replace('M', ':').replace('S', '');
    if (clock.endsWith('.00')) {
      clock = clock.substring(0, clock.length - 3);
    }

    return (
      <Row
        key={`pbp-${period}-${i}`}
        style={{ backgroundColor: getOddRowColor(i, isDark) }}
      >
        <Cell> {clock} </Cell>
        {LOGO}
        {SCORE}
        <Cell style={{ textAlign: 'left' }}> {description} </Cell>
      </Row>
    )
  })
}

const PlayByPlay = ({ pbp: { play } }) => {
  const numberOfQuarters =
    play && play.length !== 0 ? +play[play.length - 1].period : -1
  const [currentQuarter, togglerCurrentQuarter] =
    React.useState(numberOfQuarters)

  const renderQuarters = React.useCallback(() => {
    const Btns = []
    for (let i = 0; i < numberOfQuarters; i++) {
      Btns.push(
        <QtrBtn
          key={`qtr-${i}`}
          selected={i + 1 === currentQuarter}
          onClick={() => {
            togglerCurrentQuarter(i + 1)
          }}
        >
          {QUARTER_NAMES[i]}
        </QtrBtn>
      )
    }

    return <Title> {Btns} </Title>
  }, [togglerCurrentQuarter, numberOfQuarters, currentQuarter])

  return (
    <Wrapper>
      {renderQuarters()}
      <Title>
        <Hint backgroundColor={'#1b5e20'}>Lead Changes</Hint>
        <Hint backgroundColor={'#7c4dff'}>Tied</Hint>
      </Title>
      <ThemeConsumer>
        {({ state: { dark } }) => (
          <Table>
            <tbody>
              {renderHeaderRow()}
              {renderPBPRow(play, currentQuarter, dark)}
            </tbody>
          </Table>
        )}
      </ThemeConsumer>
    </Wrapper>
  )
}

PlayByPlay.propTypes = {
  pbp: PropTypes.shape({
    play: PropTypes.array.isRequired,
  }).isRequired,
}

export default PlayByPlay
