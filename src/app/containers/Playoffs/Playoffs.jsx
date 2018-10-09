import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import PlayoffColumn from '../../components/PlayoffColumn'
import * as actions from './actions'
import {
    westSelector,
    eastSelector,
    finalSelector
} from './selector'

const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

class Playoffs extends React.Component {
    static propTypes = {
        fetchPlayoff: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        west: PropTypes.object,
        east: PropTypes.object,
        final: PropTypes.any,
    }

    static defaultProps = {
        west: {},
        east: {},
        final: [],
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchPlayoff()
        document.title = 'Box Scores | Playoffs'
    }

    renderContent() {
        const { isLoading, west, east, final } = this.props
        if (isLoading) return <Loader />
        return (
            <React.Fragment>
                <ColumnWrapper>
                    <PlayoffColumn
                        title="RD1"
                        series={west.first}
                    />
                    <PlayoffColumn
                        title="RD2"
                        series={west.second}
                    />
                    <PlayoffColumn
                        title="WCF"
                        series={west.final}
                    />
                    <PlayoffColumn
                        title="FIN"
                        series={final}
                    />
                    <PlayoffColumn
                        title="ECF"
                        series={east.final}
                    />
                    <PlayoffColumn
                        title="RD2"
                        series={east.second}
                    />
                    <PlayoffColumn
                        title="RD1"
                        series={east.first}
                    />
                </ColumnWrapper>
            </React.Fragment>
        )
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={2}/>}</Layout.Header>
                <Layout.Content>{this.renderContent()}</Layout.Content>
            </Layout>
        )
    }
}

const mapStateToProps = ({ playoff: {isLoading, series }}) => ({
    isLoading: isLoading,
    west: westSelector(series),
    east: eastSelector(series),
    final: finalSelector(series),
})

export default connect(mapStateToProps, actions)(Playoffs)
