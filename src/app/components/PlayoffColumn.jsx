import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getTeamNameById, getLogoColorById } from '../utils/teams'
import { mediaQuery } from '../styles'

const StyledSerieColumn = styled.div`
  width: 15%;
  text-align: center;
`

const StyledSerie = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  height: 18vh;
  min-height: 100px;
  font-size: calc(18px + 0.1vw);
  border-radius: 5px;
  border: ${(props) =>
    props.live ? '2px solid red' : '2px solid transparent'};
  color: white;

  ${mediaQuery`
        font-size: calc(12px);
    `}
`

const StyledSerieTeamRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  min-height: 50px;
  width: 100%;
  height: 50%;
  opacity: ${(props) => (props.winning ? '1' : '0.3')};
  background-color: ${(props) => (props.color ? props.color : '')};
  ${mediaQuery`
        flex-direction: column;
    `}
`

const StyledSeries = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 90%;
`

const SerieTeamRow = ({ teamId, seedNum, wins, isWinning }) => (
  <StyledSerieTeamRow winning={isWinning} color={getLogoColorById(teamId)}>
    <div>
      {getTeamNameById(teamId)}
      {seedNum ? `(${seedNum})` : ''}
    </div>
    <div>{wins}</div>
  </StyledSerieTeamRow>
)

SerieTeamRow.propTypes = {
  teamId: PropTypes.string.isRequired,
  seedNum: PropTypes.string.isRequired,
  wins: PropTypes.string.isRequired,
  isSeriesWinner: PropTypes.bool.isRequired,
  isWinning: PropTypes.bool.isRequired,
}

const renderSerie = ({ isGameLive, seriesId, topRow, bottomRow }) => (
  <StyledSerie live={isGameLive} key={seriesId}>
    {SerieTeamRow({ ...topRow, isWinning: topRow.wins >= bottomRow.wins })}
    {SerieTeamRow({ ...bottomRow, isWinning: topRow.wins <= bottomRow.wins })}
  </StyledSerie>
)

renderSerie.propTypes = {
  isGameLive: PropTypes.bool.isRequired,
  seriesId: PropTypes.string.isRequired,
  topRow: PropTypes.object.isRequired,
  bottomRow: PropTypes.object.isRequired,
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

const PlayoffColumn = ({ title, series }) => {
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
      <StyledSeries>{ordered.map((serie) => renderSerie(serie))}</StyledSeries>
    </StyledSerieColumn>
  )
}

PlayoffColumn.propTypes = {
  title: PropTypes.string.isRequired,
  series: PropTypes.any,
}

PlayoffColumn.defaultProps = {
  series: [],
}

export default PlayoffColumn
