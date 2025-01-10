import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getLogoColorById } from '../utils/teams'

export const Wrapper = styled.div`
  width: ${(props) => (props.large ? '80px' : '50px')};
  height: ${(props) => (props.large ? '80px' : '50px')};
  color: white;
  border-radius: 50%;
  font-size: ${(props) => (props.large ? 'calc(20px + 0.3vw)' : 'inherit')};
  opacity: ${(props) => (props.winning ? '1' : '0.4')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.team ? getLogoColorById(props.team) : '#000000'};
`
// Uncomment for using abbr for logo

const TeamLogo = ({ tn, ta, spoiler, reveal, winning, large }) => {
  return (
    <Wrapper
      winning={spoiler && !reveal ? true : winning}
      large={large}
      src={`https://cdn.nba.com/logos/nba/${tn}/primary/L/logo.svg`}
      alt={ta || 'TBD'}
      team={tn}
    >
      {ta}
    </Wrapper>
  )
}

TeamLogo.propTypes = {
  ta: PropTypes.string.isRequired,
  tn: PropTypes.string.isRequired,
}

TeamLogo.defaultProps = {
  winning: true,
  large: false,
}

export default TeamLogo
