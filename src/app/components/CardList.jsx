import React, { Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
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

const generateCards = (games, selected, options, rest) => {
  const { teams: favTeams, chronological, broadcast } = options
  const g = [...games]

  if (chronological) {
    g.sort((a, b) => {
      if (a.date < b.date) {
        return -1
      }
      if (a.date > b.date) {
        return 1
      }
      return 0
    })
  } else {
    for (let i = favTeams.length - 1; i >= 0; i--) {
      const favTeamAbbr = favTeams[i];
      const index = g.findIndex(
        ({ home, visitor }) =>
          home.abbreviation === favTeamAbbr || visitor.abbreviation === favTeamAbbr
      )
  
      if (index > -1) {
          const [favGame] = g.splice(index, 1);
          g.unshift(favGame);
      }
    }
  }

  return (
    <Fragment>
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

const CardList = ({
  games,
  hasError,
  isLoading,
  selected,
  isSidebar,
  ...rest
}) => {
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
      {({ state: { broadcast, teams, chronological } }) => (
        <Wrapper isPopup={isPopup} isSidebar={isSidebar}>
          {generateCards(
            games,
            selected,
            { teams, broadcast, chronological },
            rest
          )}
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
}

CardList.defaultProps = {
  hasError: false,
  isLoading: false,
  isSidebar: false,
  selected: '',
}

export default CardList
