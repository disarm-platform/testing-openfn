import { alterState } from "./language-common/src";

execute(
  alterState(state => {
    state.data.nothing = !state.data.nothing;
    return state;
  }),
  get('http://localhost:5000/a.json', {}, (state) => {
    return state;
  }),
  alterState((state) => {
    state.data.b = state.data.a;
    return state;
  }),
  alterState((state) => {
    state.data.c = 'sometime';
    return state;
  })
)