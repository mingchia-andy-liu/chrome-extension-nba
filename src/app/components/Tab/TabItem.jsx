import React, { Component } from 'react'
import {Link as RouterLink} from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {ColumnCSS, AlignCenter, JustifyCenter} from '../../styles'


const Link = styled(RouterLink)`
    ${ColumnCSS}
    ${AlignCenter}
    ${JustifyCenter}
    width: 100%;
    height: 100%;
    padding: 10px;

    &:hover {
        font-weight: 400;
    }

    & label {
        color: ${(props) => (props.active ? '#fff;' : 'hsl(0, 0%, 85%);')}
        font-weight: ${(props) => (props.active ? '500;' : '300;')}
        font-size: calc(17px + 0.1vw);
        cursor: pointer;
    }
`

class TabItem extends Component {
    render() {
        const { onClick, label, active, to } = this.props
        return (
            <Link to={to} onClick={onClick} active={active ? 1 : 0} >
                <label>
                    {label}
                </label>
            </Link>
        )
    }
}

TabItem.propTypes = {
    label: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    to: PropTypes.string.isRequired,
}

TabItem.defaultProps = {
    label: '',
    active: false,
}

export default TabItem
