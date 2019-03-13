import styled, {injectGlobal, css} from 'styled-components'

injectGlobal`
    :root {
        --color: hsl(0, 0%, 15%);
        --bg-color: #e0e0e0;
    }

    * {
        box-sizing: border-box;
    }

    body {
        color: var(--color);
        background-color: var(--bg-color);
        font-family: 'Roboto Condensed', sans-serif;
        /*remove browser padding and margin*/
        padding: 0;
        margin: 0;
        /* reset 1em */
        font-size: calc(14px + 0.1vw);
    }
`

export const Theme = {
    light: {
        baseBackground: '#e0e0e0',
        blockBackground: 'white',
        color: 'hsl(0, 0%, 15%)',
        winning: '#00aa00',
        losing: 'red',
        doubles: {
            d: '#c1dcf0',
            t: '#f7b125',
            q: '#724c9f',
            p: '#008348',
        },
    },
    dark: {
        baseBackground: 'hsl(0, 0%, 40%)',
        blockBackground: 'hsl(0, 0%, 17%)',
        color: 'hsl(0, 0%, 95%)',
        winning: '#00ee00',
        losing: 'red',
        doubles: {
            d: '#4c4ca6',
            t: '#f19132',
            q: '#724c9f',
            p: '#008348',
        },
    },
}

/**
 * media query for mobile device
 */
export const mediaQuery = (...args) => css`
    @media screen and (max-width: 800px) {
        ${ css(...args) }
    }
`


/**
 * Flex container
 */
const align = ({
    alignCenter,
    alignStart,
    alignEnd,
    alignBaseline,
    alignStretch,
    alignSpaceBetween,
    alignSpaceAround,
}) => {
    return (alignCenter && 'center') ||
        (alignStart && 'flex-start') ||
        (alignEnd && 'flex-end') ||
        (alignBaseline && 'baseline') ||
        (alignStretch && 'stretch') ||
        (alignSpaceBetween && 'space-between') ||
        (alignSpaceAround && 'space-around')
}

const justify = ({
    justifyCenter,
    justifyStart,
    justifyEnd,
    justifySpaceBetween,
    justifySpaceAround,
}) => {
    return (justifyCenter && 'center') ||
        (justifyStart && 'flex-start') ||
        (justifyEnd && 'flex-end') ||
        (justifySpaceBetween && 'space-between') ||
        (justifySpaceAround && 'space-around')
}

const wrap = ({
    nowrap,
    wrap,
    wrapReverse,
}) => {
    return (nowrap && 'nowrap') ||
        (wrap && 'wrap') ||
        (wrapReverse && 'wrap-reverse')
}

export const Base = styled.div`
    display: flex;
    align-items: ${props => align(props)};
    justify-content: ${props => justify(props)};
    ${props => `flex-wrap: ${wrap(props)}`};
    ${props => props.flexBasis && `flex-basis: ${props.flexBasis}`};
    ${props => props.flexGrow && `flex-basis: ${props.flexGrow}`};
    ${props => props.flexShrink && `flex-shrink: ${props.flexShrink}`};
`

export const Row = styled(Base)`
    flex-direction: row;
`

export const Column = styled(Base)`
    flex-direction: column;
`

export const Center = styled(Base)`
    justify-content: center;
    align-items: center;
`

/**
 * Flex mixins
 */
export const RowCSS = css`
    display: flex;
    flex-direction: row;
`

export const ColumnCSS = css`
    display: flex;
    flex-direction: column;
`

export const JustifyCenter = css`
    justify-content: center;
`

export const AlignCenter = css`
    align-items: center;
`

export const Shadow = css`
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
`

export const ButtonsWrapper = styled(Row)`
    padding: 0 5px 5px 5px;

    > :not(:first-child) {
        margin-left: 10px;
    }
`
