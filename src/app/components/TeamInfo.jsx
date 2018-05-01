import React from 'react'
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
`;

export const TeamInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: 30%;
    align-items: center;

    font-size: calc(17px + 0.1vw);
`;
