import { Map } from 'immutable';
import { newEditorPlugin } from '../components/EditorWidgets/Markdown/MarkdownControl/plugins';

/**
 * Global Registry Object
 */
const registry = {
  backends: { },
  templates: {},
  previewStyles: [],
  widgets: {},
  editorComponents: Map(),
  widgetValueSerializers: {},
};

/**
 * Preview Styles
 */
export const registerPreviewStyle = style => registry.previewStyles.push(style);
export const getPreviewStyles = () => registry.previewStyles;


/**
 * Preview Templates
 */
export const registerPreviewTemplate = (name, component) => {
  registry.templates[name] = component;
};
export const getPreviewTemplate = (name) => registry.templates[name];


/**
 * Editor Widgets
 */
export const registerWidget = (name, control, preview) => {
  // A registered widget control can be reused by a new widget, allowing
  // multiple copies with different previews.
  const newControl = typeof control === 'string' ? registry.widgets[control].control : control;
  registry.widgets[name] = { control: newControl, preview };
};
export const getWidget = name => registry.widgets[name];
export const resolveWidget = name => getWidget(name || 'string') || getWidget('unknown');


/**
 * Markdown Editor Custom Components
 */
export const registerEditorComponent = (component) => {
  const plugin = newEditorPlugin(component);
  registry.editorComponents = registry.editorComponents.set(plugin.get('id'), plugin);
};
export const getEditorComponents = () => registry.editorComponents;


/**
 * Widget Serializers
 */
export const registerWidgetValueSerializer = (widgetName, serializer) => {
  registry.widgetValueSerializers[widgetName] = serializer;
};

export const getWidgetValueSerializer = widgetName => (
  registry.widgetValueSerializers[widgetName]
);

/**
 * Backend API
 */
export const registerBackend = (name, BackendClass) => {
  if (!name || !BackendClass) {
    // eslint-disable-next-line no-console
    console.error("Backend parameters invalid. example: CMS.registerBackend('myBackend', BackendClass)");
  } else if (registry.backends[name]) {
    // eslint-disable-next-line no-console
    console.error(`Backend [${ name }] already registered. Please choose a different name.`);
  } else {
    registry.backends[name] = {
      init: config => new BackendClass(config),
    };
  }
};

export const getBackend = name => registry.backends[name];

export default {
  registerPreviewStyle,
  getPreviewStyles,
  registerPreviewTemplate,
  getPreviewTemplate,
  registerWidget,
  getWidget,
  resolveWidget,
  registerEditorComponent,
  getEditorComponents,
  registerWidgetValueSerializer,
  getWidgetValueSerializer,
  registerBackend,
  getBackend,
};
