import React from 'react'
import styled from 'styled-components'
import { Shadow, Theme, Row, mediaQuery } from '../../styles'

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

export const Sidebar = styled.div`
    grid-area: sidebar;
`

export const Content = styled.div`
    ${Shadow}
    grid-area: content;
    overflow-y: scroll !important;
    padding: 10px;
    border-radius: 5px;
    background-color: ${(props) => (props.dark ? Theme.dark.blockBackground : '#fff')};
`

export const Title = styled(Row)`
    font-size: calc(12px + 1vw);
`

export const Subtitle = styled.span`
    padding: 0 5px;

    &:first-child {
        padding-left: 0px;
    }
`

export const Hint = styled.div`
    background-color: ${(props) => props.backgroundColor};
    color: ${(props) => props.color};
    padding: 0 5px;
    margin: 0 5px;
`

export const HintText = (dark, doubles, text) => {
    const backgroundColor = dark ? Theme.dark.doubles[doubles] : Theme.light.doubles[doubles]

    return (
        <Hint backgroundColor={backgroundColor} color={Theme.light.color}>{text}</Hint>
    )
}
