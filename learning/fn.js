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
  //   state.data.goodbye = 'goodbye';
  //   return state;
  // }),
  get(state.configuration.remote_url, state.configuration.remote_params, (state) => {
    return state;
  })
)


// get('http://localhost:5000/a.json', {}, (state) => {
//   return state;
// })
