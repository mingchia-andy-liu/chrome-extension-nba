import {injectGlobal} from 'styled-components'
import { css } from 'styled-components'


injectGlobal`
    * {
        box-sizing: border-box;
    }

    body {
        color: hsl(0, 0%, 30%);
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

export const flex = {
    base: (...args) =>  css`display: flex;`
}
