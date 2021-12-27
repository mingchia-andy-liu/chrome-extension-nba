import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'
import { getLogoColorByName } from '../utils/teams'
import { SettingsConsumer } from './Context'

export const TeamLogo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: ${(props) => (props.large ? '65px' : '45px')};
  min-height: ${(props) => (props.large ? '65px' : '45px')};
  color: white;
  border-radius: 50%;
  font-size: ${(props) => (props.large ? 'calc(20px + 0.3vw)' : 'inherit')};

  background-color: ${(props) =>
    props.team ? getLogoColorByName(props.team) : '#000000'};

  opacity: ${(props) => (props.winning ? '1' : '0.4')};
`

const TeamName = styled.div`
  text-align: center;
  margin-top: 8px;
  opacity: ${(props) => (props.winning ? '1' : '0.4')};
`

const TeamInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 30%;
  align-items: center;

  font-size: calc(17px + 0.1vw);
`

const TeamInfo = ({ ta, tn, winning, large }) => {
  return (
    <SettingsConsumer>
      {({ state: { spoiler } }) => (
        <TeamInfoWrapper>
          <TeamLogo winning={spoiler ? true : winning} team={ta} large={large}>
            {ta}
          </TeamLogo>
          <TeamName winning={spoiler ? true : winning}>{tn}</TeamName>
        </TeamInfoWrapper>
      )}
    </SettingsConsumer>
  )
}

TeamInfo.propTypes = {
  ta: PropTypes.string.isRequired,
  tn: PropTypes.string.isRequired,
  winning: PropTypes.bool,
  large: PropTypes.bool,
}

TeamInfo.defaultProps = {
  winning: true,
  large: false,
}

export default TeamInfo
