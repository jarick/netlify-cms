const historyMiddlware = (store, action) => {
  console.log('dispatching', action);
  store.dispatch(action);
  console.log('next state', store.getState());
};

export default historyMiddlware;
