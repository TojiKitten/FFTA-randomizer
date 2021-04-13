import * as React from "react";

type prop = {
  state: string;
  callback: Function;
};

//
//TODO: REFACTOR!!!!!
//
export const NavBar = ({ state, callback }: prop) => {
  if (state === "General") {
    return (
      <div className="navBar">
        <button
          className="navBar-button-active"
          onClick={() => callback("General")}
        >
          General
        </button>
        <button className="navBar-button" onClick={() => callback("Party")}>
          Party
        </button>
        <button className="navBar-button" onClick={() => callback("Jobs")}>
          Jobs
        </button>
        <button className="navBar-button" onClick={() => callback("Items")}>
          Items
        </button>
      </div>
    );
  }
  if (state === "Party") {
    return (
      <div className="navBar">
        <button className="navBar-button" onClick={() => callback("General")}>
          General
        </button>
        <button
          className="navBar-button-active"
          onClick={() => callback("Party")}
        >
          Party
        </button>
        <button className="navBar-button" onClick={() => callback("Jobs")}>
          Jobs
        </button>
        <button className="navBar-button" onClick={() => callback("Items")}>
          Items
        </button>
      </div>
    );
  }
  if (state === "Jobs") {
    return (
      <div className="navBar">
        <button className="navBar-button" onClick={() => callback("General")}>
          General
        </button>
        <button className="navBar-button" onClick={() => callback("Party")}>
          Party
        </button>
        <button
          className="navBar-button-active"
          onClick={() => callback("Jobs")}
        >
          Jobs
        </button>
        <button className="navBar-button" onClick={() => callback("Items")}>
          Items
        </button>
      </div>
    );
  }
  if (state === "Items") {
    return (
      <div className="navBar">
        <button className="navBar-button" onClick={() => callback("General")}>
          General
        </button>
        <button className="navBar-button" onClick={() => callback("Party")}>
          Party
        </button>
        <button className="navBar-button" onClick={() => callback("Jobs")}>
          Jobs
        </button>
        <button
          className="navBar-button-active"
          onClick={() => callback("Items")}
        >
          Items
        </button>
      </div>
    );
  }
  return <div className="navBar">ERROR</div>;
};

export default NavBar;
