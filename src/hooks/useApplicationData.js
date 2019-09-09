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
      const newAppointment = state["appointments"];
      const newDays = state.days.map((day) => {
        for (let appointmentInDay of day.appointments) {
          let newSpots = day.spots;
          if (appointmentInDay === action.id) {
            const step = {
              'delete': 1,
              'create': -1
            }[action.action]
            newSpots = newSpots + (step || 0)
          }
          day['spots'] = newSpots;
        }
        return day;
      })
      newAppointment[action.id]["interview"] = action.interview;

      return { ...state, appointments: newAppointment, days: newDays }
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


  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = () => {
      socket.send('ping');
    };
    socket.onmessage = (message) => {
      const eventData = JSON.parse(message.data);
      if (eventData.type === SET_INTERVIEW) {
        if(eventData.interview !== null) {
          const action = 'create';
          dispatch({ type: SET_INTERVIEW, id: eventData.id, interview: eventData.interview, action: action });
        }
        if(eventData.interview === null) {
          const action = 'delete';
          dispatch({ type: SET_INTERVIEW, id: eventData.id, interview: eventData.interview, action: action });
        }
        
      }
    };
  }, []);


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
    return axios.put('/api/appointments/' + id, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id, interview });
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
        dispatch({ type: SET_INTERVIEW, value: appointments, id: id });
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