function getAppointmentsForDay(state, day) {
  let results = []
  const selectedDay = state.days.find(item => item.name === day);
  if (state.days.length === 0 || selectedDay === undefined) {
    return results
  }
  const returnedArray = selectedDay.appointments.map(id => state.appointments[id])
  return returnedArray;
}


function getInterview(state, interview) {
  // console.log(state.appointments["2"].interview)
  // console.log(interview.interviewers)
  if (!interview) {
    return null
  }
  const intervirewersObj = Object.values(state.interviewers)
  const selectedInterview = intervirewersObj.find(interviewer => interviewer.id === interview.interviewer);
  const result = {student : interview.student, interviewer: selectedInterview}
  
  return result;
}

function getInterviewersForDay(state, day) {
  let results = []
  const selectedDay = state.days.find(item => item.name === day);
  if (state.days.length === 0 || selectedDay === undefined) {
    return results
  }
  // console.log(selectedDay);
  const returnedArray = selectedDay.interviewers.map(id => state.interviewers[id])
  // console.log(returnedArray)
  return returnedArray;
}

module.exports = { getAppointmentsForDay, getInterview, getInterviewersForDay }