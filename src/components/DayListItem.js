import React from "react";
import "components/DayListItem.scss";
let classnames = require('classnames');

export default function DayListItem(props) {
  const formatSpots = (value) => {
    if (value === 0) {
      return "no spots remaining";
    }
    if (value === 1) {
      return "1 spot remaining";
    }
    if (value === 2) {
      return "2 spots remaining";
    }
    if (value === 3) {
      return "3 spots remaining";
    }
    if (value === 4) {
      return "4 spots remaining";
    }
    if (value === 5) {
      return "5 spots remaining";
    }
  }
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  }); 
  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
