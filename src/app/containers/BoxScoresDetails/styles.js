import React from 'react'
import styled from 'styled-components'
import { Shadow, Theme, Row, AlignCenter, JustifyCenter } from '../../styles'

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

export const HighlightButton = styled.img`
    width: 30px;
    height: 30px;
`

export const HighlightWrapper = styled(Row)`
    ${AlignCenter}
    ${JustifyCenter}
    padding: 5px 0;
    cursor: pointer;
`

export const HintText = (dark, doubles, text) => {
    const backgroundColor = dark ? Theme.dark.doubles[doubles] : Theme.light.doubles[doubles]

    return (
        <Hint backgroundColor={backgroundColor} color={Theme.light.color}>{text}</Hint>
    )
}
