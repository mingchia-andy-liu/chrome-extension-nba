import React from 'react'
import styled from 'styled-components'
import {Row, RowCSS, JustifyCenter, AlignCenter, Shadow} from '../styles'
import {TeamInfo, TeamLogo} from './TeamInfo'
import {formatClock} from '../utils/format'


const Wrapper = styled.div`
    ${RowCSS}
    ${JustifyCenter}
    ${AlignCenter}
    ${Shadow}
    min-height: 90px;
    width: 100%;
    margin-bottom: 15px;
    font-size: calc(17px + 0.1vw);
    background-color: #f9f9f9;
    border-radius: 5px;
    transition: 0.3s;


    &:hover {
        cursor: pointer;
        border: 2px solid rgb(30, 150, 250);
        box-shadow: 0 6px 9px 0 rgba(0, 0, 0, 0.3);
    }

    border: ${props => props.selected
        ? '2px solid rgb(30, 90, 250)'
        : '2px solid transparent'};
`;

const NoGame = styled(Wrapper)`
    ${JustifyCenter}
`;

const MatchInfo = styled.div`
    flex-basis: 40%;
    text-align: center;

    & > * {
        margin-top: 5px;
    }
`;

const TeamScore = styled.div`
    flex-grow: 2;
    ${props => props.winning && 'color: green;'};
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
            cl,
            broadcaster,
            series,
            nogame,
            onClick,
        } = this.props;

        if (nogame) {
            return (
                <Wrapper justifyCenter alignCenter>
                    No games today ¯\_(ツ)_/¯
                </Wrapper>
            )
        }

        return (
            <Wrapper onClick={onClick} data-gid={gid}>
                <TeamInfo>
                    <TeamLogo team={vta}>{vta}</TeamLogo>
                    <div>{vtn}</div>
                </TeamInfo>
                <MatchInfo>
                    <Row>
                        <TeamScore winning={vs.s > hs.s ? 1 : 0}> {vs.s} </TeamScore>
                        -
                        <TeamScore winning={vs.s < hs.s ? 1 : 0}> {hs.s} </TeamScore>
                    </Row>
                    {series && <div>{series}</div>}
                    <div>{formatClock(cl, stt)}</div>
                </MatchInfo>
                <TeamInfo>
                    <TeamLogo team={hta}>{hta}</TeamLogo>
                    <div>{htn}</div>
                </TeamInfo>
            </Wrapper>
        )
    }
}


export default Card
