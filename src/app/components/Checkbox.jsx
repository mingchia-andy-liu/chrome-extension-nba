import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const Wrapper = styled.div`
    padding: 10px 0;
`

const StyledLabel = styled.label`
    position: relative;
    cursor: pointer;

    & > input {
        appearance: none;
        position: absolute;
        z-index: -1;
        left: -16px;
        top: -19px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        outline: none;
        opacity: 0;
        transform: scale(1);
        transition: opacity 1s, transform 1s;
    }

    & > input:checked {
        background-color: #046fdb;
    }

    &:active > input {
        opacity: 1;
        transform: scale(0);
        transition: opacity 0s, transform 0s;
    }

    & > input:disabled {
        opacity: 0;
    }

    & > input:disabled + span {
        color: hsl(0, 0%, 50%);
        cursor: initial;
    }

    & > span::before {
        content: "";
        display: inline-block;
        border: solid 2px hsl(0, 0%, 50%);
        border-radius: 2px;
        width: 20px;
        height: 20px;
        margin-right: 10px;
        vertical-align: -5px;
        transition: border-color 1s;
    }

    & > input:checked + span::before {
        border-color: #046fdb;
        background-color: #046fdb;
    }

    & > input:active + span::before {
        border-color: #046fdb;
    }

    & > input:checked:active + span::before {
        border-color: transparent;
    }

    & > input:disabled + span::before {
        border-color: hsl(0, 0%, 50%);
    }

    & > input:checked:disabled + span::before {
        background-color: #6badff;
    }

    & > input:disabled + span {
        cursor: not-allowed;
    }

    & > input:checked:disabled + span::before {
        border-color: transparent;
    }

    & > span::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 7px;
        height: 14px;
        border-right: solid 2px transparent;
        border-bottom: solid 2px transparent;
        transform: translate(8px, -4px) rotate(45deg);
    }

    & > input:checked + span::after {
        border-color: #fff;
    }
`

class Checkbox extends React.PureComponent {
    static propTypes = {
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        text: PropTypes.string,
    }

    static defaultProps = {
        checked: false,
        disabled: false,
        onChange: () => {},
    }

    render() {
        const {checked, disabled, onChange, text} = this.props
        return (
            <Wrapper>
                <StyledLabel>
                    <input disabled={disabled} checked={checked} type="checkbox" onChange={onChange}/>
                    <span>{text}</span>
                </StyledLabel>
            </Wrapper>
        )
    }
}

export default Checkbox
