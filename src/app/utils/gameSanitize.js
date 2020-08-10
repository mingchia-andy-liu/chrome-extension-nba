import { utcToZonedTime } from 'date-fns-tz'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import { getUserTimeZoneId } from './time'
import { convertDaily, convertDaily2 } from './convert'
import getApiDate from './getApiDate'

// for http://data.nba.net/prod/v2/${dateStr}/scoreboard.json
const sanitizeGameFallBack2 = (game) => ({
  // gives home, visitor
  ...convertDaily2(game),
  id: game.gameId,
  date: game.startDateEastern,
  time: game.startTimeEastern,
  state: '',
  arena: {
    name: game.arena.name,
    city: game.arena.city,
  },
  playoffs: game.playoffs,
  startTimeUtc: game.startTimeUTC,
})

// https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2019/scores/00_todays_scores.json
const sanitizeGameFallBack = (game) => ({
  // gives home, visitor, periodTime,
  ...convertDaily(game),
  id: game.gid,
  date: game.gcode.split('/')[0] || '1970-01-01',
  time: '',
  state: game.st,
  arena: { name: '', city: '' },
  broadcasters: [],
  playoffs: game.playoffs,
})

const getBroadcasters = (casters) => {
  if (casters && casters.tv && casters.tv.broadcaster) {
    return casters.tv.broadcaster
  } else {
    return []
  }
}

const sanitizeGame = (game) => ({
  id: game.id,
  date: game.date,
  time: game.time,
  state: game.state,
  arena: {
    name: game.arena,
    city: game.city,
  },
  broadcasters: getBroadcasters(game.broadcasters),
  home: game.home,
  visitor: game.visitor,
  playoffs: game.playoffs,
  periodTime: {
    // have not start
    periodStatus:
      game.period_time.game_status === '1'
        ? format(utcToZonedTime(parse(`${game.date}${game.time}`, 'yyyyMMddhhmm', getApiDate()).toISOString(), getUserTimeZoneId()), 'hh:mm a')
        : game.period_time.period_status,
    gameClock: game.period_time.game_clock,
    gameStatus: game.period_time.game_status,
    periodValue: game.period_time.period_value,
  },
})

export const sanitizeGames = (games, isFallBack = 0) => {
  return games.map((game) => {
    if (isFallBack === 1) {
      return sanitizeGameFallBack(game)
    } else if (isFallBack === 2) {
      return sanitizeGameFallBack2(game)
    } else {
      return sanitizeGame(game)
    }
  })
}

/**
 * Migrated from preprocessData()
 */
export const sanitizeGamesAndReorder = (games, isFallBack = 0) => {
  const sanitized = sanitizeGames(games, isFallBack)
  const prepare = sanitized.filter(
    (game) => game && game.periodTime && game.periodTime.gameStatus == 1
  )
  const live = sanitized.filter(
    (game) => game && game.periodTime && game.periodTime.gameStatus == 2
  )
  const finish = sanitized.filter(
    (game) => game && game.periodTime && game.periodTime.gameStatus == 3
  )
  return live.concat(finish.concat(prepare))
}
