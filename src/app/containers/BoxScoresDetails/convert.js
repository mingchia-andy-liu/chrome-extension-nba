import { toPercentage } from '../../utils/common'
import { QUARTER_NAMES } from '../../utils/constant'

const getStats = (old, points) => {
    if (!old) {
        return {}
    }
    return {
        assists: old.ast,
        blocks: old.blk,
        field_goals_attempted: old.fga,
        field_goals_made: old.fgm,
        field_goals_percentage: toPercentage(+old.fgm/+old.fga),
        fouls: old.pf,
        free_throws_attempted: old.fta,
        free_throws_made: old.ftm,
        free_throws_percentage: toPercentage(+old.ftm/+old.fta),
        points,
        rebounds_defensive: old.dreb,
        rebounds_offensive: old.oreb,
        steals: old.stl,
        team_fouls: old.tf,
        team_rebounds: old.tmreb,
        team_turnovers: old.tmtov,
        three_pointers_attempted: old.tpa,
        three_pointers_made: old.tpm,
        three_pointers_percentage: toPercentage(+old.tpm/+old.tpa),
        turnovers: old.tov,
    }
}

const getPlayers = (players = []) => {
    return players.map(player => ({
        assists: player.ast,
        blocks: player.blk,
        field_goals_attempted: player.fga,
        field_goals_made: player.fgm,
        first_name: player.fn,
        fouls: player.pf,
        free_throws_attempted: player.fta,
        free_throws_made: player.ftm,
        last_name: player.ln,
        minutes: player.min,
        on_court: player.court,
        person_id: player.pid,
        plus_minus: player.pm,
        points: player.pts,
        rebounds_defensive: player.dreb,
        rebounds_offensive: player.oreb,
        seconds: player.sec,
        starting_position: player.pos,
        steals: player.stl,
        three_pointers_attempted: player.tpa,
        three_pointers_made: player.tpm,
        turnovers: player.tov,
    }))
}

const getLinescores = (stats, p) => {
    const pluck = ({q1, q2, q3, q4, ot1, ot2, ot3, ot4, ot5, ot6, ot7, ot8, ot9, ot10}) => ([
        q1,
        q2,
        q3,
        q4,
        ot1,
        ot2,
        ot3,
        ot4,
        ot5,
        ot6,
        ot7,
        ot8,
        ot9,
        ot10
    ])
    return pluck(stats).slice(0, p).map((period, i) => ({
        period_name: QUARTER_NAMES[i],
        period_value: i.toString(),
        score: period.toString(),
    }))
}

export default (old) => {
    const {
        cl,
        hls,
        offs,
        p,
        st,
        stt,
        vls,
    } = old
    let officials = []
    if (offs && offs.off) {
        officials = offs.off.map(person => ({
            first_name: person.fn,
            last_name: person.ln,
            person_id: person.num,
        }))
    }

    return {
        officials,
        periodTime: {
            periodValue: `${p}`,
            periodStatus: `${stt}`,
            gameClock: cl,
            gameStatus: `${st}`,
        },
        home: {
            abbreviation: hls.ta,
            city: hls.tc,
            linescores: { period: getLinescores(hls, p) },
            nickname: hls.tn,
            players: { player: getPlayers(hls.pstsg) },
            score: hls.s,
            stats: getStats(hls.tstsg, hls.s),
        },
        visitor: {
            abbreviation: vls.ta,
            city: vls.tc,
            linescores: { period: getLinescores(vls, p) },
            nickname: vls.tn,
            players: { player: getPlayers(vls.pstsg) },
            score: vls.s,
            stats: getStats(vls.tstsg, vls.s),
        },
    }
}
