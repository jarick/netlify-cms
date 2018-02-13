import modalsReducer from "../modals";
import { MODALS_SHOW, MODALS_HIDE } from '../../actions/modals';
import { List } from 'immutable';

describe('Modals reducer', () => {
  it('should append modal id to list of open window\'s id ', () => {
    expect(
      modalsReducer(List([]), { type: MODALS_SHOW, payload: 'test' })
    ).toEqual(
      List(['test'])
    );
  });

  it('should remove modal id from list of open window\'s id ', () => {
    expect(
      modalsReducer(List(['test']), { type: MODALS_HIDE, payload: 'test' })
    ).toEqual(
      List([])
    );
  });
});
