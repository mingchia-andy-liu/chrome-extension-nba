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

class Playoff extends React.Component {
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
    }

    renderContent() {
        const { isLoading, west, east, final } = this.props
        if (isLoading) return <Loader />
        return (
            <React.Fragment>
                <ColumnWrapper>
                    <PlayoffColumn
                        title="Round 1"
                        series={west.first}
                    />
                    <PlayoffColumn
                        title="Round 2"
                        series={west.second}
                    />
                    <PlayoffColumn
                        title="Conf Final"
                        series={west.final}
                    />
                    <PlayoffColumn
                        title="Final"
                        series={final}
                    />
                    <PlayoffColumn
                        title="Conf Final"
                        series={east.final}
                    />
                    <PlayoffColumn
                        title="Round 2"
                        series={east.second}
                    />
                    <PlayoffColumn
                        title="Round 1"
                        series={east.first}
                    />
                </ColumnWrapper>
            </React.Fragment>
        )
    }

    render() {
        return (
            <Layout>
                <Layout.Header>{<Header index={3}/>}</Layout.Header>
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

export default connect(mapStateToProps, actions)(Playoff)
