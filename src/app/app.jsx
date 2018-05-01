import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';


// // Create a connection with the background script to handle open and
// // close events.
// browser.runtime.connect();

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

ReactDOM.render(
  <Title>Hello World, this is my first styled component!</Title>
  , document.getElementById('app')
)
