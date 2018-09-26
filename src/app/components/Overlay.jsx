import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`


const Overlay = ({ children, text }) => (
    <Wrapper>
        <h2>{text}</h2>
        {children}
    </Wrapper>
)

Overlay.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.node,
}

Overlay.defaultProps = {
    text: 'Click on a game to see the box scores',
}

export default Overlay
