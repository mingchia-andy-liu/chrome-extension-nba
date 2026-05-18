import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  getTeamNameById,
  getLogoColorById,
  getNickNamesByTriCode,
  getAbbreviationById,
} from '../utils/teams'
import { mediaQuery } from '../styles'
import TeamLogo from './TeamLogo'

const StyledSerieColumn = styled.div`
  width: 15%;
  text-align: center;
`

const StyledSerie = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
  height: auto;
  min-height: 120px;
  font-size: calc(18px + 0.1vw);
  border-radius: 4px;
  border: ${(props) => (props.live ? '2px solid red' : 'none')};
  color: var(--color);
  background-color: transparent;
  overflow: visible;

  ${mediaQuery`
        font-size: calc(12px);
    `}

  /* Horizontal connector line */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40px;
    height: 2px;
    background-color: var(--color);
    opacity: 0.5;
    display: ${(props) => (props.side === 'center' ? 'none' : 'block')};
    ${(props) => (props.side === 'left' ? 'right: -40px;' : 'left: -40px;')}
  }

  /* Vertical connector line (the elbow) */
  &::before {
    content: '';
    position: absolute;
    width: 2px;
    background-color: var(--color);
    opacity: 0.5;
    display: ${(props) =>
      props.side === 'center' || props.roundNum >= 3 ? 'none' : 'block'};
    ${(props) => (props.side === 'left' ? 'right: -40px;' : 'left: -40px;')}

    ${(props) => {
      if (props.index % 2 === 0) {
        // Top of a pair - line goes down
        return 'height: calc(100% + 30px); top: 50%;'
      } else {
        // Bottom of a pair - line goes up
        return 'height: calc(100% + 30px); bottom: 50%;'
      }
    }}
  }
`

const StyledSummary = styled.div`
  background-color: #000;
  color: #fff;
  width: 100%;
  padding: 8px 0;
  font-weight: bold;
`

const StyledSerieTeamRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  min-height: 50px;
  width: 100%;
  flex: 1;
  opacity: ${(props) => (props.winning ? '1' : '0.4')};
  background-color: ${(props) => (props.color ? props.color : 'transparent')};
  color: ${(props) =>
    props.color
      ? 'white'
      : 'var(--color)'}; /* Keep text white on team colors */
  ${mediaQuery`
        flex-direction: column;
        padding: 8px 0;
    `}
`

const StyledSeries = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 90%;
  min-height: 600px;
`

const SerieTeamRow = ({ teamId, seedNum, wins, isWinning }) => {
  const teamName = getNickNamesByTriCode(getTeamNameById(teamId))
  const displayTeamName = teamId === 0 ? 'TBD' : teamName

  return (
    <StyledSerieTeamRow winning={isWinning} color={getLogoColorById(teamId)}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.5rem',
          paddingLeft: '10px',
        }}
      >
        <span style={{ whiteSpace: 'nowrap' }}>{displayTeamName}</span>
        {teamId && seedNum ? `(${seedNum})` : ''}
      </div>
      <div style={{ paddingRight: '10px', fontWeight: 'bold' }}>{wins}</div>
    </StyledSerieTeamRow>
  )
}

SerieTeamRow.propTypes = {
  teamId: PropTypes.string.isRequired,
  seedNum: PropTypes.string.isRequired,
  wins: PropTypes.string.isRequired,
  isSeriesWinner: PropTypes.bool.isRequired,
  isWinning: PropTypes.bool.isRequired,
}

const renderSerie = ({
  isGameLive,
  seriesId,
  topRow,
  bottomRow,
  summaryStatusText,
  gameNumber,
  isSeriesCompleted,
  index,
  side,
  roundNum,
}) => (
  <StyledSerie
    live={isGameLive}
    key={seriesId}
    index={index}
    side={side}
    roundNum={roundNum}
  >
    {SerieTeamRow({ ...topRow, isWinning: topRow.wins >= bottomRow.wins })}
    {SerieTeamRow({ ...bottomRow, isWinning: topRow.wins <= bottomRow.wins })}
    {summaryStatusText && <StyledSummary>{summaryStatusText}</StyledSummary>}
  </StyledSerie>
)

renderSerie.propTypes = {
  isGameLive: PropTypes.bool.isRequired,
  seriesId: PropTypes.string.isRequired,
  topRow: PropTypes.object.isRequired,
  bottomRow: PropTypes.object.isRequired,
  summaryStatusText: PropTypes.string,
  gameNumber: PropTypes.string,
  isSeriesCompleted: PropTypes.bool,
  index: PropTypes.number,
  side: PropTypes.string,
  roundNum: PropTypes.number,
}

const roundIndices = {
  1: {
    1: 0,
    2: 3,
    3: 2,
    4: 1,
    5: 1,
    6: 2,
    7: 3,
    8: 0,
  },
  2: {
    1: 0,
    2: 1,
    3: 1,
    4: 0,
    5: 0,
    6: 1,
    7: 1,
    8: 0,
  },
  3: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  },
  4: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  },
}

const PlayoffColumn = ({ title, series, side }) => {
  const ordered = [...series]
  series.forEach((serie) => {
    if (serie.topRow.seedNum != null || serie.bottomRow.seedNum != null) {
      const indices = roundIndices[serie.roundNum]
      const seed = serie.topRow.seedNum || serie.bottomRow.seedNum
      ordered[indices[seed]] = serie
    }
  })
  return (
    <StyledSerieColumn>
      <h3>{title}</h3>
      <StyledSeries>
        {ordered.map((serie, index) =>
          renderSerie({ ...serie, index, side, roundNum: serie.roundNum })
        )}
      </StyledSeries>
    </StyledSerieColumn>
  )
}

PlayoffColumn.propTypes = {
  title: PropTypes.string.isRequired,
  series: PropTypes.any,
  side: PropTypes.string,
}

PlayoffColumn.defaultProps = {
  series: [],
  side: 'left',
}

export default PlayoffColumn
