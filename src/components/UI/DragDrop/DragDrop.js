import ReactDNDHTML5Backend from 'react-dnd-html5-backend';
import {
  DragDropContext as createReactDNDDragDropContext,
  DragSource as createReactDNDDragSource,
  DropTarget as createReactDNDDropTarget,
} from 'react-dnd';
import React from 'react';
import PropTypes from 'prop-types';

export const DragSource = ({ namespace, ...props }) => {
  const DragComponent = createReactDNDDragSource(
    namespace,
    {
      beginDrag({ children, isDragging, connectDragComponent, ...ownProps }) {
        // We return the rest of the props as the ID of the element being dragged.
        return ownProps;
      },
    },
    (connect, monitor) => ({
      connectDragComponent: connect.dragSource(),
    }),
  )(
    ({ children, connectDragComponent }) => children(connectDragComponent)
  );

  return React.createElement(DragComponent, props, props.children);
};
DragSource.propTypes = {
  children: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
};

export const DropTarget = ({ onDrop, namespace, ...props }) => {
  const DropComponent = createReactDNDDropTarget(
    namespace,
    {
      drop(ownProps, monitor) {
        onDrop(monitor.getItem());
      },
    },
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isHovered: monitor.isOver(),
    }),
  )(
    ({ children, connectDropTarget, isHovered }) => (
      children(connectDropTarget, { isHovered })
    )
  );

  return React.createElement(DropComponent, props, props.children);
};
DropTarget.propTypes = {
  onDrop: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
};

export const HTML5DragDrop = component => (
  createReactDNDDragDropContext(ReactDNDHTML5Backend)(component)
);
