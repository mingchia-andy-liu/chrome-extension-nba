import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ColumnCSS, JustifyCenter, JustifyStart, AlignCenter } from '../../styles'
import { getLogoColorByName } from '../../utils/teams'

const Wrapper = styled.div`
    ${ColumnCSS}
    ${JustifyStart}
    ${AlignCenter}
    width: 100%;
`

const Cell = styled.div`
    ${ColumnCSS}
    ${JustifyCenter}
    ${AlignCenter}
    min-width: 200px;
    width: 100%;
    height: 1.8em !important;
    text-align: center;
    vertical-align: middle;
`

const NameCell = styled(Cell)`
    color: #fff;
    background-color: ${((props) => props.bg)};
`

class TeamLeaderCol extends React.PureComponent {
    render() {
        const { points, rebounds, assists, name } = this.props
        return (
            <Wrapper>
                <NameCell bg={getLogoColorByName(name)}>{name}</NameCell>
                {points.map(({name, value}) => (<Cell key={name}>{name} has {value} points</Cell>))}
                {rebounds.map(({name, value}) => (<Cell key={name}>{name} has {value} rebounds</Cell>))}
                {assists.map(({name, value}) => (<Cell key={name}>{name} has {value} assists</Cell>))}
            </Wrapper>
        )
    }
}

TeamLeaderCol.propTypes = {
    name: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
    })),
    rebounds:PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
    })),
    assists:PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
    })),
}


export default TeamLeaderCol
