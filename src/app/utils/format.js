import styled, { css } from 'styled-components'
import { Cell as StickyCell, Row } from 'react-sticky-table'
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

export const winLoseCSS = css`
    color: ${(props) => {
        if (props.dark) {
            if (props.winning) return Theme.dark.winning
            if (props.losing) return Theme.dark.losing
        }
        if (props.winning) return Theme.light.winning
        if (props.losing) return Theme.light.losing
    }};
`

export const StatsCell = styled(Cell)`
    ${winLoseCSS}
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
