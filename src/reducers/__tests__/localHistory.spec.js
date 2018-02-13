import { List } from 'immutable';
import moment from 'moment';
import { assign } from 'lodash';
import localHistoryReducer, { LocalHistory } from '../localHistory';
import { LOCAL_HISTORY_APEND, LOCAL_HISTORY_REVERT } from '../../actions/localHistory';
import * as constants from '../../constants/history';

describe('Local History', () => {
  it('should add new history item in store after 5 minutes', () => {
    Date.now = jest.fn(() => new Date('2018-02-12T00:05:01.000Z').getTime());
    const payload = {
      collection: 'test',
      itemId: null,
      data: { test: 'test' },
    };
    const item = new LocalHistory(assign({}, payload, {
      data: { test: 'test2' },
      startDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
    }));
    constants.MAX_MINUTES_SAVE_LUG = 5;
    constants.MAX_HISTORE_ITEM = 5;
    expect(
      localHistoryReducer(new List([item]), { type: LOCAL_HISTORY_APEND, payload })
    ).toEqual(
      List([item, new LocalHistory(assign({}, payload, {
        startDate: moment('2018-02-12T00:05:01.000Z').toISOString(),
        editDate: moment('2018-02-12T00:05:01.000Z').toISOString(),
      }))])
    );
  });

  it('should add new history item in store after 5 minutes and slice old history', () => {
    Date.now = jest.fn(() => new Date('2018-02-12T00:05:01.000Z').getTime());
    const payload = {
      collection: 'test',
      itemId: null,
      data: { test: 'test' },
    };
    const item = new LocalHistory(assign({}, payload, {
      data: { test: 'test2' },
      startDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
    }));
    constants.MAX_MINUTES_SAVE_LUG = 5;
    constants.MAX_HISTORE_ITEM = 1;
    expect(
      localHistoryReducer(new List([item]), { type: LOCAL_HISTORY_APEND, payload })
    ).toEqual(
      List([new LocalHistory(assign({}, payload, {
        startDate: moment('2018-02-12T00:05:01.000Z').toISOString(),
        editDate: moment('2018-02-12T00:05:01.000Z').toISOString(),
      }))])
    );
  });

  it('should add new history item in store for new collection', () => {
    Date.now = jest.fn(() => new Date('2018-02-12T00:04:00.000Z').getTime());
    const payload = {
      collection: 'test',
      itemId: null,
      data: { test: 'test' },
    };
    const item = new LocalHistory(assign({}, payload, {
      data: { test: 'test2' },
      collection: 'test2',
      startDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
    }));
    constants.MAX_MINUTES_SAVE_LUG = 5;
    constants.MAX_HISTORE_ITEM = 5;
    expect(
      localHistoryReducer(new List([item]), { type: LOCAL_HISTORY_APEND, payload })
    ).toEqual(
      new List([item, new LocalHistory(assign({}, payload, {
        startDate: moment('2018-02-12T00:04:00.000Z').toISOString(),
        editDate: moment('2018-02-12T00:04:00.000Z').toISOString(),
      }))])
    );
  });

  it('should add new history item in store for new item', () => {
    Date.now = jest.fn(() => new Date('2018-02-12T00:04:00.000Z').getTime());
    const payload = {
      collection: 'test',
      itemId: null,
      data: { test: 'test' },
    };
    const item = new LocalHistory(assign({}, payload, {
      data: { test: 'test2' },
      itemId: 'test',
      startDate: moment('2018-02-12T00:00:01.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:01.000Z').toISOString(),
    }));
    constants.MAX_MINUTES_SAVE_LUG = 5;
    constants.MAX_HISTORE_ITEM = 5;
    expect(
      localHistoryReducer(new List([item]), { type: LOCAL_HISTORY_APEND, payload })
    ).toEqual(
      new List([item, new LocalHistory(assign({}, payload, {
        startDate: moment('2018-02-12T00:04:00.000Z').toISOString(),
        editDate: moment('2018-02-12T00:04:00.000Z').toISOString(),
      }))])
    );
  });

  it('should edit last history item in store edit 5 minutes', () => {
    Date.now = jest.fn(() => new Date('2018-02-12T00:05:00.000Z').getTime());
    const payload = {
      collection: 'test',
      itemId: null,
      data: { test: 'test' },
    };
    const item1 = new LocalHistory(assign({}, payload, {
      data: { test: 'test2' },
      startDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
    }));
    const item2 = new LocalHistory(assign({}, payload, {
      data: { test: 'test2' },
      startDate: moment('2018-02-12T00:00:01.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:01.000Z').toISOString(),
    }));
    constants.MAX_MINUTES_SAVE_LUG = 5;
    constants.MAX_HISTORE_ITEM = 5;
    expect(
      localHistoryReducer(new List([item1, item2]), { type: LOCAL_HISTORY_APEND, payload })
    ).toEqual(
      new List([item1, new LocalHistory(assign({}, payload, {
        startDate: moment('2018-02-12T00:00:01.000Z').toISOString(),
        editDate: moment('2018-02-12T00:05:00.000Z').toISOString(),
      }))])
    );
  });

  it('should not modify history if change and last history item is equals', () => {
    Date.now = jest.fn(() => new Date('2018-02-12T00:05:01.000Z').getTime());
    const payload = {
      collection: 'test',
      itemId: null,
      data: { test: 'test' },
    };
    const item = new LocalHistory(assign({}, payload, {
      startDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
    }));
    constants.MAX_MINUTES_SAVE_LUG = 5;
    constants.MAX_HISTORE_ITEM = 5;
    expect(
      localHistoryReducer(new List([item]), { type: LOCAL_HISTORY_APEND, payload })
    ).toEqual(
      new List([item])
    );
  });

  it('should revert item from history', () => {
    Date.now = jest.fn(() => new Date('2018-02-12T00:05:01.000Z').getTime());
    const payload = { index: 1 };
    const item1 = new LocalHistory(assign({}, payload, {
      collection: 'test',
      itemId: null,
      data: { test: 'test1' },
      startDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:00.000Z').toISOString(),
    }));
    const item2 = new LocalHistory(assign({}, payload, {
      collection: 'test',
      itemId: null,
      data: { test: 'test2' },
      startDate: moment('2018-02-12T00:00:01.000Z').toISOString(),
      editDate: moment('2018-02-12T00:00:01.000Z').toISOString(),
    }));
    constants.MAX_MINUTES_SAVE_LUG = 5;
    constants.MAX_HISTORE_ITEM = 5;
    expect(
      localHistoryReducer(new List([item1, item2]), { type: LOCAL_HISTORY_REVERT, payload })
    ).toEqual(
      new List([item1, item2, new LocalHistory({
        collection: 'test',
        itemId: null,
        data: { test: 'test2' },
        revert: true,
        startDate: moment('2018-02-12T00:05:01.000Z').toISOString(),
        editDate: moment('2018-02-12T00:05:01.000Z').toISOString(),
      })])
    );
  });
});
