import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { RowCSS, JustifyCenter, AlignCenter, Shadow } from '../styles'
import TeamInfo from './TeamInfo'
import MatchInfo from './MatchInfo'
import { isWinning } from '../utils/format'
import { SettingsConsumer } from '../components/Context'
import { Theme } from '../styles'

// position relative for before pseudo element
const Wrapper = styled.div`
    ${RowCSS}
    ${JustifyCenter}
    ${AlignCenter}
    ${Shadow}
    position: relative;
    min-height: 90px;
    width: 100%;
    margin-bottom: 15px;
    font-size: calc(17px + 0.1vw);
    background-color: ${(props) => (props.dark ? Theme.dark.blockBackground: '#f9f9f9')};
    border-radius: 5px;
    transition: 0.3s;


    &:hover {
        cursor: pointer;
        border: 2px solid rgb(30, 150, 250);
        box-shadow: 0 6px 9px 0 rgba(0, 0, 0, 0.3);
    }

    border: ${(props) => (props.selected
        ? '2px solid rgb(30, 90, 250)'
        : '2px solid transparent')};

    &:last-child {
        margin-bottom: 0px;
    }

    &::before {
        ${(props) => (props.fav && `
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            border-top-left-radius: 3px;
            border-top: 20px solid gold;
            border-left: 5px solid gold;
            border-right: 20px solid transparent;
            border-bottom: 5px solid transparent;
        `)}
    }
`

class MatchCard extends React.PureComponent {
    render() {
        const {
            broadcaster,
            id,
            home,
            visitor,
            onClick,
            selected,
            showBroadcast,
            ...rest
        } = this.props

        const {
            abbreviation: hta,
            nickname: htn,
            score: hs,
        } = home

        const  {
            abbreviation: vta,
            nickname: vtn,
            score: vs,
        } = visitor

        return (
            <SettingsConsumer>
                {({ state: { dark, team } }) => (
                    <Wrapper
                        dark={dark}
                        onClick={onClick}
                        data-id={id}
                        selected={selected}
                        fav={team === vta || team === hta}
                    >
                        <TeamInfo ta={vta} tn={vtn} winning={isWinning(vs, hs)}/>
                        <MatchInfo
                            home={home}
                            visitor={visitor}
                            broadcaster={showBroadcast ? broadcaster : ''}
                            {...rest}
                        />
                        <TeamInfo ta={hta} tn={htn} winning={isWinning(hs, vs)}/>
                    </Wrapper>
                )}
            </SettingsConsumer>
        )
    }
}

MatchCard.propTypes = {
    broadcaster: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    home: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    showBroadcast: PropTypes.bool,
}

const TextCard = ({ text }) => (
    <SettingsConsumer>
        {({ state: { dark } }) => <Wrapper dark={dark}> {text} </Wrapper>}
    </SettingsConsumer>
)

TextCard.propTypes = {
    text: PropTypes.string.isRequired,
}


export { MatchCard, TextCard }
