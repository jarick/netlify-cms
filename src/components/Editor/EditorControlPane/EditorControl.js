import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { partial } from 'lodash';
import c from 'classnames';
import { resolveWidget } from '../../../lib/registry';
import Widget from './Widget';

export default class EditorControl extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    fieldsMetaData: ImmutablePropTypes.map,
    fieldsErrors: ImmutablePropTypes.map,
    mediaPaths: PropTypes.array,
    getAsset: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onOpenMediaLibrary: PropTypes.func.isRequired,
    onAddAsset: PropTypes.func.isRequired,
    onRemoveInsertedMedia: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
    processControlRef: PropTypes.any,
  };

  state = {
    activeLabel: false,
  };

  render() {
    const {
      value,
      field,
      fieldsMetaData,
      fieldsErrors,
      mediaPaths,
      getAsset,
      onChange,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveInsertedMedia,
      onValidate,
      processControlRef,
    } = this.props;
    const widgetName = field.get('widget');
    const widget = resolveWidget(widgetName);
    const fieldName = field.get('name');
    const metadata = fieldsMetaData && fieldsMetaData.get(fieldName);
    const errors = fieldsErrors && fieldsErrors.get(fieldName);
    return (
      <div className="nc-controlPane-control">
        <ul className="nc-controlPane-errors">
          {
            errors && errors.map(error =>
              error.message &&
              typeof error.message === 'string' &&
              <li key={error.message.trim().replace(/[^a-z0-9]+/gi, '-')}>
                {error.message}
              </li>
            )
          }
        </ul>
        <label
          className={c({
            'nc-controlPane-label': true,
            'nc-controlPane-labelActive': this.state.styleActive,
            'nc-controlPane-labelWithError': !!errors,
          })}
          htmlFor={fieldName}
        >
          {field.get('label')}
        </label>
        <Widget
          classNameWrapper={c({
            'nc-controlPane-widget': true,
            'nc-controlPane-widgetActive': this.state.styleActive,
            'nc-controlPane-widgetError': !!errors,
          })}
          classNameWidget="nc-controlPane-widget"
          classNameWidgetActive="nc-controlPane-widgetNestable"
          classNameLabel="nc-controlPane-label"
          classNameLabelActive="nc-controlPane-labelActive"
          controlComponent={widget.control}
          field={field}
          value={value}
          mediaPaths={mediaPaths}
          metadata={metadata}
          onChange={(newValue, newMetadata) => onChange(fieldName, newValue, newMetadata)}
          onValidate={onValidate && partial(onValidate, fieldName)}
          onOpenMediaLibrary={onOpenMediaLibrary}
          onRemoveInsertedMedia={onRemoveInsertedMedia}
          onAddAsset={onAddAsset}
          getAsset={getAsset}
          hasActiveStyle={this.state.styleActive}
          setActiveStyle={() => this.setState({ styleActive: true })}
          setInactiveStyle={() => this.setState({ styleActive: false })}
          ref={processControlRef && partial(processControlRef, fieldName)}
          editorControl={EditorControl}
        />
      </div>
    );
  }
}
