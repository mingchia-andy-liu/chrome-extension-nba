import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import styled,{ keyframes } from 'styled-components'
import * as actions from './actions'


const fadeIn = keyframes`
  from {
    background-color: transparent;
    opacity: 0;
  }
  to {
    background-color: #000;
    opacity: 0.7;
  }
`

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: ${(props) => (props.active ? 100 : -1)};
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
        animation: ${(props) => (props.active ? fadeIn : 'none')} 1s forwards;
    }
`

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
`

const Close = styled.div`
    color: #fff;
    position: fixed;
    top: 1%;
    right: 3%;
    font-size: calc(12px + 1vw);
    z-index: 500;
    cursor: pointer;
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

    constructor(props) {
        super(props)
        this.el = document.createElement('div')
    }

    componentDidMount() {
        document.body.appendChild(this.el)
    }

    componentWillUnmount() {
        document.body.removeChild(this.el)
    }

    handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.props.toggleModal()

        if (this.props.onClick) {
            this.props.onClick(event)
        }
    }

    render() {
        let content = (<div />)
        if (this.props.active) {
            content = (
                <Wrapper
                    onClick={this.handleClick}
                    active={this.props.active}
                >
                    <Close onClick={this.handleClick}>X</Close>
                    <Content>
                        {this.props.children}
                    </Content>
                </Wrapper>
            )
        }

        return ReactDOM.createPortal(
            content,
            this.el,
        )
    }
}

export default connect(null, actions)(Modal)
