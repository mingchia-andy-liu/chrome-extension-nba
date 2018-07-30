import React from 'react'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import Header from '../../components/Header'

const Wrapper = styled.div`

`


class Standings extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={2}/>}</Layout.Header>
                <Layout.Content>Standings</Layout.Content>
            </Layout>
        )
    }
}

export default Standings
