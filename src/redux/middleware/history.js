import { get } from 'lodash';
import { DRAFT_CHANGE_FIELD } from '../../actions/entries';
import { LOCAL_HISTORY_APEND } from '../../actions/localHistory';

const historyMiddlware = store => next => (action) => {
  next(action);

  if (get(action, 'type', null) === DRAFT_CHANGE_FIELD) {
    const data = store.getState().entryDraft.toJS();
    const { entry: { collection, newRecord, slug } } = data;

    store.dispatch({
      type: LOCAL_HISTORY_APEND,
      payload: { data, collection, itemId: newRecord ? null : slug },
    });
  }
};

export default historyMiddlware;
