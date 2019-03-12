import React, { Component } from 'react'
import {Link as RouterLink} from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ThemeConsumer } from '../Context'
import { ColumnCSS, AlignCenter, JustifyCenter } from '../../styles'


const Link = styled(RouterLink)`
    ${ColumnCSS}
    ${AlignCenter}
    ${JustifyCenter}
    width: 100%;
    height: 100%;
    padding: 10px;
    background-color: ${(props) => (props.dark ? '#2963FF' : '#046fdb')};
    border-bottom: 4px solid ${(props) => (props.active ? ((props.dark ? '#92CBF7' : '#81D3FA')) : (props.dark ? '#2963FF' : '#046fdb'))};

    &:hover {
        font-weight: 400;
    }

    & > label {
        color: ${(props) => (props.active ? '#fff' : 'hsl(0, 0%, 80%)')};
        font-weight: ${(props) => (props.active ? '500' : '300')};
        font-size: calc(17px + 0.1vw);
        cursor: pointer;
    }
`

class TabItem extends Component {
    render() {
        const { onClick, label, active, to } = this.props
        return (
            <ThemeConsumer>
                {({state: {dark}}) => (
                    <Link
                        to={to}
                        onClick={(e) => {
                            // Prevent React error, prevent default if the same path
                            if (to === '') e.preventDefault()
                            else onClick(e)
                        }}
                        active={active ? 1 : undefined}
                        dark={dark ? 1 : undefined}
                    >
                        <label>
                            {label}
                        </label>
                    </Link>
                )}
            </ThemeConsumer>
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
