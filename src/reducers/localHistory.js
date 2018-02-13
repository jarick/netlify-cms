import { Record, List } from 'immutable';
import moment from 'moment';
import { isEqual } from 'lodash';
import { LOCAL_HISTORY_APEND, LOCAL_HISTORY_REVERT } from '../actions/localHistory';
import { MAX_HISTORE_ITEM, MAX_MINUTES_SAVE_LUG } from '../constants/history';

export const LocalHistory = Record({
  collection: '',
  itemId: null,
  data: {},
  revert: false,
  startDate: '',
  editDate: '',
});

const localHistoryReducer = (state = List(), action) => {
  switch (action.type) {
    case LOCAL_HISTORY_APEND: {
      let result;
      const { data, collection, itemId } = action.payload;
      const last = state.last();

      if (last) {
        if (
          last.get('collection') === collection
          && last.get('itemId', null) === itemId
        ) {
          if (isEqual(last.get('data', {}), data)) {
            result = state;
          } else {
            const timeX = moment(last.get('startDate')).add(MAX_MINUTES_SAVE_LUG, 'm');
            if (moment().isSameOrBefore(timeX)) {
              result = state.update(-1, () => (
                last.withMutations((s) => {
                  s.set('editDate', moment().toISOString());
                  s.set('data', data);
                })
              ));
            }
          }
        }
      }

      if (!result) {
        const item = new LocalHistory({
          data,
          collection,
          itemId,
          startDate: moment().toISOString(),
          editDate: moment().toISOString(),
        });
        result = state.push(item).slice(-MAX_HISTORE_ITEM);
      }

      return result;
    }
    case LOCAL_HISTORY_REVERT: {
      const { index } = action.payload;
      const item = state.get(index).withMutations((s) => {
        s.set('revert', true);
        s.set('startDate', moment().toISOString());
        s.set('editDate', moment().toISOString());
      });

      return state.push(item.set('revert', true)).slice(-MAX_HISTORE_ITEM);
    }
    default:
      return state;
  }
};

export default localHistoryReducer;
