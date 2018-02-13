import { List } from 'immutable';
import { MODALS_SHOW, MODALS_HIDE } from '../actions/modals';

const modalsReducer = (state = List(), action) => {
  switch (action.type) {
    case MODALS_SHOW:
      return state.push(action.payload);
    case MODALS_HIDE:
      return state.filter(w => w !== action.payload);
    default:
      return state;
  }
};

export default modalsReducer;
