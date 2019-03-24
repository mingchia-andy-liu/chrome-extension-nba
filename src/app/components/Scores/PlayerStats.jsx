import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable } from 'react-sticky-table'
import {
    Cell,
    HeaderCell,
    rowBGColor,
    RowHeaderCell,
    RowWrapper,
    StatsCell,
    Sup
} from '../../utils/format'
import {
    formatMinutes,
    getDoublesText,
    getOddRowColor,
    hasDoubles,
    toPercentage
} from '../../utils/common'
import { BoxScoreConsumer, ThemeConsumer } from '../Context'

const Wrapper = styled.div`
    width: 100%;
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
    border-right: 1px solid hsl(0, 0%, 95%);
    width: 10vw;
    min-width: 120px;
    overflow-y: hidden;
    padding-left: 5px;
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
        '+/-'
    ]

    return (
        <RowWrapper>
            <RowHeaderCell>{name}</RowHeaderCell>
            {headers.map(element => (
                <HeaderCell key={`stats-${element}-${name}`}>{element}</HeaderCell>
            ))}
        </RowWrapper>
    )
}

/**
 * Migrate from `formatBoxScoreData()`
 * @param {*} player
 * @param {*} isLive
 */
const renderPlayerRow = (player, isLive, i, isDark, hideZeroRow) => {
    if (hideZeroRow && player.minutes == '0' && player.seconds == '0') {
        return
    }

    const fn = player && player.first_name.trim() ? player.first_name.charAt(0) + '.' : ''
    const ln = player.last_name
    const name = player.last_name !== '' ? `${fn} ${ln}` : player.first_name
    const doubles = hasDoubles(player)

    const {
        starting_position,
        on_court,
        points,
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
    } = player

    const fgp = toPercentage(+field_goals_made / +field_goals_attempted)
    const tpp = toPercentage(+three_pointers_made / +three_pointers_attempted)
    const ftp = toPercentage(+free_throws_made / +free_throws_attempted)

    return (
        <RowWrapper
            key={name}
            style={{ backgroundColor: doubles ? rowBGColor(doubles, isDark) : getOddRowColor(i, isDark) }}
            title={doubles && getDoublesText(doubles)}
        >
            <PlayerName>
                {name}
                {starting_position && <Sup>{starting_position}</Sup>}
                {isLive && on_court === 1 && <OnCourt src="assets/png/icon-color-128.png" />}
            </PlayerName>
            <Cell>{formatMinutes(player)}</Cell>
            <StatsCell dark={isDark ? 1 : undefined} winning={+points >= 10 ? 1 : undefined}>{points}</StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={(+fgp >= 60 && +field_goals_attempted >= 5)? 1 : undefined}
                losing={(+fgp <= 30 && +field_goals_attempted >= 5)? 1 : undefined}
            >
                {`${field_goals_made}-${field_goals_attempted}`}
            </StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={(+fgp >= 60 && +field_goals_attempted >= 5)? 1 : undefined}
                losing={(+fgp <= 30 && +field_goals_attempted >= 5)? 1 : undefined}
            >
                {fgp}{fgp !== '-' && '%'}
            </StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={(+tpp >= 60 && +three_pointers_attempted >= 5)? 1 : undefined}
                losing={(+tpp <= 30 && +three_pointers_attempted >= 5)? 1 : undefined}
            >
                {`${three_pointers_made}-${three_pointers_attempted}`}
            </StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={(+tpp >= 60 && +three_pointers_attempted >= 5)? 1 : undefined}
                losing={(+tpp <= 30 && +three_pointers_attempted >= 5)? 1 : undefined}
            >
                {tpp}{tpp !== '-' && '%'}
            </StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={(+ftp >= 90 && +free_throws_attempted >= 5)? 1 : undefined}
                losing={(+ftp <= 60 && +free_throws_attempted >= 5)? 1 : undefined}
            >
                {`${free_throws_made}-${free_throws_attempted}`}
            </StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={(+ftp >= 90 && +free_throws_attempted >= 5)? 1 : undefined}
                losing={(+ftp <= 60 && +free_throws_attempted >= 5)? 1 : undefined}
            >
                {ftp}{ftp !== '-' && '%'}
            </StatsCell>
            <Cell>{rebounds_offensive}</Cell>
            <Cell>{rebounds_defensive}</Cell>
            <StatsCell dark={isDark ? 1 : undefined} winning={+rebounds_offensive + +rebounds_defensive >= 10 ? 1 : undefined}>{+rebounds_offensive + +rebounds_defensive}</StatsCell>
            <StatsCell dark={isDark ? 1 : undefined} winning={+assists >= 5 ? 1 : undefined}>{assists}</StatsCell>
            <StatsCell dark={isDark ? 1 : undefined} winning={+steals >= 5 ? 1 : undefined}>{steals}</StatsCell>
            <StatsCell dark={isDark ? 1 : undefined} winning={+steals >= 5 ? 1 : undefined}>{blocks}</StatsCell>
            <StatsCell dark={isDark ? 1 : undefined} losing={+turnovers >= 5 ? 1 : undefined}>{turnovers}</StatsCell>
            <StatsCell dark={isDark ? 1 : undefined} losing={+fouls === 6 ? 1 : undefined}>{fouls}</StatsCell>
            <Cell>{plus_minus}</Cell>
        </RowWrapper>
    )
}

class PlayerStats extends React.PureComponent {
    render() {
        const { hps, vps, hta, vta, isLive } = this.props
        if ( hps.length === 0 || vps.length === 0) {
            return (
                <Wrapper>
                    No Player Data Avaiable
                </Wrapper>
            )
        }

        return (
            <Wrapper>
                <ThemeConsumer>
                    {({ state: {dark} }) => (
                        <BoxScoreConsumer>
                            {({ state: { hideZeroRow } }) => (
                                <StickyTable stickyHeaderCount={0}>
                                    {renderHeaderRow(vta)}
                                    {vps.map((player, i) => (renderPlayerRow(player, isLive, i, dark, hideZeroRow)))}
                                    {renderHeaderRow(hta)}
                                    {hps.map((player, i) => (renderPlayerRow(player, isLive, i, dark, hideZeroRow)))}
                                </StickyTable>
                            )}
                        </BoxScoreConsumer>
                    )}
                </ThemeConsumer>
            </Wrapper>
        )
    }
}

PlayerStats.propTypes = {
    hps: PropTypes.array.isRequired,
    vps: PropTypes.array.isRequired,
    hta: PropTypes.string.isRequired,
    vta: PropTypes.string.isRequired,
    isLive: PropTypes.bool,
}

PlayerStats.defaultProps = {
    isLive: false,
}


export default PlayerStats
