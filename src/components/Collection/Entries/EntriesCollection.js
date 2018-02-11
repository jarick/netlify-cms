import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { loadEntries as actionLoadEntries } from '../../../actions/entries';
import { selectEntries } from '../../../reducers';
import Entries from './Entries';


class EntriesCollection extends React.Component {
  static propTypes = {
    collection: ImmutablePropTypes.map.isRequired,
    publicFolder: PropTypes.string.isRequired,
    page: PropTypes.number,
    entries: ImmutablePropTypes.list,
    isFetching: PropTypes.bool.isRequired,
    viewStyle: PropTypes.string,
    loadEntries: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { collection, loadEntries } = this.props;
    if (collection) {
      loadEntries(collection);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { collection, loadEntries } = this.props;
    if (nextProps.collection !== collection) {
      loadEntries(nextProps.collection);
    }
  }

  handleLoadMore = (page) => {
    const { collection, loadEntries } = this.props;
    loadEntries(collection, page);
  };

  render () {
    const { collection, entries, publicFolder, page, isFetching, viewStyle } = this.props;

    return (
      <Entries
        collections={collection}
        entries={entries}
        publicFolder={publicFolder}
        page={page}
        onPaginate={this.handleLoadMore}
        isFetching={isFetching}
        collectionName={collection.get('label')}
        viewStyle={viewStyle}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { collection, viewStyle } = ownProps;
  const { config } = state;
  const publicFolder = config.get('public_folder');
  const page = state.entries.getIn(['pages', collection.get('name'), 'page']);

  const entries = selectEntries(state, collection.get('name'));
  const isFetching = state.entries.getIn(['pages', collection.get('name'), 'isFetching'], false);

  return { publicFolder, collection, page, entries, isFetching, viewStyle };
}

const mapDispatchToProps = {
  loadEntries: actionLoadEntries,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntriesCollection);
