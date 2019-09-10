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
      let appointment = {}
      if (action.interview) {
        appointment = { ...state.appointments[action.id], interview: { ...action.interview } }
      } else {
        appointment = { ...state.appointments[action.id], interview: action.interview }
      }
      const appointments = { ...state.appointments, [action.id]: appointment }
      const daysArray = state.days.map((day) => {
        for (let appointment of day.appointments) {
          if (action.id === appointment) {
            if (action.interview && !state.appointments[action.id].interview) {
              return { ...day, spots: day.spots - 1 };
            } else if (
              !action.interview &&
              state.appointments[action.id].interview) {
              return { ...day, spots: day.spots + 1 };
            }
          }
        }
        return day
      })
      // newAppointments[action.id]["interview"] = action.interview;

      return { ...state, appointments: appointments, days: daysArray }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

 export { reducer, SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW };