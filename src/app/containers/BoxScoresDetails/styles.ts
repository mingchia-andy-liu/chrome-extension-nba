import * as React from 'react'
import styled from 'styled-components'

import {
  Shadow,
  Theme,
  Row,
  Column,
  AlignCenter,
  JustifyCenter,
  mediaQuery,
} from '../../styles'

export const Content = styled.div`
  ${Shadow}
  grid-area: content;
  overflow-y: scroll !important;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.dark ? Theme.dark.blockBackground : '#fff'};
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

export const OverviewWrapper = styled(Column)`
  ${AlignCenter}
  ${JustifyCenter}
  margin: 0 10px;
`

export const HintText = (dark, doubles, text) => {
  const backgroundColor = dark
    ? Theme.dark.doubles[doubles]
    : Theme.light.doubles[doubles]

  return (
    <Hint backgroundColor={backgroundColor} color={Theme.light.color}>
      {text}
    </Hint>
  )
}

export const RowWrap = styled(Row)`
  flex-wrap: wrap;
`

export const TeamLeaderWrapper = styled(Column)`
  ${AlignCenter}
  width: 100%;
  padding: 0 10%;
  ${mediaQuery`
        padding: 0;
    `}
`

export const TeamLeaderContent = styled(Row)`
  width: 100%;
`
