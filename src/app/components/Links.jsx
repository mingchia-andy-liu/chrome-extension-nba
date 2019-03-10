import React from 'react'
import styled from 'styled-components'
import {RowCSS, AlignCenter, JustifyCenter} from '../styles'
import browser from '../utils/browser'
import { ThemeConsumer } from './Context'


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
    color: ${(props) => (props.dark ? '#7cc7f1' : 'rgb(46, 46, 223)')};
    cursor: pointer;
`

class Links extends React.PureComponent {
    render() {
        const links = ['Box-scores', 'Standings', 'Playoffs', 'Options']
        const hrefs = ['boxscores', 'standings', 'playoffs', 'options']
        const atags = links.map((element, index) => (
            <ThemeConsumer key={`link-${index}`}>
                {({ state: { dark } }) => (
                    <Link
                        dark={dark}
                        onClick={() => {
                            browser.tabs.create({ url: `/index.html#/${hrefs[index]}` })
                            window.close()
                        }}
                    >
                        {element}
                    </Link>
                )}
            </ThemeConsumer>
        ))

        return (
            <Wrapper>
                {atags}
            </Wrapper>
        )
    }
}


export default Links
