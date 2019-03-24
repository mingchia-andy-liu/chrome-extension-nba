import React from 'react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Sidebar from '../Sidebar'
import BoxScoresDetails from '../BoxScoresDetails'
import { Wrapper } from './styles'


class BoxScores extends React.PureComponent {
    constructor(props) {
        super(props)
        document.title = 'Box Scores | Box-scores'
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={0}/>}</Layout.Header>
                <Layout.Content>
                    <Wrapper>
                        <Sidebar />
                        <BoxScoresDetails />
                    </Wrapper>
                </Layout.Content>
            </Layout>
        )
    }
}

export default BoxScores
