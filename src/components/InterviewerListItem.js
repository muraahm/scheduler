import React from "react";
import "components/InterviewerListItem.scss";
let classnames = require('classnames');

export default function InterviewerListItem(props) {
  const InterviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });
  return (
    <li className={InterviewerClass} onClick={props.setInterviewer} >
  <img
    className="interviewers__item-image"
    src={props.avatar}
    alt={props.name}
  />
  {props.selected && props.name}
</li>
  );
}