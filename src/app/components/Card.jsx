import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { RowCSS, JustifyCenter, AlignCenter, Shadow } from '../styles'
import TeamInfo from './TeamInfo'
import MatchInfo from './MatchInfo'


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
`

class Card extends React.PureComponent {
    render() {
        const {
            id,
            home,
            visitor,
            nogame,
            onClick,
            ...rest
        } = this.props


        if (nogame) {
            return (
                <Wrapper>
                    No games today ¯\_(ツ)_/¯
                </Wrapper>
            )
        }

        const {
            abbreviation: hta,
            nickname: htn,
        } = home

        const  {
            abbreviation: vta,
            nickname: vtn,
        } = visitor


        return (
            <Wrapper onClick={onClick} data-gid={id}>
                <TeamInfo ta={vta} tn={vtn} />
                <MatchInfo home={home} visitor={visitor} {...rest} />
                <TeamInfo ta={hta} tn={htn} />
            </Wrapper>
        )
    }
}

Card.PropTypes = {
    id:PropTypes.string.isRequired,
    home:PropTypes.object.isRequired,
    visitor:PropTypes.object.isRequired,
    nogame:PropTypes.boolean,
    onClick:PropTypes.func.isRequired,
}


export default Card
