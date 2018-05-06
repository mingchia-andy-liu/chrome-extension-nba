import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    /* background-color: rgba(10, 40, 70, 0.9); */
    width: 100%;
    height: 100%;
    /* color: white; */
`


const Overlay = ({ text }) => (
    <Wrapper >
        <h2>{text}</h2>
    </Wrapper>
)

Overlay.propTypes = {
    text: PropTypes.string.isRequired,
}

Overlay.defaultProps = {
    text: 'Game has not started yet',
}

export default Overlay
