import PropTypes from 'prop-types';
import { localize } from 'redux-i18n';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Loader } from '../../UI';
import EntryListing from './EntryListing';


const Entries = ({
  collections,
  entries,
  publicFolder,
  page,
  onPaginate,
  isFetching,
  viewStyle,
  t,
}) => {
  const loadingMessages = [
    t('entries.loading'),
    t('entries.caching'),
    t('entries.waiting'),
  ];

  if (entries) {
    return (
      <EntryListing
        collections={collections}
        entries={entries}
        publicFolder={publicFolder}
        page={page}
        onPaginate={onPaginate}
        viewStyle={viewStyle}
      />
    );
  }

  if (isFetching) {
    return <Loader active>{loadingMessages}</Loader>;
  }

  return <div className="nc-collectionPage-noEntries">{t('entries.no')}</div>;
};

Entries.propTypes = {
  collections: PropTypes.oneOfType([
    ImmutablePropTypes.map,
    ImmutablePropTypes.iterable,
  ]).isRequired,
  entries: ImmutablePropTypes.list,
  publicFolder: PropTypes.string.isRequired,
  page: PropTypes.number,
  isFetching: PropTypes.bool,
  viewStyle: PropTypes.string,
  onPaginate: PropTypes.func,
  t: PropTypes.func.isRequired,
};

export default localize()(Entries);
