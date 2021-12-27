import React, { Fragment } from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import { mediaQuery } from '../styles'
import { TextCard, MatchCard } from './Card'
import { SidebarConsumer } from './Context'
import browser from '../utils/browser'

const Wrapper = styled.div`
  display: block;
  width: 100%;

  ${mediaQuery`
        min-height: 100px;
        padding: 0 5px 10px 5px;
        ${(props) => props.isPopup && 'max-height: 350px;'}
        ${(props) => props.isSidebar && 'max-height: 250px;'}
        overflow-y: scroll;
    `}
`

const generateCards = (games, selected, favTeam, broadcast, rest) => {
  const g = [...games]
  const favTeamIndex = g.findIndex(
    ({ home, visitor }) =>
      home.abbreviation === favTeam || visitor.abbreviation === favTeam
  )
  const favTeamMatch = g[favTeamIndex]
  if (favTeamIndex >= 0) {
    g.splice(favTeamIndex, 1)
  }
  return (
    <Fragment>
      {favTeamMatch && (
        <MatchCard
          selected={favTeamMatch.id === selected}
          showBroadcast={broadcast}
          {...favTeamMatch}
          {...rest}
        />
      )}
      {g.map((game, index) => (
        <MatchCard
          selected={game.id === selected}
          key={'card' + index}
          showBroadcast={broadcast}
          {...game}
          {...rest}
        />
      ))}
    </Fragment>
  )
}

const CardList = (props) => {
  const {
    games,
    hasError,
    isLoading,
    selected,
    isSidebar,
    ...rest
  } = props;
  const [isPopup, togglePopup] = React.useState(false)

  React.useEffect(() => {
    browser.tabs.getCurrent((tab) => {
      togglePopup(!tab)
    })
  }, [])

  if (isLoading) {
    return (
      <Wrapper>
        <TextCard text={'Loading...'} />
      </Wrapper>
    )
  }
  if (hasError) {
    return (
      <Wrapper>
        <TextCard text={'Something went wrong. A fix is coming.'} />
      </Wrapper>
    )
  }
  if (games.length === 0) {
    return (
      <Wrapper>
        <TextCard text={'No games today ¯\\_(ツ)_/¯'} />
      </Wrapper>
    )
  }

  return (
    <SidebarConsumer>
      {({ state: { broadcast, team } }) => (
        <Wrapper isPopup={isPopup} isSidebar={isSidebar}>
          {generateCards(games, selected, team, broadcast, rest)}
        </Wrapper>
      )}
    </SidebarConsumer>
  )
}

CardList.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
  selected: PropTypes.string,
  hasError: PropTypes.bool,
  /**
   * is card list loading in sidebar of bs. If so, need custom css
   */
  isSidebar: PropTypes.bool,
  onClick: PropTypes.func,
}

CardList.defaultProps = {
  hasError: false,
  isLoading: false,
  isSidebar: false,
  selected: '',
}

export default CardList
