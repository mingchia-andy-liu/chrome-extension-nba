import React from 'react'
import styled from 'styled-components'
import {RowCSS, AlignCenter, JustifyCenter} from '../styles'
import browser from '../utils/browser'
import { SettingsConsumer } from './Context'


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
    color: ${(props) => (props.dark ? '#5188ff' : 'rgb(46, 46, 223)')};
    cursor: pointer;
`

class Links extends React.Component {
    renderLinks() {

    }

    render() {
        const links = ['options', 'standings', 'playoff', 'box-scores']
        const hrefs = ['options', 'standings', 'playoff', 'boxscores']
        const atags = links.map((element, index) => (
            <SettingsConsumer key={`link-${index}`}>
                {({ state: { dark } }) => (
                    <Link
                        dark={dark}
                        onClick={() => {
                            browser.tabs.create({ url: `/index.html#/${hrefs    [index]}` })
                            window.close()
                        }}
                    >
                        {element}
                    </Link>
                )}
            </SettingsConsumer>
        ))

        return (
            <Wrapper>
                {atags}
            </Wrapper>
        )
    }
}


export default Links
