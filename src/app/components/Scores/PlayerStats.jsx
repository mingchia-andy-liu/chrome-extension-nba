import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Cell,
  HeaderCell,
  Row,
  rowBGColor,
  RowHeaderCell,
  RowWrapper,
  StatsCell,
  Sup,
  Table,
} from '../../utils/format'
import {
  formatMinutes,
  getDoublesText,
  getOddRowColor,
  hasDoubles,
  toPercentage,
} from '../../utils/common'
import { BoxScoreConsumer, ThemeConsumer } from '../Context'

const Wrapper = styled.div`
  width: 100%;
`

const PlayerTable = styled(Table)`
  margin-bottom: 16px;
`

const OnCourt = styled.img`
  width: 20px;
  height: 20px;
`

const PlayerName = styled(Cell)`
  display: flex !important;
  flex-direction: row;
  text-align: left;
  align-items: center;
  border-right: ${(props) =>
    props.spacer ? 'none' : '1px solid hsl(0, 0%, 95%)'};
  width: 10vw;
  min-width: 120px;
  overflow-y: hidden;
  padding-left: 5px;
`

const RowWrapperWithFavorite = styled(RowWrapper)`
  position: relative;

  &::before {
    ${(props) =>
      props.fav &&
      `
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            border-top-left-radius: 3px;
            border-top: 10px solid gold;
            border-left: 5px solid gold;
            border-right: 10px solid transparent;
            border-bottom: 5px solid transparent;
        `}
  }
`

const renderHeaderRow = (name) => {
  const headers = [
    'MIN',
    'PTS',
    'FGM-A',
    'FG%',
    '3PM-A',
    '3P%',
    'FTM-A',
    'FT%',
    'OREB',
    'DREB',
    'REB',
    'AST',
    'STL',
    'BLK',
    'TOV',
    'PF',
    '+/-',
    'FPS',
  ]

  return (
    <RowWrapper>
      <RowHeaderCell>{name}</RowHeaderCell>
      {headers.map((element) => (
        <HeaderCell key={`stats-${element}-${name}`}>{element}</HeaderCell>
      ))}
    </RowWrapper>
  )
}

const renderTeamStatsHeaderRow = (name) => {
  const headers = [
    'PTS',
    'FGM-A',
    'FG%',
    '3PM-A',
    '3P%',
    'FTM-A',
    'FT%',
    'OREB',
    'DREB',
    'REB/TREB',
    'AST',
    'STL',
    'BLK',
    'TOV',
    'PF/TF',
  ]

  return (
    <Row>
      <PlayerName spacer />
      <HeaderCell>{'MIN'}</HeaderCell>
      {headers.map((element) => (
        <HeaderCell key={`team-stats-${element}-${name}`}>{element}</HeaderCell>
      ))}
      <Cell />
    </Row>
  )
}

const renderTeamStatsRow = (team, isDark, players) => {
  const totalMinutes = players.reduce(
    (acc, p) => acc + (+p.minutes || 0) + (+p.seconds || 0) / 60,
    0
  )
  return (
    <Row>
      <PlayerName spacer />
      <Cell>{Math.round(totalMinutes)}</Cell>
      <StatsCell dark={isDark ? 1 : undefined}>{team.points}</StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={team.field_goals_percentage >= 50 ? 1 : undefined}
        losing={team.field_goals_percentage <= 30 ? 1 : undefined}
      >{`${team.field_goals_made}-${team.field_goals_attempted}`}</StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={team.field_goals_percentage >= 50 ? 1 : undefined}
        losing={team.field_goals_percentage <= 30 ? 1 : undefined}
      >
        {team.field_goals_percentage}%
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={team.three_pointers_percentage >= 50 ? 1 : undefined}
        losing={team.three_pointers_percentage <= 30 ? 1 : undefined}
      >{`${team.three_pointers_made}-${team.three_pointers_attempted}`}</StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={team.three_pointers_percentage >= 50 ? 1 : undefined}
        losing={team.three_pointers_percentage <= 30 ? 1 : undefined}
      >
        {team.three_pointers_percentage}%
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={team.free_throws_percentage >= 90 ? 1 : undefined}
        losing={team.free_throws_percentage <= 60 ? 1 : undefined}
      >{`${team.free_throws_made}-${team.free_throws_attempted}`}</StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={team.free_throws_percentage >= 90 ? 1 : undefined}
        losing={team.free_throws_percentage <= 60 ? 1 : undefined}
      >
        {team.free_throws_percentage}%
      </StatsCell>
      <Cell>{team.rebounds_offensive}</Cell>
      <Cell>{team.rebounds_defensive}</Cell>
      <Cell>
        {team.rebounds_defensive + team.rebounds_offensive}
        {team.team_rebounds > 0 && ` (${team.team_rebounds})`}
      </Cell>
      <Cell>{team.assists}</Cell>
      <Cell>{team.steals}</Cell>
      <Cell>{team.blocks}</Cell>
      <Cell>{team.turnovers}</Cell>
      <Cell>
        {team.fouls}
        {team.team_fouls > 0 && ` (${team.team_fouls})`}
      </Cell>
      <Cell />
    </Row>
  )
}

const renderTeamStats = (team, name, isDark, players) => {
  if (Object.keys(team).length === 0) {
    return null
  }

  return (
    <React.Fragment>
      {renderTeamStatsHeaderRow(name)}
      {renderTeamStatsRow(team, isDark, players)}
    </React.Fragment>
  )
}

/**
 * Migrate from `formatBoxScoreData()`
 * @param {*} player
 * @param {*} isLive
 */
const renderPlayerRow = (
  player,
  isLive,
  i,
  isDark,
  { hideZeroRow, favPlayers }
) => {
  if (
    !player.on_court &&
    hideZeroRow &&
    player.minutes == '0' &&
    player.seconds == '0'
  ) {
    return
  }

  const fn =
    player && player.first_name.trim() ? player.first_name.charAt(0) + '.' : ''
  const ln = player.last_name
  const name = player.last_name !== '' ? `${fn} ${ln}` : player.first_name
  const doubles = hasDoubles(player)

  const {
    starting_position,
    on_court,
    points,
    fantasy_points,
    field_goals_made,
    field_goals_attempted,
    three_pointers_made,
    three_pointers_attempted,
    free_throws_made,
    free_throws_attempted,
    rebounds_offensive,
    rebounds_defensive,
    assists,
    blocks,
    steals,
    turnovers,
    fouls,
    plus_minus,
    personId,
  } = player

  const fgp = toPercentage(+field_goals_made / +field_goals_attempted)
  const tpp = toPercentage(+three_pointers_made / +three_pointers_attempted)
  const ftp = toPercentage(+free_throws_made / +free_throws_attempted)
  const isFav = favPlayers.find((p) => p.PERSON_ID === personId)

  return (
    <RowWrapperWithFavorite
      key={name + i}
      style={{
        backgroundColor: doubles
          ? rowBGColor(doubles, isDark)
          : getOddRowColor(i, isDark),
      }}
      title={doubles && getDoublesText(doubles)}
      dark={isDark}
      fav={isFav}
    >
      <PlayerName>
        {name}
        {starting_position && <Sup>{starting_position}</Sup>}
        {isLive && on_court === 1 && (
          <OnCourt src="assets/png/icon-color-128.png" />
        )}
      </PlayerName>
      <Cell>{formatMinutes(player)}</Cell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+points >= 10 ? 1 : undefined}
      >
        {points}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+fgp >= 60 && +field_goals_attempted >= 5 ? 1 : undefined}
        losing={+fgp <= 30 && +field_goals_attempted >= 5 ? 1 : undefined}
      >
        {`${field_goals_made}-${field_goals_attempted}`}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+fgp >= 60 && +field_goals_attempted >= 5 ? 1 : undefined}
        losing={+fgp <= 30 && +field_goals_attempted >= 5 ? 1 : undefined}
      >
        {fgp}
        {fgp !== '-' && '%'}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+tpp >= 60 && +three_pointers_attempted >= 5 ? 1 : undefined}
        losing={+tpp <= 30 && +three_pointers_attempted >= 5 ? 1 : undefined}
      >
        {`${three_pointers_made}-${three_pointers_attempted}`}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+tpp >= 60 && +three_pointers_attempted >= 5 ? 1 : undefined}
        losing={+tpp <= 30 && +three_pointers_attempted >= 5 ? 1 : undefined}
      >
        {tpp}
        {tpp !== '-' && '%'}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+ftp >= 90 && +free_throws_attempted >= 5 ? 1 : undefined}
        losing={+ftp <= 60 && +free_throws_attempted >= 5 ? 1 : undefined}
      >
        {`${free_throws_made}-${free_throws_attempted}`}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+ftp >= 90 && +free_throws_attempted >= 5 ? 1 : undefined}
        losing={+ftp <= 60 && +free_throws_attempted >= 5 ? 1 : undefined}
      >
        {ftp}
        {ftp !== '-' && '%'}
      </StatsCell>
      <Cell>{rebounds_offensive}</Cell>
      <Cell>{rebounds_defensive}</Cell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={
          +rebounds_offensive + +rebounds_defensive >= 10 ? 1 : undefined
        }
      >
        {+rebounds_offensive + +rebounds_defensive}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+assists >= 5 ? 1 : undefined}
      >
        {assists}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+steals >= 5 ? 1 : undefined}
      >
        {steals}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+blocks >= 5 ? 1 : undefined}
      >
        {blocks}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        losing={+turnovers >= 5 ? 1 : undefined}
      >
        {turnovers}
      </StatsCell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        losing={+fouls === 6 ? 1 : undefined}
      >
        {fouls}
      </StatsCell>
      <Cell>{plus_minus}</Cell>
      <StatsCell
        dark={isDark ? 1 : undefined}
        winning={+fantasy_points >= 40 ? 1 : undefined}
        losing={+fantasy_points < 0 ? 1 : undefined}
      >
        {fantasy_points}
      </StatsCell>
    </RowWrapperWithFavorite>
  )
}

const PlayerStats = ({ hps, vps, hta, vta, hts, vts, isLive }) => {
  if (hps.length === 0 || vps.length === 0) {
    return <Wrapper>No Player Data Available</Wrapper>
  }

  return (
    <Wrapper>
      <ThemeConsumer>
        {({ state: { dark } }) => (
          <BoxScoreConsumer>
            {({ state: { hideZeroRow, favPlayers } }) => (
              <React.Fragment>
                <PlayerTable>
                  <tbody>
                    {renderHeaderRow(vta)}
                    {vps.map((player, i) =>
                      renderPlayerRow(player, isLive, i, dark, {
                        hideZeroRow,
                        favPlayers,
                      })
                    )}
                    {renderTeamStats(vts, vta, dark, vps)}
                  </tbody>
                </PlayerTable>
                <PlayerTable>
                  <tbody>
                    {renderHeaderRow(hta)}
                    {hps.map((player, i) =>
                      renderPlayerRow(player, isLive, i, dark, {
                        hideZeroRow,
                        favPlayers,
                      })
                    )}
                    {renderTeamStats(hts, hta, dark, hps)}
                  </tbody>
                </PlayerTable>
              </React.Fragment>
            )}
          </BoxScoreConsumer>
        )}
      </ThemeConsumer>
    </Wrapper>
  )
}

PlayerStats.propTypes = {
  hps: PropTypes.array.isRequired,
  vps: PropTypes.array.isRequired,
  hta: PropTypes.string.isRequired,
  vta: PropTypes.string.isRequired,
  hts: PropTypes.object,
  vts: PropTypes.object,
  isLive: PropTypes.bool,
}

PlayerStats.defaultProps = {
  hts: {},
  vts: {},
  isLive: false,
}

export default PlayerStats
