import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SettingsConsumer } from '../components/Context'
import { Theme } from '../styles'

const Wrapper = styled.div`
  padding: 0 10px;
  color: white;
  background-color: ${(props) => ()};
`


const Hint = ({ text }) => (
    <SettingsConsumer>
        {({state: {dark}}) => (
            <Wrapper> {text} </Wrapper>
        )}
    </SettingsConsumer>
)

Hint.propTypes = {
    text: PropTypes.string.isRequired,
}

Hint.defaultProps = {
    text: '',
}

export default Hint
