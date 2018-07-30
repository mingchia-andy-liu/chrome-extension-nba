import React from 'react'
import PropTypes from 'prop-types'
import {Tab, TabItem} from './Tab'

class Header extends React.Component {
    render() {
        const { index } = this.props
        return (
            <React.Fragment>
                <Tab onTabSelect={() => {}} index={index}>
                    <TabItem to="/boxscores" label="Boxscores" />
                    <TabItem to="/options" label="Options" />
                    <TabItem to="/standings" label="Standings" />
                    <TabItem to="/playoff" label="Playoff" />
                </Tab>
            </React.Fragment>
        )
    }
}

Header.propTypes = {
    index: PropTypes.number.isRequired,
}

export default Header
