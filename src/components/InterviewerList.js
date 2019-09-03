import React, { useState } from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";


export default function InterviewerList(props) {
  const interviewers = props.interviewers;
  const [selectedInterviewer, setInterviewer] = useState(null)
  const interviewersList = interviewers.map((interviewer) => (
    <InterviewerListItem
      id={interviewer.id}
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === selectedInterviewer}
      setInterviewer={setInterviewer}
    />
  ));

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersList}</ul>
    </section>
  );
}
