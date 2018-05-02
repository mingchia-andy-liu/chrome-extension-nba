import styled, {injectGlobal, css} from 'styled-components'

injectGlobal`
    * {
        box-sizing: border-box;
    }

    body {
        color: hsl(0, 0%, 15%);
        background-color: #e0e0e0;
        font-family: 'Roboto Condensed', sans-serif;
        /*remove browser padding and margin*/
        padding: 0;
        margin: 0;
        /* reset 1em */
        font-size: 14px;
    }

    th,
    td {
        min-width: 43px;
        width: 5vw;
        text-align: center;
        border-bottom: 1px solid hsl(0, 0%, 85%);
    }

    table tr:first-child th:first-child {
        border-top-left-radius: 5px;
    }

    table tr:first-child th:last-child {
        border-top-right-radius: 5px;
    }
`


/**
 * Media query for mobile device
 */
export const media = {
  handheld: (...args) => css`
    @media (max-width: 420px) {
      ${ css(...args) }
    }
  `
}


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
    alignSpaceAround
}) => {
    return alignCenter && "center"||
        alignStart && "flex-start"||
        alignEnd  && "flex-end"||
        alignBaseline  && "baseline"||
        alignStretch && "stretch" ||
        alignSpaceBetween && "space-between" ||
        alignSpaceAround && "space-around" ||
        "center"
}
const justify = ({
    justifyCenter,
    justifyStart,
    justifyEnd,
    justifySpaceBetween,
    justifySpaceAround
}) => {
    return justifyCenter && "center" ||
        justifyStart && "flex-start" ||
        justifyEnd &&  "flex-end" ||
        justifySpaceBetween && "space-between" ||
        justifySpaceAround && "space-around" ||
        "center"
};

const wrap = ({
    nowrap,
    wrap,
    wrapReverse
    }) => {
    return nowrap && "nowrap" ||
        wrap && "wrap" ||
        wrapReverse && "wrap-reverse" ||
        "wrap"
};

export const Base = styled.div`
    display: flex;
    align-items: ${props => align(props)};
    justify-content: ${props => justify(props)};
    ${props => `flex-wrap: ${wrap(props)}`};
    ${props => props.flexBasis && `flex-basis: ${props.flexBasis}`};
    ${props => props.flexGrow && `flex-basis: ${props.flexGrow}`};
    ${props => props.flexShrink && `flex-shrink: ${props.flexShrink}`};
`;

export const Flex = styled(Base)`
    flex-direction: ${props => props.row && "row" || "column" };
`;

export const Row = styled(Base)`
    flex-direction: row;
`;

export const Column = styled(Base)`
    flex-direction: column;
`;

export const Center = styled(Base)`
    justify-content: center;
    align-items: center;
`;

/**
 * Flex mixins
 */
export const RowCSS = css`
    display: flex;
    flex-direction: row;
`;

export const ColumnCSS = css`
    display: flex;
    flex-direction: column;
`;

export const JustifyCenter = css`
    justify-content: center;
`;

export const AlignCenter = css`
    align-items: center;
`
