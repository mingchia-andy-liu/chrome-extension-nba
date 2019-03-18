import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import styled,{ keyframes } from 'styled-components'
import * as actions from './actions'
import modal from './modal'


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
        animation: ${(props) => (props.active ? fadeIn : 'none')} 250ms forwards;
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

class ModalManager extends PureComponent {
    static findModal = (type) => modal[type] || null

    static propTypes = {
        toggleModal: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        type: PropTypes.object.isRequired,
    }

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
        this.props.toggleModal({})
    }

    render() {
        const {isOpen, type: {modalType, payload: {...customProps}}} = this.props
        const modalConstants = ModalManager.findModal(modalType)
        if (modalConstants == null) return null
        const { template: ModalComponent, ...modalProps} = modalConstants
        if (ModalComponent == null) return null


        let content = (<div />)
        if (isOpen) {
            content = (
                <Wrapper
                    onClick={this.handleClick}
                    active={isOpen}
                >
                    <Close onClick={this.handleClick}>X</Close>
                    <Content>
                        <ModalComponent
                            {...modalProps}
                            {...customProps}
                        />
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

const mapStateToProps = ({ modal: {isOpen, type}}) => ({
    isOpen,
    type,
})

export default connect(mapStateToProps, actions)(ModalManager)
