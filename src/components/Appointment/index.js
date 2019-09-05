import React from "react";
import Header from "components/Appointment/header";
import Show from "components/Appointment/show";
import Empty from "components/Appointment/empty";
import Status from "components/Appointment/status";
import Confirm from "components/Appointment/confirm";
import Form from "components/Appointment/form";
import "components/Appointment/styles.scss";
import useVisualMode from "../../hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRMING = "CONFIRMING";
  const EDITING = "EDITING";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (name && interviewer) {
      const interview = {
        student: name,
        interviewer
      };
      transition(SAVING)
      props.bookInterview(props.id, interview)
        .then(() => transition(SHOW));
    }
    
  }

  function confirm() {
    transition(CONFIRMING)
  }

  function deleteInterview() {
    const interview = null;
    transition(DELETING)
    props.cancelInterview(props.id, interview)
      .then(() => transition(EMPTY));
  }

  function editInterview(interviewer) {
    transition(SHOW)
    const interview = {
      student: props.name,
      interviewer
    };
    
    props.editInterview(props.id, interview)
      .then(() => transition(SAVING));
  }



  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => confirm()}
          onEdit={() => editInterview()}
        />
      )}

      {mode === CREATE &&
        <Form
          interviewers={props.interviewersForDay}
          onSave={save}
          onCancel={() => back()} />
      }

      {mode === EDITING &&
        <Form
          interviewers={props.interviewersForDay}
          onSave={save}
          onCancel={() => back()} />
      }

      {mode === SAVING && (
        <Status
          message="SAVING"
        />
      )}

      {mode === DELETING && (
        <Status
          message="DELETING"
        />
      )}

      {mode === CONFIRMING && (
        <Confirm
          message={"Delete the appointment?"}
          onConfirm={deleteInterview}
          onCancel={() => back()} />
      )}
    </article>
  )
}