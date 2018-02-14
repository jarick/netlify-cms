import { Map, List, fromJS } from 'immutable';
import {
  DRAFT_CREATE_FROM_ENTRY,
  DRAFT_CREATE_EMPTY,
  DRAFT_DISCARD,
  DRAFT_CHANGE_FIELD,
  DRAFT_VALIDATION_ERRORS,
  ENTRY_PERSIST_REQUEST,
  ENTRY_PERSIST_SUCCESS,
  ENTRY_PERSIST_FAILURE,
  ENTRY_DELETE_SUCCESS,
} from '../actions/entries';
import {
  UNPUBLISHED_ENTRY_PERSIST_REQUEST,
  UNPUBLISHED_ENTRY_PERSIST_SUCCESS,
  UNPUBLISHED_ENTRY_PERSIST_FAILURE,
} from '../actions/editorialWorkflow';
import {
  ADD_ASSET,
  REMOVE_ASSET,
} from '../actions/media';

const initialState = Map({
  entry: Map(),
  mediaFiles: List(),
  fieldsMetaData: Map(),
  fieldsErrors: Map(),
  hasChanged: false,
});

const entryDraftReducer = (state = Map(), action) => {
  switch (action.type) {
    case 'DRAFT_RESTORE': 
      return fromJS(action.payload);
    case DRAFT_CREATE_FROM_ENTRY:
      // Existing Entry
      return state.withMutations((s) => {
        s.set('entry', action.payload.entry);
        s.setIn(['entry', 'newRecord'], false);
        s.set('mediaFiles', List());
        // An existing entry may already have metadata. If we surfed away and back to its
        // editor page, the metadata will have been fetched already, so we shouldn't
        // clear it as to not break relation lists.
        s.set('fieldsMetaData', action.payload.metadata || Map());
        s.set('fieldsErrors', Map());
        s.set('hasChanged', false);
      });
    case DRAFT_CREATE_EMPTY:
      // New Entry
      return state.withMutations((s) => {
        s.set('entry', fromJS(action.payload));
        s.setIn(['entry', 'newRecord'], true);
        s.set('mediaFiles', List());
        s.set('fieldsMetaData', Map());
        s.set('fieldsErrors', Map());
        s.set('hasChanged', false);
      });
    case DRAFT_DISCARD:
      return initialState;
    case DRAFT_CHANGE_FIELD:
      return state.withMutations((s) => {
        s.setIn(['entry', 'data', action.payload.field], action.payload.value);
        s.mergeDeepIn(['fieldsMetaData'], fromJS(action.payload.metadata));
        s.set('hasChanged', true);
      });

    case DRAFT_VALIDATION_ERRORS:
      if (action.payload.errors.length === 0) {
        return state.deleteIn(['fieldsErrors', action.payload.field]);
      } 
      return state.setIn(['fieldsErrors', action.payload.field], action.payload.errors);
      

    case ENTRY_PERSIST_REQUEST:
    case UNPUBLISHED_ENTRY_PERSIST_REQUEST: {
      return state.setIn(['entry', 'isPersisting'], true);
    }

    case ENTRY_PERSIST_FAILURE:
    case UNPUBLISHED_ENTRY_PERSIST_FAILURE: {
      return state.deleteIn(['entry', 'isPersisting']);
    }

    case ENTRY_PERSIST_SUCCESS:
    case UNPUBLISHED_ENTRY_PERSIST_SUCCESS:
      return state.withMutations((s) => {
        s.deleteIn(['entry', 'isPersisting']);
        s.set('hasChanged', false);
        if (!s.getIn(['entry', 'slug'])) {
          s.setIn(['entry', 'slug'], action.payload.slug);
        }
      });

    case ENTRY_DELETE_SUCCESS:
      return state.withMutations((s) => {
        s.deleteIn(['entry', 'isPersisting']);
        s.set('hasChanged', false);
      });

    case ADD_ASSET:
      if (state.has('mediaFiles')) {
        return state.update('mediaFiles', list => list.push(action.payload.public_path));
      }
      return state;

    case REMOVE_ASSET:
      return state.update('mediaFiles', list => list.filterNot(path => path === action.payload));

    default:
      return state;
  }
};

export default entryDraftReducer;
