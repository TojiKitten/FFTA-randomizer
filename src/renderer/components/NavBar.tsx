import * as React from "react";

type prop = {
  state: string;
  callback: Function;
};

//
//TODO: REFACTOR!!!!!
//
export const NavBar = ({ state, callback }: prop) => {
  let btnGeneral = (
    <button className="navBar-button" onClick={() => callback("General")}>
      General
    </button>
  );
  let btnParty = (
    <button className="navBar-button" onClick={() => callback("Party")}>
      Party
    </button>
  );
  let btnJobs = (
    <button className="navBar-button" onClick={() => callback("Jobs")}>
      Jobs
    </button>
  );
  let btnItems = (
    <button className="navBar-button" onClick={() => callback("Items")}>
      Items
    </button>
  );
  switch (state) {
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
