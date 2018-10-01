import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Row, ColumnCSS, mediaQuery } from '../../styles'

import data from './data.js'

const Wrapper = styled.div`
    ${ColumnCSS}
    padding: 0 20%;
    ${mediaQuery`
        padding: 0 10px;
    `}
`

const RouterLink = styled(Link)`
    text-decoration: none;
    border: 0;
    outline: none;
    color: ${(props) => (props.dark ? '#5188ff' : 'rgb(46, 46, 223)')};
    cursor: pointer;
`

const Arrow = styled.img`
    width: 50px;
    height: 50px;
`


class Changelog extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = 'Box Scores | Changelog'
    }

    render() {
        return (
            <Wrapper>
                <Row alignCenter={true}>
                    <RouterLink to="options">
                        <Arrow src="../../assets/png/arrow-left.png" />
                    </RouterLink>
                    <h1>Changelog</h1>
                </Row>
                {
                    data.map(({version, updates}) => (
                        <div key={version}>
                            <h2>{version}</h2>
                            <ul>
                                {updates.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                }
            </Wrapper>
        )
    }
}

export default Changelog
