import React from 'react'
import styled from 'styled-components'
import {RowCSS, AlignCenter, JustifyCenter} from '../styles'
import browser from '../utils/browser'


const Wrapper = styled.div`
    ${RowCSS}
    ${AlignCenter}
    ${JustifyCenter}
    width: 100%;
    margin-bottom: 10px;
`

const Link = styled.a`
    ${RowCSS}
    ${AlignCenter}
    padding: 0 5px;
    text-decoration: none;
    border: 0;
    outline: none;
    color: rgb(46, 46, 223);
`

class Links extends React.Component {
    renderLinks() {

    }

    render() {
        const links = ['options', 'standings', 'playoff', 'box-scores']
        const hrefs = ['options', 'standings', 'playoff', 'boxscores']
        const atags = links.map((element, index) => (
            <Link
                key={`link-${index}`}
                onClick={() => {
                    browser.tabs.create({ url: `/index.html#/${hrefs[index]}` })
                }}
            >
                {element}
            </Link>
        ))

        return (
            <Wrapper>
                {atags}
            </Wrapper>
        )
    }
}


export default Links
