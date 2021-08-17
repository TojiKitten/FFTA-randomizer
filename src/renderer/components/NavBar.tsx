import * as React from "react";
import { Config } from "../utils/types";
import { useRandomizerUpdate, useRandomizer } from "./RandomizerProvider";

type prop = {
  active: string;
  callback: (nconf: Config) => void;
};

export const NavBar = ({ active, callback }: prop) => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const menus = ["general", "party", "jobs", "items", "logbook"];

  return (
    <div className="navBar">
      {menus.map((value) => {
        return (
          <button
            className={
              state.generalSettings.currentPage == value
                ? "navBar-button-active"
                : "navBar-button"
            }
            onClick={(event) => {
              event.preventDefault();
              dispatch({
                type: "generalSettings",
                option: { currentPage: value },
              });
            }}
          >
            {value[0].toUpperCase() + value.substr(1)}
          </button>
        );
      })}
    </div>
  );
};

export default NavBar;
