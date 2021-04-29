import * as React from "react";
import { Config } from "../utils/types";

type prop = {
  active: string;
  callback: (nconf: Config) => void;
};

export const NavBar = ({ active, callback }: prop) => {
  let btnGeneral = (
    <button className="navBar-button" onClick={() => callback({ setting: "currentPage", value: "general" })}>
      General
    </button>
  );
  let btnParty = (
    <button className="navBar-button" onClick={() => callback({ setting: "currentPage", value: "party" })}>
      Party
    </button>
  );
  let btnJobs = (
    <button className="navBar-button" onClick={() => callback({ setting: "currentPage", value: "jobs" })}>
      Jobs
    </button>
  );
  let btnItems = (
    <button className="navBar-button" onClick={() => callback({ setting: "currentPage", value: "items" })}>
      Items
    </button>
  );
  switch (active) {
    case "general": {
      btnGeneral = <button className="navBar-button-active">General</button>;
      break;
    }
    case "party": {
      btnParty = <button className="navBar-button-active">Party</button>;
      break;
    }
    case "jobs": {
      btnJobs = <button className="navBar-button-active">Jobs</button>;
      break;
    }
    case "items": {
      btnItems = <button className="navBar-button-active">Items</button>;
      break;
    }
  }

  return (
    <div className="navBar">
      {btnGeneral}
      {btnParty}
      {btnJobs}
      {btnItems}
    </div>
  );
};

export default NavBar;
