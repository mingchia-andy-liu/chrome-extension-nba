import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SettingsConsumer } from './Context'
import TeamLogo from './TeamLogo'

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
const TeamRecord = styled.div`
  font-size: calc(13px + 0.1vw);
  opacity: 0.9;
`

const TeamInfo = ({ tid, ta, tn, winning, large, wins, losses, reveal }) => {
  return (
    <SettingsConsumer>
      {({ state: { spoiler } }) => (
        <TeamInfoWrapper>
          <TeamLogo
            spoiler={spoiler}
            winning={winning}
            ta={ta}
            tn={tid}
            large={large}
            reveal={reveal}
          />
          <TeamName winning={spoiler && !reveal ? true : winning}>
            {tn || 'TBD'}
          </TeamName>
          {(!spoiler || reveal) && wins != null && losses != null && (
            <TeamRecord>
              {wins}-{losses}
            </TeamRecord>
          )}
        </TeamInfoWrapper>
      )}
    </SettingsConsumer>
  )
}

TeamInfo.propTypes = {
  tid: PropTypes.string.isRequired,
  ta: PropTypes.string.isRequired,
  tn: PropTypes.string.isRequired,
  winning: PropTypes.bool,
  large: PropTypes.bool,
  wins: PropTypes.number,
  losses: PropTypes.number,
  reveal: PropTypes.bool,
}

TeamInfo.defaultProps = {
  winning: true,
  large: false,
}

export default TeamInfo
