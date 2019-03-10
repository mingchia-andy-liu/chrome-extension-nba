import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SettingsConsumer, ThemeConsumer } from './Context'

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
        width: 20px;
        height: 20px;
        outline: none;
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
        width: 15px;
        height: 15px;
        margin-right: 10px;
        vertical-align: -3px;
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
        top: 4px;
        left: -2px;
        width: 5px;
        height: 9px;
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
            <div>
                <StyledLabel>
                    <input
                        disabled={disabled}
                        checked={checked}
                        type="checkbox"
                        onChange={onChange}
                    />
                    <span>{text}</span>
                </StyledLabel>
            </div>
        )
    }
}

export const DarkModeCheckbox = () => (
    <ThemeConsumer>
        {({state: { dark }, actions: {updateTheme}}) => (
            <Checkbox checked={dark === true} text="Dark mode" onChange={updateTheme} />
        )}
    </ThemeConsumer>
)

export const NoSpoilerCheckbox = () => (
    <SettingsConsumer>
        {({state: { spoiler }, actions: {updateNoSpoiler}}) => (
            <Checkbox checked={spoiler === true} text="No spoiler" onChange={updateNoSpoiler} />
        )}
    </SettingsConsumer>
)

export const HideZeroRowCheckbox = () => (
    <SettingsConsumer>
        {({state: { hideZeroRow }, actions: {updateHideZeroRow}}) => (
            <Checkbox checked={hideZeroRow === true} text="Hide Player Who Has Not Played" onChange={updateHideZeroRow} />
        )}
    </SettingsConsumer>
)

export const BroadcastCheckbox = () => (
    <SettingsConsumer>
        {({state: { broadcast}, actions: {updateBroadcast}}) => (
            <Checkbox checked={broadcast === true} text="Show Broadcasters" onChange={updateBroadcast} />
        )}
    </SettingsConsumer>
)

export default Checkbox
