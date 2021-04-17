// Import the styles here to process them with webpack
import "_public/style.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import MainComponent from "./MainComponent";


ReactDOM.render(
  <MainComponent />,
  document.getElementById("app")
);