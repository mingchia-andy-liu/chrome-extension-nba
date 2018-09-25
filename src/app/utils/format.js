import styled from 'styled-components'
import {Cell as StickyCell, Row} from 'react-sticky-table'
import { Theme } from '../styles'

export const Cell = styled(StickyCell)`
    min-width: 40px;
    width: 5vw;
    height: 1.8em !important;
    text-align: center;
    vertical-align: middle;
    color: ${(props) => {
        if (props.dark && props.winning) return Theme.dark.winning
        if (props.winning) return Theme.light.winning
    }};
`

export const StatsCell = styled(Cell)`
    color: ${(props) => {
        if (props.dark) {
            if (props.winning) return Theme.dark.winning
            if (props.losing) return Theme.dark.losing
        }
        if (props.winning) return Theme.light.winning
        if (props.losing) return Theme.light.losing
    }};
`

export const HeaderCell = styled(Cell)`
    font-weight: 700;
    background-color: #046fdb;
    color: #fff;
`

export const RowHeaderCell = styled(HeaderCell)`
    width: 10vw;
    min-width: 120px !important;
    border-right: 1px solid hsl(0, 0%, 95%);
`

export const Sup = styled.div`
    font-size: x-small;
    color: hsl(0, 0%, 50%);
    vertical-align: super;
    padding: 1px;
`

export const RowWrapper = styled(Row)`
    border-bottom: 1px solid hsl(0, 0%, 95%);
    color: ${(props) => (props.doubles && 'white')};
    &:hover {
        background-color: grey !important;
    }
`

export const rowBGColor = (doubles, isDark) => {
    const colors = isDark ? Theme.dark.doubles : Theme.light.doubles
    switch (doubles) {
        case 'd':
            return colors.d
        case 't':
            return colors.t
        case 'q':
            return colors.q
        case 'p':
            return colors.p
        default:
            return ''
    }
}

export const hasDoubles = (player) => {
    let count = 0
    const {
        rebounds_defensive,
        rebounds_offensive,
        assists,
        steals,
        blocks,
        points,
    } = player
    count += (+rebounds_offensive + +rebounds_defensive) / 10 >= 1 ? 1 : 0
    count += (+points) / 10 >= 1 ? 1 : 0
    count += (+assists) / 10 >= 1 ? 1 : 0
    count += (+steals) / 10 >= 1 ? 1 : 0
    count += (+blocks) / 10 >= 1 ? 1 : 0
    switch (count) {
        case 2:
            return 'd'
        case 3:
            return 't'
        case 4:
            return 'q'
        case 5:
            return 'p'
        default:
            return ''
    }
}

export const getDoublesText = (doubles) => {
    switch (doubles) {
        case 'd':
            return 'Double Doubles'
        case 't':
            return 'Triple Doubles'
        case 'q':
            return 'Quadruple Doubles'
        case 'p':
            return 'Quintuple Doubles'
        default:
            return ''
    }
}

export const formatGames = (games) => {
    return games.map(element => {

        return {
            ...element,
            series: element.lm.seri,
            hta: element.h.ta,
            htn: element.h.tn,
            hs: element.h.s,
            vta: element.v.ta,
            vtn: element.v.tn,
            vs: element.v.s,
        }
    })
}

export const formatClock = (clock, status) => {
    if (status.includes('Halftime') || status.includes('Tipoff') || status.includes('Final')) {
        // game started, clock stopped
        return status
    } else if (status === 'PPD') {
        //PPD mean postponed
        return 'Postponed'
    } else if (status.includes('Start') || status.includes('End')) {
        const statusArray = status.split(' ')
        if (status.includes('Qtr')) {
            return statusArray[0] + ' of Q' + statusArray[2].charAt(0)
        } else {
            return statusArray[0] + ' of OT' + statusArray[2].charAt(0)
        }
    } else if (status && status.includes('Qtr')) {
        // game started being played over regular time
        return 'Q' + status.charAt(0) + ' ' + clock
    } else if (status && status.includes('OT')) {
        // game start being played over over time
        return 'OT' + status.charAt(0) + ' ' + clock
    }
    return clock
}

/**
 * Format Box score table's player minutes.
 * @param {row object} player
 */
export const formatMinutes = ({ minutes, seconds }) => {
    if (minutes < 10 || minutes.length === 1) {
        minutes = `0${minutes}`
    }
    if (seconds < 10 || seconds.length === 1) {
        seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
}


/**
 * convert numerical decimal to percentage
 * @param {*} decimal
 *
 * @returns {string} 2 decimal percentage
 */
export const toPercentage = (decimal) => {
    if (Number.isNaN(decimal)) return '-'
    else return (decimal * 100).toFixed()
}

/**
 * determine who is winning
 */
export const isWinning = (self, other) => {
    if (self === '' && other === '') {
        return true
    } else {
        return +self > +other
    }
}


export const quarterNames = ['Q1', 'Q2', 'Q3','Q4', 'OT1', 'OT2', 'OT3', 'OT4', 'OT5', 'OT6', 'OT7', 'OT8', 'OT9', 'OT10' ]


export const DATE_FORMAT = 'YYYYMMDD'
