import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { RowCSS } from '../../styles'

const Wrapper = styled.div`
  ${RowCSS}
  width: 100%;
  height: 50px;

  a {
    text-decoration: none;
    text-align: center;
    cursor: pointer;
  }
`

const Tab = ({ index, children, onTabSelect, isLink } = { children: [] }) => {
  const childrenArray = Array.isArray(children)
    ? children
    : [children]
  const selectedIndex = index > childrenArray.length
    ? 0
    : index

  const renderTabs = () => {
    const childrenWithProps = React.Children.map(children, (child, i) =>
      React.cloneElement(child, {
        key: `tab-bar-item-${i}`,
        to: isLink ? child.props.to : undefined,
        active: selectedIndex === i,
        label: child.props.label,
        onClick: () => onTabSelect(i),
      })
    )

    return childrenWithProps
  }

  return (
    <Wrapper data-index={selectedIndex}>
      {renderTabs()}
    </Wrapper>
  )
}

Tab.propTypes = {
  /**
   * Children elements of the Tab components, consist of Tab
   */
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  /**
   * Start index of the selected tab, starts from 0
   */
  index: PropTypes.number,
  /**
   * on Tab Select Callback
   */
  onTabSelect: PropTypes.func.isRequired,
  /**
   * Are children links
   */
  isLink: PropTypes.bool.isRequired,
}

export default Tab
