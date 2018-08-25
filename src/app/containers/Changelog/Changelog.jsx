import React from 'react'
import styled from 'styled-components'

import { RowCSS } from '../../styles'

const Wrapper = styled.div`
    ${RowCSS}
`


class Changelog extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Wrapper>
                <h3>Changelog</h3>
            </Wrapper>
        )
    }
}

export default Changelog
