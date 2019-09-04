export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.find(item => item.name === day);
  // console.log(selectedDays)
  if (state.days.length === 0 || selectedDay === undefined) {
    return []
  }
  const returnedArray = selectedDay.appointments.map(id => state.appointments[id])
  
  // console.log(returnedArray)
  return returnedArray;
}