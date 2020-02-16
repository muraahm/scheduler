import { useEffect, useReducer } from "react";
import axios from "axios";
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";


export function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = () => {
      socket.send('ping');
    };
    socket.onmessage = (message) => {
      const eventData = JSON.parse(message.data);
      if (eventData.type === SET_INTERVIEW) {
        if (eventData.interview !== null) {
          dispatch({ type: SET_INTERVIEW, id: eventData.id, interview: eventData.interview });
        }
        if (eventData.interview === null) {
          dispatch({ type: SET_INTERVIEW, id: eventData.id, interview: eventData.interview });
        }

      }
    };
  }, []);


  useEffect(
    () => {
      Promise.all([
        axios.get(`/api/days`),
        axios.get(`/api/appointments`),
        axios.get(`/api/interviewers`)
      ])
        .then((all) => {
          dispatch({
            type: SET_APPLICATION_DATA,
            value: {
              days: all[0].data,
              appointments: all[1].data,
              interviewers: all[2].data
            }
          });
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
    return axios.put(`/api/appointments/` + id, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id, interview });
      })
  }
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  function editInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/` + id, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id, interview });
      })
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

    return axios.delete(`/api/appointments/` + id, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id });
      })

  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    editInterview
  }
}