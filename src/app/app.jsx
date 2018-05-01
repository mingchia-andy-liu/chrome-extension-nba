import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Card from './components/Card';
import './styles';


// // Create a connection with the background script to handle open and
// // close events.
// browser.runtime.connect();

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

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

ReactDOM.render(
  <div>
    <Card {...game} />
    <Title>Hello World, this is my first styled component!</Title>
  </div>
  , document.getElementById('app')
)
