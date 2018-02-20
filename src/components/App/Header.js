import PropTypes from 'prop-types';
import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import { NavLink } from 'react-router-dom';
import { Icon, Dropdown, DropdownItem } from '../../components/UI';
import { stripProtocol } from '../../lib/urlHelper';


export default class Header extends React.Component {
  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    collections: ImmutablePropTypes.orderedMap.isRequired,
    onCreateEntryClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired,
    displayUrl: PropTypes.string,
    hasWorkflow: PropTypes.bool,
    openMediaLibrary: PropTypes.func,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  handleCreatePostClick = (collectionName) => {
    const { onCreateEntryClick } = this.props;
    if (onCreateEntryClick) {
      onCreateEntryClick(collectionName);
    }
  };

  render() {
    const {
      user,
      collections,
      onLogoutClick,
      openMediaLibrary,
      hasWorkflow,
      displayUrl,
    } = this.props;
    const { t } = this.context;

    const avatarUrl = user.get('avatar_url');

    const content = (
      <div className="nc-appHeader-content">
        <nav>
          <NavLink
            to="/"
            className="nc-appHeader-button"
            activeClassName="nc-appHeader-button-active"
            isActive={(match, { pathname }) => pathname.startsWith('/collections/')}
          >
            <Icon type="page" />
            {t('header.content')}
          </NavLink>
          {
            hasWorkflow
              ? <NavLink
                to="/workflow"
                className="nc-appHeader-button"
                activeClassName="nc-appHeader-button-active"
              >
                <Icon type="workflow" />
                {t('header.workflow')}
              </NavLink>
              : null
          }
          <button onClick={openMediaLibrary} className="nc-appHeader-button">
            <Icon type="media-alt" />
            {t('header.media')}
          </button>
        </nav>
        <div className="nc-appHeader-actions">
          <Dropdown
            classNameButton="nc-appHeader-button nc-appHeader-quickNew"
            label={t('header.quick-add')}
            dropdownTopOverlap="30px"
            dropdownWidth="160px"
            dropdownPosition="left"
          >
            {
              collections.filter(collection => collection.get('create')).toList().map(collection =>
                <DropdownItem
                  key={collection.get("name")}
                  label={collection.get("label")}
                  onClick={() => this.handleCreatePostClick(collection.get('name'))}
                />
              )
            }
          </Dropdown>
          {
            displayUrl
              ? <a
                className="nc-appHeader-siteLink"
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {stripProtocol(displayUrl)}
              </a>
              : null
          }
          <Dropdown
            dropdownTopOverlap="50px"
            dropdownWidth="100px"
            dropdownPosition="right"
            button={
              <button className="nc-appHeader-avatar">
                {
                  avatarUrl
                    ? <img alt="" className="nc-appHeader-avatar-image" src={user.get('avatar_url')} />
                    : <Icon className="nc-appHeader-avatar-placeholder" type="user" size="large" />
                }
              </button>
            }
          >
            <DropdownItem label={t('header.log-out')} onClick={onLogoutClick} />
          </Dropdown>
        </div>
      </div>
    );

    return (
      <div className="nc-appHeader-container">
        <div className="nc-appHeader-main">
          {content}
        </div>
      </div>
    );
  }
}
