import React from 'react'
import styled from 'styled-components'
import Card from '../components/Card'

const game = {
    hta: "PHI",
    htn: "76ers",
    vta: "BOS",
    vtn: "Boston",
    hs: 110,
    vs: 119,
    series: "BOS leads series 1-0",
    clk: "00:00.0",
    stt: "Final",
}


class PopUp extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Card {...game} />
        )
    }
}

export default PopUp
