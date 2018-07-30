import React from 'react'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import Header from '../../components/Header'

const Wrapper = styled.div`

`


class Playofff extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={3}/>}</Layout.Header>
                <Layout.Content>Playoff</Layout.Content>
            </Layout>
        )
    }
}

export default Playofff
