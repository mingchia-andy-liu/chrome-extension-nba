import * as React from 'react'
import { HideZeroRowCheckbox } from '../../components/Checkbox'
import {
  PlayByPlay,
  Summary,
  PlayerStats,
  TeamStats,
  AdvancedTeamStats,
} from '../../components/Scores'
import TeamInfo from '../../components/TeamInfo'
import MatchInfo from '../../components/MatchInfo'
import { Row } from '../../styles'
import { isWinning } from '../../utils/common'
import {
  HintText,
  Subtitle,
  Title,
  OverviewWrapper,
  TeamLeaderWrapper,
  TeamLeaderContent,
} from './styles'
import TeamLeaderCol from '../../components/Scores/TeamLeaderCol'

export const renderTitle = (bsData) => {
  const { home, visitor, periodTime } = bsData
  const { abbreviation: hta, nickname: htn, score: hs } = home
  const { abbreviation: vta, nickname: vtn, score: vs } = visitor

  return (
    <Title justifyCenter={true} alignCenter={true}>
      <TeamInfo ta={vta} tn={vtn} winning={isWinning(vs, hs)} large={true} />
      <MatchInfo
        home={{
          ...home,
          score: `${home.score}`,
        }}
        visitor={{
          ...visitor,
          score: `${visitor.score}`,
        }}
        periodTime={periodTime}
      />
      <TeamInfo ta={hta} tn={htn} winning={isWinning(hs, vs)} large={true} />
    </Title>
  )
}

export const renderSummary = (bsData, teamStats) => {
  const { officials, home, visitor } = bsData
  const { extra } = teamStats
  return (
    <OverviewWrapper>
      <h3>Summary</h3>
      <Summary home={home} visitor={visitor} extra={extra} />
      <br />
      <Row>
        <Subtitle>OFFICIALS: </Subtitle>
        {officials.map(({ person_id, first_name, last_name }, i) => (
          <Subtitle key={person_id}>
            {first_name} {last_name}
            {i !== officials.length - 1 && ','}
          </Subtitle>
        ))}
      </Row>
    </OverviewWrapper>
  )
}

export const renderTeamStats = (bsData) => {
  const {
    home: { abbreviation: hta, stats: hts },
    visitor: { abbreviation: vta, stats: vts },
  } = bsData
  return <TeamStats hta={hta} hts={hts || {}} vta={vta} vts={vts || {}} />
}

export const renderAdvancedTeamStats = (teamStats, bsData) => {
  const { home, visitor } = teamStats

  const {
    home: { abbreviation: hta },
    visitor: { abbreviation: vta },
  } = bsData

  return <AdvancedTeamStats home={home} hta={hta} visitor={visitor} vta={vta} />
}

export const renderPlayerStats = (bsData) => {
  const {
    home: {
      abbreviation: hta,
      players: { player: homePlayers },
    },
    visitor: {
      abbreviation: vta,
      players: { player: visitorPlayers },
    },
    periodTime: { gameStatus },
  } = bsData

  return (
    <PlayerStats
      hta={hta}
      hps={homePlayers || []}
      vta={vta}
      vps={visitorPlayers || []}
      isLive={gameStatus === '2'}
    />
  )
}

export const renderPlaybyPlay = (pbpData) => {
  return <PlayByPlay pbp={pbpData} />
}

export const renderHints = (dark) => {
  return (
    <Row style={{ paddingBottom: '3px' }}>
      <HideZeroRowCheckbox />
      {HintText(dark, 'd', 'Double Doubles')}
      {HintText(dark, 't', 'Triple Doubles')}
    </Row>
  )
}

const getMostOfField = (players, field) => {
  const max = Math.max.apply(
    null,
    players.map((p) => p[field])
  )
  if (max < 5) {
    return []
  }
  return players
    .filter((p) => p[field] === max)
    .map((p) => {
      return {
        name: p.first_name + ' ' + p.last_name,
        value: max,
      }
    })
}

export const renderTeamLeader = (bsData) => {
  const {
    home: {
      abbreviation: hta,
      players: { player: homePlayers },
    },
    visitor: {
      abbreviation: vta,
      players: { player: visitorPlayers },
    },
  } = bsData

  const hps = (homePlayers || []).map((p) => ({
    ...p,
    rebounds: p.rebounds_offensive + p.rebounds_defensive,
  }))
  const vps = (visitorPlayers || []).map((p) => ({
    ...p,
    rebounds: p.rebounds_offensive + p.rebounds_defensive,
  }))
  return (
    <TeamLeaderWrapper>
      <h3>Team Leader</h3>
      <TeamLeaderContent>
        <TeamLeaderCol
          name={vta}
          points={getMostOfField(vps, 'points')}
          rebounds={getMostOfField(vps, 'rebounds')}
          assists={getMostOfField(vps, 'assists')}
        />
        <TeamLeaderCol
          name={hta}
          points={getMostOfField(hps, 'points')}
          rebounds={getMostOfField(hps, 'rebounds')}
          assists={getMostOfField(hps, 'assists')}
        />
      </TeamLeaderContent>
    </TeamLeaderWrapper>
  )
}
