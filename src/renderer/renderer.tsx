/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FileOpener} from './components/FileOpener'
import {FileSaver} from './components/FileSaver'

ReactDOM.render(
  <div className="app">
    <h1>FFTA Randomizer</h1><br />
      <FileOpener />
      <FileSaver />
  </div>,
  document.getElementById('app'),
);
