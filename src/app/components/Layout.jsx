import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: grid;
    grid-template-areas:    "header"
                            "content";
    grid-template-rows: 50px 1fr;
    grid-row-gap: 1em;
`

const HeaderWrapper = styled.div`
    grid-area:    header;
`

const ContentWrapper = styled.div`
    grid-area: content;
    overflow-y: scroll !important;
    padding: 0 10px;
`

const Header = ({children}) => {
    return <HeaderWrapper>{children}</HeaderWrapper>
}
Header.propTypes = {
    children: PropTypes.node,
}

const Content = ({children}) => {
    return <ContentWrapper>{children}</ContentWrapper>
}

Content.propTypes = {
    children: PropTypes.node,
}

class Layout extends React.Component {
    static Header = Header
    static Content = Content

    render() {
        const children = React.Children.map(
            this.props.children,
            child => (
                React.cloneElement(child)
            )
        )

        return (
            <Wrapper> {children} </Wrapper>
        )
    }
}

Layout.propTypes = {
    children: PropTypes.node,
}


export default Layout
