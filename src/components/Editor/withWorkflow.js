import React from 'react';
import { connect } from 'react-redux';
import { EDITORIAL_WORKFLOW } from '../../constants/publishModes';
import { selectUnpublishedEntry } from '../../reducers';
import { selectAllowDeletion } from '../../reducers/collections';
import { loadUnpublishedEntry, persistUnpublishedEntry } from '../../actions/editorialWorkflow';


const mapStateToProps = (state, ownProps) => {
  const { collections } = state;
  const isEditorialWorkflow = (state.config.get('publish_mode') === EDITORIAL_WORKFLOW);
  const collection = collections.get(ownProps.match.params.name);
  const returnObj = {
    isEditorialWorkflow,
    showDelete: !ownProps.newEntry && selectAllowDeletion(collection),
  };

  if (isEditorialWorkflow) {
    const slug = ownProps.match.params.slug;
    const unpublishedEntry = selectUnpublishedEntry(state, collection.get('name'), slug);

    if (unpublishedEntry) {
      returnObj.unpublishedEntry = true;
      returnObj.entry = unpublishedEntry;
    }
  }

  return returnObj;
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { isEditorialWorkflow, unpublishedEntry } = stateProps;
  const { dispatch } = dispatchProps;
  const returnObj = {};

  if (isEditorialWorkflow) {
    // Overwrite loadEntry to loadUnpublishedEntry
    returnObj.loadEntry = (collection, slug) => (
      dispatch(loadUnpublishedEntry(collection, slug))
    );

    // Overwrite persistEntry to persistUnpublishedEntry
    returnObj.persistEntry = collection => (
      dispatch(persistUnpublishedEntry(collection, unpublishedEntry))
    );
  }

  return {
    ...ownProps,
    ...stateProps,
    ...returnObj,
  };
};

export default Editor => (
  connect(mapStateToProps, null, mergeProps)(
    props => <Editor {...props} />
  )
);
