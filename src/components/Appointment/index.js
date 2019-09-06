import React from "react";
import Header from "components/Appointment/header";
import Show from "components/Appointment/show";
import Empty from "components/Appointment/empty";
import Status from "components/Appointment/status";
import Confirm from "components/Appointment/confirm";
import Error from "components/Appointment/error";
import Form from "components/Appointment/form";
import "components/Appointment/styles.scss";
import useVisualMode from "../../hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const FORM = "FORM";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRMING = "CONFIRMING";
  const EDITING = "EDITING";
  const ERROR_SAVE = "ERROR_SAVE"
  const ERROR_DELETE = "ERROR_DELETE"
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
        .then(() => transition(SHOW))
        .catch(error => transition(ERROR_SAVE, true));
    }
  }

  function confirm() {
    transition(CONFIRMING)
  }

  function deleteInterview() {
    const interview = null;
    transition(DELETING, true)
    props.cancelInterview(props.id, interview)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  function editInterview(interviewer) {
    transition(FORM)
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

      {mode === FORM &&
        <Form
          name={props.interview.student}
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

      {mode === ERROR_SAVE && (
        <Error
          message={"Could not save appointment."}
          onClose={() => back()} />
      )}

      {mode === ERROR_DELETE && (
        <Error
          message={"Could not delete appointment."}
          onClose={() => back()} />
      )}
    </article>
  )

}