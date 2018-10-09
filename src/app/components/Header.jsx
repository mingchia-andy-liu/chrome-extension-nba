import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {Tab, TabItem} from './Tab'

/**
 * Get the destination path for tabs. To prevent React complaining about
 * to the same path. Prevent the default action if it's the same
 * @param {string} current
 * @param {string} dest
 */
const getDestPath = (current, dest) => {
    if (current.startsWith(dest)) return ''
    else return dest
}

class Header extends React.Component {
    render() {
        const { index, location: { pathname } } = this.props
        return (
            <React.Fragment>
                <Tab onTabSelect={() => {}} index={index}>
                    <TabItem
                        to={getDestPath(pathname, '/boxscores')}
                        label="Box-scores"
                    />
                    <TabItem
                        to={getDestPath(pathname, '/standings')}
                        label="Standings"
                    />
                    <TabItem
                        to={getDestPath(pathname, '/playoffs')}
                        label="Playoffs"
                    />
                    <TabItem
                        to={getDestPath(pathname, '/options')}
                        label="Options"
                    />
                </Tab>
            </React.Fragment>
        )
    }
}

Header.propTypes = {
    index: PropTypes.number.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}

export default withRouter(Header)
