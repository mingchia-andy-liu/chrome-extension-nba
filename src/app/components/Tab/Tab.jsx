import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
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
`

class Tab extends React.Component {
    constructor(props) {
        super(props)

        // this.props.children is an opaque data structure. It can be either an array or a single element.
        const { index } = this.props
        let { children } = this.props
        if (!children) {
            throw Error('Must contain at least one tab')
        }
        children = Array.isArray(children) ? children : [children]
        this.state = {
            selectedIndex: index > children.length ? 0 : index,
        }
    }

    renderTabs() {
        const { children, onTabSelect, isLink } = this.props
        const childrenWithProps = React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
                key : `tab-bar-item-${index}`,
                to : isLink ? child.props.to : undefined,
                active : this.state.selectedIndex === index,
                label : child.props.label,
                onClick : () => onTabSelect(index),
            })
        )

        return childrenWithProps
    }

    render() {
        return (
            <Wrapper data-index={this.state.selectedIndex}>
                {this.renderTabs()}
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
