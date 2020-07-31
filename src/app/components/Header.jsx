import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Tab, TabLinkItem } from './Tab'
import { noop } from '../utils/common'

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

const Header = ({ index, location: { pathname } }) => {
  return (
    <React.Fragment>
      <Tab onTabSelect={noop} index={index} isLink={true}>
        <TabLinkItem
          to={getDestPath(pathname, '/boxscores')}
          label="Box-scores"
        />
        <TabLinkItem
          to={getDestPath(pathname, '/standings')}
          label="Standings"
        />
        <TabLinkItem to={getDestPath(pathname, '/playoffs')} label="Playoffs" />
        <TabLinkItem to={getDestPath(pathname, '/options')} label="Options" />
      </Tab>
    </React.Fragment>
  )
}

Header.propTypes = {
  index: PropTypes.number.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
}

export default withRouter(Header)
