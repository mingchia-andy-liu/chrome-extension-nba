import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as actions from './actions'

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;

    &::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.7;
    }
`

const Content = styled.div`
    z-index: 500;
`


class Modal extends Component {
    static propTypes = {
        toggleModal: PropTypes.func.isRequired,
        active: PropTypes.bool,
        children: PropTypes.node,
        onClick: PropTypes.func,
        modal: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
    };

    handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.props.toggleModal()

        if (this.props.onClick) {
            this.props.onClick(event)
        }
    }

    render() {
        if (!this.props.active) return null
        return (
            <Wrapper
                onClick={this.handleClick}
            >
                <Content>
                    {this.props.children}
                </Content>
            </Wrapper>
        )
    }
}

export default connect(null, actions)(Modal)
