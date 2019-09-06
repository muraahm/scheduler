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
      const newDays = state.days.map((day) => {
        for (let appointmentInDay of day.appointments) {
          let newSpots = day.spots;
          if (appointmentInDay === action.id) {
            const step = {
              'delete': 1,
              'create': -1
            }[action.action]
            console.log("STEEEEEEP",  step)
            newSpots = newSpots + (step || 0)
          }
          day['spots'] = newSpots;
        }
        return day;
      })
      // console.log(newDays);

      return { ...state, appointments: action.value, days: newDays }
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
    console.log("IM BOOKED")
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
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id, action: 'create' });
        // console.log(appointments)
      })
  }
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  function editInterview(id, interview) {
    console.log("IM CALLED")
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
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id });
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
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id, action: 'delete' });
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