import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {getLogoColorByName} from '../utils/teams'
import {SettingsConsumer} from './Context'

export const TeamLogo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 45px;
    min-height: 45px;
    color: white;
    border-radius: 50%;

    background-color: ${(props) => (props.team
        ? getLogoColorByName(props.team)
        : '#000000')};

    opacity: ${(props) => (props.winning
        ? '1'
        : '0.4')};
`

const TeamName = styled.div`
    text-align: center;
    margin-top: 8px;
    opacity: ${(props) => (props.winning
        ? '1'
        : '0.4')};
`

const TeamInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: 30%;
    align-items: center;

    font-size: calc(17px + 0.1vw);
`

class TeamInfo extends React.PureComponent {
    render() {
        const { ta, tn, winning } = this.props
        return (
            <SettingsConsumer>
                {({state: {spoiler}}) => (
                    <TeamInfoWrapper>
                        <TeamLogo winning={spoiler ? true : winning} team={ta}>{ta}</TeamLogo>
                        <TeamName winning={spoiler ? true : winning}>{tn}</TeamName>
                    </TeamInfoWrapper>
                )}
            </SettingsConsumer>
        )
    }
}

TeamInfo.propTypes = {
    ta: PropTypes.string.isRequired,
    tn: PropTypes.string.isRequired,
    winning: PropTypes.bool,
}

TeamInfo.defaultProps = {
    winning: true,
}

export default TeamInfo
