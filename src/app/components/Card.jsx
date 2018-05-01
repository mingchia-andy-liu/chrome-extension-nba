import React from 'react'
import styled from 'styled-components'
import {TeamInfo, TeamLogo} from './TeamInfo'
import {formatClock} from '../utils/format'
import {flex} from '../styles'


const CardBase = styled.div`
    display: flex;
    align-items: center;
    min-height: 100px;
    margin: 3px 5px 5px 5px;
    font-size: calc(17px + 0.1vw);
    background-color: #f9f9f9;
    border-radius: 5px;
    transition: 0.3s;

    &:hover {
        cursor: pointer;
        border: 2px solid rgb(30, 150, 250);
    }

    border: ${props => props.selected
        ? '2px solid rgb(30, 90, 250)'
        : '2px solid transparent'};
`;

const MatchInfo = styled.div`
    text-align: center;
    flex-basis: 40%;

    & > * {
        margin-top: 5px;
    }
`;

const TeamScore = styled.div`
    flex-grow: 2;
    color: ${props => props.winning ? 'green' : 'initial'};
`;

const Scores = styled.div`
    ${flex.base()}
`;


class Card extends React.PureComponent {
    render() {
        const {
            gid,
            hta,
            vta,
            htn,
            vtn,
            hs,
            vs,
            stt,
            clk,
            broadcaster,
            series
        } = this.props;

        return (
            <CardBase>
                <TeamInfo>
                    <TeamLogo team={vta}>{vta}</TeamLogo>
                    <div>{vtn}</div>
                </TeamInfo>
                <MatchInfo>
                    <Scores>
                        <TeamScore winning={vs > hs}> {vs} </TeamScore>
                        -
                        <TeamScore winning={vs < hs}> {hs} </TeamScore>
                    </Scores>
                    {series && <div>{series}</div>}
                    <div>{formatClock(clk, stt)}</div>
                </MatchInfo>
                <TeamInfo>
                    <TeamLogo team={hta}>{hta}</TeamLogo>
                    <div>{htn}</div>
                </TeamInfo>
            </CardBase>
        )
    }
}


export default Card
