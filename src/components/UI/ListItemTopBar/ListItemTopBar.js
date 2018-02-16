import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import { Icon } from '../';

// eslint-disable-next-line import/prefer-default-export
export const ListItemTopBar = ({ collapsed, onCollapseToggle, onRemove, dragHandleHOC, className }) => {
  const DragHandle = dragHandleHOC && dragHandleHOC(() =>
    <span className="nc-listItemTopBar-dragIcon">
      <Icon type="drag-handle" size="small" />
    </span>
  );

  return (
    <div className={c('nc-listItemTopBar', className)}>
      {
        onCollapseToggle
          ? <button className="nc-listItemTopBar-toggleButton" onClick={onCollapseToggle}>
            <Icon type="chevron" size="small" direction={collapsed ? 'right' : 'down'} />
          </button>
          : null
      }
      { dragHandleHOC ? <DragHandle /> : null }
      {
        onRemove
          ? <button className="nc-listItemTopBar-removeButton" onClick={onRemove}>
            <Icon type="close" size="small" />
          </button>
          : null
      }
    </div>
  );
};

ListItemTopBar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onCollapseToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  dragHandleHOC: PropTypes.node,
  className: PropTypes.string
};
