import { utcToZonedTime } from 'date-fns-tz'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import { getUserTimeZoneId } from './time'
import { convertDaily, convertDaily2, convertDaily3 } from './convert'
import getApiDate from './getApiDate'

/**
 * Target interface
 * @returns 
 * export interface Game {
      broadcasters: Broadcaster[]
      home: Home
      visitor: Visitor
      periodTime: PeriodTime
      id: string
      date: string
      time: string
      state: string
      arena: Arena
      startTimeUTC: string
    }
   export interface PeriodTime {
      periodStatus: string
      gameClock: string
      gameStatus: string
      periodValue: string
    }

   export interface Team {
      abbreviation: string
      city: string
      linescores: Linescores
      nickname: string
      score: string
    }

  export interface Linescores {
      period: Period[]
    }

  export interface Period {
      period_name: string
      period_value: string
      score: string
    }
 */

// for https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json
/**
 *  
 * export interface Root {
      meta: Meta
      scoreboard: Scoreboard
    }
 * 
 * export interface Game {
      gameId: string
      gameCode: string
      gameStatus: number
      gameStatusText: string
      period: number
      gameClock: string
      gameTimeUTC: string
      gameEt: string
      regulationPeriods: number
      ifNecessary: boolean
      seriesGameNumber: string
      seriesText: string
      homeTeam: Team
      awayTeam: Team
      gameLeaders: GameLeaders
      pbOdds: PbOdds
    }
 *
 * export interface HomeTeam {
      teamId: number
      teamName: string
      teamCity: string
      teamTricode: string
      wins: number
      losses: number
      score: number
      seed: any
      inBonus: any
      timeoutsRemaining: number
      periods: Period[]
    }

  export interface Period {
      period: number
      periodType: string
      score: number
    }
 * 
 */
const sanitizeGameFallBack3 = (game) => ({
  // gives home, visitor
  ...convertDaily3(game),
  id: game.gameId,
  date: game.gameEt, // v
  time: game.gameEt, // v
  state: game.gameStatus,
  arena: { // v
    name: '',
    city: '',
  },
  startTimeUTC: game.gameTimeUTC,
})

// for http://data.nba.net/prod/v2/${dateStr}/scoreboard.json
/**
 * 
 * @param {} game 
 * @returns 
 * 
 * export interface Game {
    seasonStageId:         number;
    seasonYear:            string;
    leagueName:            LeagueName;
    gameId:                string;
    arena:                 Arena;
    isGameActivated:       boolean;
    statusNum:             number;
    extendedStatusNum:     number;
    startTimeEastern:      string;
    startTimeUTC:          Date;
    startDateEastern:      string;
    homeStartDate:         string;
    homeStartTime:         string;
    visitorStartDate:      string;
    visitorStartTime:      string;
    gameUrlCode:           string;
    clock:                 string;
    isBuzzerBeater:        boolean;
    isPreviewArticleAvail: boolean;
    isRecapArticleAvail:   boolean;
    nugget:                Nugget;
    attendance:            string;
    tickets:               Tickets;
    hasGameBookPdf:        boolean;
    isStartTimeTBD:        boolean;
    isNeutralVenue:        boolean;
    gameDuration:          GameDuration;
    period:                Period;
    vTeam:                 Team;
    hTeam:                 Team;
    watch:                 Watch;
}
 */
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
  startTimeUTC: game.startTimeUTC,
})

// https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2019/scores/00_todays_scores.json
/**
 * 
 * @param {*} game 
 * @returns 
 * export interface G {
        gid:   string;
        gcode: string;
        p:     null;
        st:    string;
        stt:   string;
        cl:    null;
        v:     H;
        h:     H;
        lm:    LM;
    }
 */
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
        ? format(
          utcToZonedTime(
            parse(
                `${game.date}${game.time}`,
                'yyyyMMddhhmm',
                getApiDate()
            ).toISOString(),
            getUserTimeZoneId()
          ),
          'hh:mm a'
        )
        : game.period_time.period_status,
    gameClock: game.period_time.game_clock,
    gameStatus: game.period_time.game_status,
    periodValue: game.period_time.period_value,
  },
})

/**
 * Migrated from preprocessData()
 * 
 * Mapping:
 *  
 *  0: `https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`
 *      broken
 * 
 *  1: `https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/${year}/scores/00_todays_scores.json`
 *  2: `http://data.nba.net/prod/v2/${dateStr}/scoreboard.json`
 */
export const sanitizeGames = (games, isFallBack = 0) => {
  const sanitized = games.map((game) => {
    if (isFallBack === 1) {
      return sanitizeGameFallBack(game)
    } else if (isFallBack === 2) {
      return sanitizeGameFallBack2(game)
    } else if (isFallBack === 3) {
      return sanitizeGameFallBack3(game)
    } else {
      return sanitizeGame(game)
    }
  })
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