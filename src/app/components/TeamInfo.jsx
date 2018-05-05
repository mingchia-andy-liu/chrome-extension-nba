import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {getLogoColor} from '../utils/logo'

export const TeamLogo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    margin-bottom: 8px;
    color: white;
    border-radius: 50%;

    background-color: ${props => props.team
        ? getLogoColor(props.team)
        : '#000000'};
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
        const { ta, tn } = this.props
        return (
            <TeamInfoWrapper>
                <TeamLogo team={ta}>{ta}</TeamLogo>
                <div>{tn}</div>
            </TeamInfoWrapper>
        )
    }
}

TeamInfo.propTypes = {
    ta: PropTypes.string.isRequired,
    tn: PropTypes.string.isRequired,
}

export default TeamInfo
