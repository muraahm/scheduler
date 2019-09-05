import { useState, useEffect } from "react";
import axios from "axios";

export function useApplicationData() {
  const setDay = day => setState({ ...state, day });
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(
    () => {
      Promise.all([
        axios.get('/api/days'),
        axios.get('/api/appointments'),
        axios.get('/api/interviewers')
      ])
        .then((all) => {
          setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
        })
        .catch(function (error) {
        });
    }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
    return axios.put('/api/appointments/' + id, { interview })
      .then(response => {
        setState({ ...state, appointments });
      })
  }

  function editInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
    return axios.put('/api/appointments/' + id, { interview })
      .then(response => {
        setState({ ...state, appointments });
      });
  }

  function cancelInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState({
      ...state,
      appointments
    });
    return axios.delete('/api/appointments/' + id, { interview })
      .then(response => {
        setState({ ...state, appointments });
      });

  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    editInterview
  }
}