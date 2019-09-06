import { useEffect, useReducer } from "react";
import axios from "axios";


const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value }
    case SET_APPLICATION_DATA:
      return { ...state, ...action.value }
    case SET_INTERVIEW: {
      return { ...state, appointments: action.value }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
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
    return axios.put('/api/appointments/' + id, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
        console.log(appointments)
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
    return axios.put('/api/appointments/' + id, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
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

    return axios.delete('/api/appointments/' + id, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
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