import styled from 'styled-components'
import { mediaQuery } from '../../styles'

export const Wrapper = styled.div`
    display: grid;
    grid-template-areas: "sidebar content";
    grid-template-columns: minmax(27%, 300px) 1fr;
    grid-gap: 1em 1em;
    padding: 10px 0;

    ${mediaQuery`
        grid-template-areas:"sidebar"
                            "content";
        grid-template-columns: 1fr;`}
`
