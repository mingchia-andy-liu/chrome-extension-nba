import React from 'react';
import ReactDOM from 'react-dom';

// // Create a connection with the background script to handle open and
// // close events.
// browser.runtime.connect();

const styles = {
  container: {
    flex: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
};

ReactDOM.render(
    <div style={styles.container}>Hellow world</div>
    , document.getElementById('app')
)
