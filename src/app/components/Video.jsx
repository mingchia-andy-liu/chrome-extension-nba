import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mediaQuery } from '../styles'


const IFrame = styled.iframe`
    width: 60vw;
    height: calc(60vw * 0.56);

    ${mediaQuery`
        width: 90vw;
        height: calc(90vw * 0.56);
    `}
`


class Video extends React.Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
    }

    render() {
        return (
            <IFrame src={this.props.src} allowFullScreen={true} frameBorder="0"></IFrame>

        )
    }
}


export default Video
