import * as React from "react";

type prop = {
  active: string;
  callback: Function;
};

//
//TODO: REFACTOR!!!!!
//
export const NavBar = ({ active, callback }: prop) => {
  let btnGeneral = (
    <button className="navBar-button" onClick={() => callback("currentPage", "General")}>
      General
    </button>
  );
  let btnParty = (
    <button className="navBar-button" onClick={() => callback("currentPage", "Party")}>
      Party
    </button>
  );
  let btnJobs = (
    <button className="navBar-button" onClick={() => callback("currentPage", "Jobs")}>
      Jobs
    </button>
  );
  let btnItems = (
    <button className="navBar-button" onClick={() => callback("currentPage", "Items")}>
      Items
    </button>
  );
  switch (active) {
    case "General": {
      btnGeneral = <button className="navBar-button-active">General</button>;
      break;
    }
    case "Party": {
      btnParty = <button className="navBar-button-active">Party</button>;
      break;
    }
    case "Jobs": {
      btnJobs = <button className="navBar-button-active">Jobs</button>;
      break;
    }
    case "Items": {
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
