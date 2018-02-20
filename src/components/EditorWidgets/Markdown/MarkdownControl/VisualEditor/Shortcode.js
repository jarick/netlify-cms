import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { partial, capitalize } from 'lodash';
import { getEditorComponents } from '../../../../../lib/registry';
import { openMediaLibrary, removeInsertedMedia } from '../../../../../actions/mediaLibrary';
import { addAsset } from '../../../../../actions/media';
import { getAsset } from '../../../../../reducers';
import { ListItemTopBar } from '../../../../UI';
import { getEditorControl } from '../index';

class Shortcode extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    onAddAsset: PropTypes.func.isRequired,
    boundGetAsset: PropTypes.func.isRequired,
    mediaPaths: PropTypes.array.isRequired,
    onOpenMediaLibrary: PropTypes.func.isRequired,
    onRemoveInsertedMedia: PropTypes.func.isRequired,
    attributes: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      /**
       * The `shortcodeNew` prop is set to `true` when creating a new Shortcode,
       * so that the form is immediately open for editing. Otherwise all
       * shortcodes are collapsed by default.
       */
      collapsed: !props.node.data.get('shortcodeNew'),
    };
  }

  handleChange = (fieldName, value) => {
    const { editor, node } = this.props;
    const shortcodeData = Map(node.data.get('shortcodeData')).set(fieldName, value);
    const data = node.data.set('shortcodeData', shortcodeData);
    editor.change(change => change.setNodeByKey(node.key, { data }));
  };

  handleCollapseToggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  handleRemove = () => {
    const { editor, node } = this.props;
    editor.change((change) => {
      change
        .removeNodeByKey(node.key)
        .focus();
    });
  };

  handleClick = (event) => {
    /**
     * Stop click from propagating to editor, otherwise focus will be passed
     * to the editor.
     */
    event.stopPropagation();

    /**
     * If collapsed, any click should open the form.
     */
    if (this.state.collapsed) {
      this.handleCollapseToggle();
    }
  };

  renderControl = (shortcodeData, field, index) => {
    const {
      onAddAsset,
      boundGetAsset,
      mediaPaths,
      onOpenMediaLibrary,
      onRemoveInsertedMedia,
    } = this.props;
    const value = shortcodeData.get(field.get('name'));
    const key = `field-${ field.get('name') }`;
    const Control = getEditorControl();
    const controlProps = {
      field,
      value,
      onAddAsset,
      getAsset: boundGetAsset,
      onChange: this.handleChange,
      mediaPaths,
      onOpenMediaLibrary,
      onRemoveInsertedMedia,
    };

    return (
      <div key={key}>
        <Control {...controlProps} />
      </div>
    );
  };

  render() {
    const { attributes, node } = this.props;
    const { collapsed } = this.state;
    const pluginId = node.data.get('shortcode');
    const shortcodeData = Map(this.props.node.data.get('shortcodeData'));
    const plugin = getEditorComponents().get(pluginId);
    const className = c(
      'nc-objectControl-root',
      'nc-visualEditor-shortcode',
      { 'nc-visualEditor-shortcode-collapsed': collapsed },
    );
    return (
      <div
        {...attributes}
        className={className}
        onClick={this.handleClick}
      >
        <ListItemTopBar
          className="nc-visualEditor-shortcode-topBar"
          collapsed={collapsed}
          onCollapseToggle={this.handleCollapseToggle}
          onRemove={this.handleRemove}
        />
        {
          collapsed
            ? <div className="nc-visualEditor-shortcode-collapsedTitle">{capitalize(pluginId)}</div>
            : plugin.get('fields').map(partial(this.renderControl, shortcodeData))
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { attributes, node, editor } = ownProps;
  return {
    mediaPaths: state.mediaLibrary.get('controlMedia'),
    boundGetAsset: getAsset.bind(null, state),
    attributes,
    node,
    editor,
  };
};

const mapDispatchToProps = {
  onAddAsset: addAsset,
  onOpenMediaLibrary: openMediaLibrary,
  onRemoveInsertedMedia: removeInsertedMedia,
};

export default connect(mapStateToProps, mapDispatchToProps)(Shortcode);
