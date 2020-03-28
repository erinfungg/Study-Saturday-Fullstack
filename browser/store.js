import { createStore, applyMiddleware } from "redux";
import axios from "axios";
import loggingMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

//ACTION TYPES
const GOT_STUDENTS = "GOT_STUDENTS";
const ADDED_STUDENT = "ADDED_STUDENT";

//ACTION CREATORS
const gotStudents = students => ({
  type: GOT_STUDENTS,
  students
});

const addedStudent = student => ({
  type: ADDED_STUDENT,
  student
});

//THUNKS
export const getStudents = () => async dispatch => {
  try {
    const { data } = await axios.get("/student");
    dispatch(gotStudents(data));
  } catch (err) {
    console.error(err);
  }
};

export const addStudent = newStudent => async dispatch => {
  try {
    const { data } = await axios.post("/student", newStudent);
    console.log(data);
    dispatch(addedStudent(data));
  } catch (error) {
    console.log("error posting new student: ", error);
  }
};

const initialState = {
  students: []
};

//REDUCER
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_STUDENTS:
      return { students: action.students };
    case ADDED_STUDENT:
      return { students: [...state.students, action.student] };
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(
      // `withExtraArgument` gives us access to axios in our async action creators!
      // https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument
      thunkMiddleware.withExtraArgument({ axios }),
      loggingMiddleware
    )
  )
);

export default store;
