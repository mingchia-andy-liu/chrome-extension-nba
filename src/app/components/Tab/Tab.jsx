import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import TabItem from './TabItem'
import {RowCSS} from '../../styles'

const Wrapper = styled.div`
    ${RowCSS}
    width: 100%;
    height: 50px;

    a {
        text-decoration: none;
        text-align: center;
        cursor: pointer;
    }
`;


class Tab extends React.Component {
    constructor(props) {
        super(props)

        // this.props.children is an opaque data structure. It can be either an array or a single element.
        let { children, startIndex } = this.props
        if (!children) {
            throw Error('Must contain at least one tab')
        }
        children = Array.isArray(children) ? children : [children]
        const index = startIndex > children.length ? 0 : startIndex
        this.state = {
            selectedIndex: index,
        }
    }

    componentWillReceiveProps({ startIndex }) {
        this.setState({ selectedIndex: startIndex })
    }

    onTabSelect(selectedIndex) {
        this.setState({ selectedIndex })
    }

    renderTab() {
        let children = this.props.children
        children = Array.isArray(children) ? children : [children]
        return children.map((item, index) => (
            <TabItem
                key={`tab-bar-item-${index}`}
                to={item.props.to}
                active={this.state.selectedIndex === index}
                index={index}
                label={item.props.label}
                onClick={() => {this.onTabSelect(index)}}
            />
        ), this)
    }

    render() {
        return (
            <Wrapper data-index={this.state.selectedIndex}>
                {this.renderTab()}
            </Wrapper>
        )
    }
}

Tab.propTypes = {
    /**
     * Children elements of the Tab components, consist of Tab
     */
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    /**
     * Start index of the selected tab, start from 0
     */
    startIndex: PropTypes.number,
}

Tab.defaultProps = {
    startIndex: 0,
}

export default Tab
