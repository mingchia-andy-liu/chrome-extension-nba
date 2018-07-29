import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Tab, TabItem } from './Tab'

const Wrapper = styled.div`
    display: grid;
    grid-template-areas:    "header"
                            "content";
    grid-template-rows: 50px 1fr;
    grid-row-gap: 1em;
    padding: 0 10px;
`
const NavBar = styled.div`
    grid-area:    header;
    background-color: #046fdb;
`

const Content = styled.div`
    grid-area: content;
    overflow-y: scroll !important;
`

class Layout extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedIndex: 0,
        }
    }

    onTabSelect(newIndex) {
        this.setState({ selectedIndex: newIndex })
    }

    render() {
        const { selectedIndex } = this.state
        const { boxscores, options, standings, playoff } = this.props

        const contents = [
            <Content key={'boxscores'}> {boxscores} </Content>,
            <Content key={'options'}> {options} </Content>,
            <Content key={'standings'}> {standings} </Content>,
            <Content key={'playoff'}> {playoff} </Content>
        ]

        return (
            <Wrapper>
                <NavBar>
                    <Tab onTabSelect={this.onTabSelect.bind(this)} index={selectedIndex}>
                        <TabItem to="/boxscores" label="Boxscores" />
                        <TabItem to="/options" label="Options" />
                        <TabItem to="/standings" label="Standings" />
                        <TabItem to="/playoff" label="Playoff" />
                    </Tab>
                </NavBar>
                {contents[selectedIndex]}
            </Wrapper>
        )
    }
}

Layout.propTypes = {
    boxscores: PropTypes.element,
    options: PropTypes.element,
    standings: PropTypes.element,
    playoff: PropTypes.element,
}

Layout.defaultProps = {
    boxscores: <React.Fragment />,
    options: <React.Fragment />,
    standings: <React.Fragment />,
    playoff: <React.Fragment />,
}

export default Layout
