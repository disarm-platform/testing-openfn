import { alterState } from "./language-common/src";

execute(
  // alterState(state => {
  //   state.data.first = 'first';
  //   return state;
  // }),
  // get(state.configuration.remote_url, {}, (state) => {
  //   return state;
  // }),
  // alterState((state) => {
  //   // state.data.goodbye = 'goodbye';
  //   state.data.remote_url = 'http://localhost:5000/b.json';
  //   return state;
  // }),
  get(state.configuration.remote_url, {}, state => {
    // return Promise.resolve(state);
    return new Promise((resolve, reject) => {
      get(state.configuration.remote_url, {}, state => {
      })
      resolve(state);
    });
  })
)


// get('http://localhost:5000/a.json', {}, (state) => {
//   return state;
// })
