import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import { status } from '../../constants/publishModes';
import { Icon, Dropdown, DropdownItem } from '../UI';
import { stripProtocol } from '../../lib/urlHelper';


export default class EditorToolbar extends React.Component {

  static propTypes = {
    isPersisting: PropTypes.bool,
    isPublishing: PropTypes.bool,
    isUpdatingStatus: PropTypes.bool,
    isDeleting: PropTypes.bool,
    onPersist: PropTypes.func.isRequired,
    onPersistAndNew: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDeleteUnpublishedChanges: PropTypes.func.isRequired,
    onChangeStatus: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    onPublishAndNew: PropTypes.func.isRequired,
    user: ImmutablePropTypes.map,
    hasChanged: PropTypes.bool,
    displayUrl: PropTypes.string,
    collection: ImmutablePropTypes.map.isRequired,
    hasWorkflow: PropTypes.bool,
    hasUnpublishedChanges: PropTypes.bool,
    isNewEntry: PropTypes.bool,
    isModification: PropTypes.bool,
    currentStatus: PropTypes.string,
    onLogoutClick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  renderSimpleSaveControls = () => {
    const { showDelete, onDelete } = this.props;
    const { t } = this.context;

    return (
      <div>
        {showDelete
          ? <button className="nc-entryEditor-toolbar-deleteButton" onClick={onDelete}>
            {t('entry.delete')}
          </button>
          : null
        }
      </div>
    );
  };

  renderSimplePublishControls = () => {
    const { onPersist, onPersistAndNew, isPersisting, hasChanged, isNewEntry } = this.props;
    const { t } = this.context;

    if (!isNewEntry && !hasChanged) {
      return (<div className="nc-entryEditor-toolbar-statusPublished">
        {t('entry.published')
      }</div>);
    }

    return (
      <div>
        <Dropdown
          className="nc-entryEditor-toolbar-dropdown"
          classNameButton="nc-entryEditor-toolbar-publishButton"
          dropdownTopOverlap="40px"
          dropdownWidth="150px"
          label={isPersisting ? t('entry.publishing') : t('entry.publish')}
        >
          <DropdownItem
            label={t('entry.publish-now')}
            icon="arrow"
            iconDirection="right"
            onClick={onPersist}
          />
          <DropdownItem
            label={t('entry.publish-and-create-new')}
            icon="add"
            onClick={onPersistAndNew}
          />
        </Dropdown>
      </div>
    );
  };

  renderWorkflowSaveControls = () => {
    const {
      onPersist,
      onDelete,
      onDeleteUnpublishedChanges,
      hasChanged,
      hasUnpublishedChanges,
      isPersisting,
      isDeleting,
      isNewEntry,
      isModification,
    } = this.props;
    const { t } = this.context;

    const deleteLabel = (hasUnpublishedChanges && isModification && t('entry.delete-changes'))
      || (hasUnpublishedChanges && (isNewEntry || !isModification) && t('entry.delete-entry'))
      || (!hasUnpublishedChanges && !isModification && t('entry.delete-pub-entry'));

    return [
      <button
        className="nc-entryEditor-toolbar-saveButton"
        onClick={() => hasChanged && onPersist()}
      >
        {isPersisting ? t('entry.saving') : t('entry.save')}
      </button>,
      (isNewEntry || !deleteLabel)
        ? null
        : <button
          className="nc-entryEditor-toolbar-deleteButton"
          onClick={hasUnpublishedChanges ? onDeleteUnpublishedChanges : onDelete}
        >
          {isDeleting ? t('entry.deleting') : deleteLabel}
        </button>,
    ];
  };

  renderWorkflowPublishControls = () => {
    const {
      isUpdatingStatus,
      isPublishing,
      onChangeStatus,
      onPublish,
      onPublishAndNew,
      currentStatus,
      isNewEntry,
    } = this.props;
    const { t } = this.context;

    if (currentStatus) {
      return [
        <Dropdown
          className="nc-entryEditor-toolbar-dropdown"
          classNameButton="nc-entryEditor-toolbar-statusButton"
          dropdownTopOverlap="40px"
          dropdownWidth="120px"
          label={isUpdatingStatus ? t('entry.updating') : t('entry.set-status')}
        >
          <DropdownItem
            className="nc-entryEditor-toolbar-statusMenu-status"
            label={t('entry.draft')}
            onClick={() => onChangeStatus('DRAFT')}
            icon={currentStatus === status.get('DRAFT') && 'check'}
          />
          <DropdownItem
            className="nc-entryEditor-toolbar-statusMenu-status"
            label={t('entry.in-review')}
            onClick={() => onChangeStatus('PENDING_REVIEW')}
            icon={currentStatus === status.get('PENDING_REVIEW') && 'check'}
          />
          <DropdownItem
            className="nc-entryEditor-toolbar-statusMenu-status"
            label={t('entry.ready')}
            onClick={() => onChangeStatus('PENDING_PUBLISH')}
            icon={currentStatus === status.get('PENDING_PUBLISH') && 'check'}
          />
        </Dropdown>,
        <Dropdown
          className="nc-entryEditor-toolbar-dropdown"
          classNameButton="nc-entryEditor-toolbar-publishButton"
          dropdownTopOverlap="40px"
          dropdownWidth="150px"
          label={isPublishing ? t('entry.publishing') : t('entry.publish')}
        >
          <DropdownItem
            label={t('entry.publish-now')}
            icon="arrow"
            iconDirection="right"
            onClick={onPublish}
          />
          <DropdownItem
            label={t('entry.publish-now-and-create-new')}
            icon="add"
            onClick={onPublishAndNew}
          />
        </Dropdown>,
      ];
    }

    if (!isNewEntry) {
      return [<div className="nc-entryEditor-toolbar-statusPublished">{t('entry.published')}</div>];
    }

    return [];
  };

  render() {
    const {
      user,
      hasChanged,
      displayUrl,
      collection,
      hasWorkflow,
      onLogoutClick,
    } = this.props;
    const { t } = this.context;
    const avatarUrl = user.get('avatar_url');

    return (
      <div className="nc-entryEditor-toolbar">
        <Link
          to={`/collections/${ collection.get('name') }`}
          className="nc-entryEditor-toolbar-backSection"
        >
          <div className="nc-entryEditor-toolbar-backArrow">←</div>
          <div>
            {/* eslint-disable react/no-danger */}
            <div 
              className="nc-entryEditor-toolbar-backCollection"
              dangerouslySetInnerHTML={{
                __html: t('entry.header', { label: collection.get('label') }),
              }}
            />
            {/* eslint-enable */}
            {hasChanged
              ? <div className="nc-entryEditor-toolbar-backStatus-hasChanged">
                {t('entry.unsaved-changes')}
              </div>
              : <div className="nc-entryEditor-toolbar-backStatus">
                {t('entry.changes-saved')}
              </div>
            }
          </div>
        </Link>
        <div className="nc-entryEditor-toolbar-mainSection">
          <div className="nc-entryEditor-toolbar-mainSection-left">
            { hasWorkflow ? this.renderWorkflowSaveControls() : this.renderSimpleSaveControls() }
          </div>
          <div className="nc-entryEditor-toolbar-mainSection-right">
            { hasWorkflow ? this.renderWorkflowPublishControls() : this.renderSimplePublishControls() }
          </div>
        </div>
        <div className="nc-entryEditor-toolbar-metaSection">
          {displayUrl
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
                {avatarUrl
                  ? <img
                    alt=""
                    className="nc-appHeader-avatar-image"
                    src={user.get('avatar_url')} 
                  />
                  : <Icon
                    className="nc-appHeader-avatar-placeholder"
                    type="user"
                    size="large"
                  />
                }
              </button>
            }
          >
            <DropdownItem label={t('entry.log-out')} onClick={onLogoutClick} />
          </Dropdown>
        </div>
      </div>
    );
  }
}
