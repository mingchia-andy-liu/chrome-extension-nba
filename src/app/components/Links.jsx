import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink  } from 'react-router-dom'
import {RowCSS, AlignCenter, JustifyCenter} from '../styles'


const Wrapper = styled.div`
    ${RowCSS}
    ${AlignCenter}
    ${JustifyCenter}
    width: 100%;
`;

const Link = styled(RouterLink)`
    ${RowCSS}
    ${AlignCenter}
    padding: 0 5px;
    text-decoration: none;
    border: 0;
    outline: none;
    color: rgb(46, 46, 223);
`;

class Links extends React.Component {
    renderLinks() {

    }

    render() {
        const { location } = this.props
        const hrefs = ['options', 'standings', 'playoff', 'box-score2.html']
        const atags = hrefs.map((element, index) => (
            <Link key={`link-${index}`} to={element}>{element}</Link>
        ))

        return (
            <Wrapper>
                {atags}
            </Wrapper>
        )
    }
}


export default Links
