import React from 'react'
import styled from 'styled-components'
import Layout from '../../components/Layout'

const Wrapper = styled.div`

`


class Changelog extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout boxscores={
                <Wrapper>
                    <h3>Changelog</h3>
                </Wrapper>
            } />
        )
    }
}

export default Changelog
