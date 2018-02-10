import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { NavLink } from 'react-router-dom';
import { searchCollections } from '../../actions/collections';
import { Icon } from '../../components/UI';

export default class Collection extends React.Component {

  static propTypes = {
    collections: ImmutablePropTypes.orderedMap.isRequired,
    searchTerm: PropTypes.string,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  state = { query: this.props.searchTerm || '' };

  renderLink = (collection) => {
    const collectionName = collection.get('name');
    return (
      <NavLink
        key={collectionName}
        to={`/collections/${ collectionName }`}
        className="nc-collectionPage-sidebarLink"
        activeClassName="nc-collectionPage-sidebarLink-active"
      >
        <Icon type="write" />
        {collection.get('label')}
      </NavLink>
    );
  };


  render() {
    const { collections } = this.props;
    const { query } = this.state;
    const { t } = this.context;

    return (
      <div className="nc-collectionPage-sidebar">
        <h1 className="nc-collectionPage-sidebarHeading">{t('side-bar.collections')}</h1>
        <div className="nc-collectionPage-sidebarSearch">
          <Icon type="search" size="small" />
          <input
            onChange={e => this.setState({ query: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && searchCollections(query)}
            placeholder={t('side-bar.search-all')}
            value={query}
          />
        </div>
        {collections.toList().map(this.renderLink)}
      </div>
    );
  }
}
