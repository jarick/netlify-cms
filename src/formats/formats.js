import yamlFormatter from './yaml';
import tomlFormatter from './toml';
import jsonFormatter from './json';
import { FrontmatterInfer, frontmatterJSON, frontmatterTOML, frontmatterYAML } from './frontmatter';

export const frontmatterFormats = ['yaml-frontmatter', 'toml-frontmatter', 'json-frontmatter'];

export const supportedFormats = [
  'yml',
  'yaml',
  'toml',
  'json',
  'frontmatter',
  'json-frontmatter',
  'toml-frontmatter',
  'yaml-frontmatter',
];

export const formatToExtension = format => ({
  "yml": 'yml',
  "yaml": 'yml',
  "toml": 'toml',
  "json": 'json',
  "frontmatter": 'md',
  'json-frontmatter': 'md',
  'toml-frontmatter': 'md',
  'yaml-frontmatter': 'md',
}[format]);

export function formatByExtension(extension) {
  return {
    yml: yamlFormatter,
    yaml: yamlFormatter,
    toml: tomlFormatter,
    json: jsonFormatter,
    md: FrontmatterInfer,
    markdown: FrontmatterInfer,
    html: FrontmatterInfer,
  }[extension];
}

function formatByName(name, customDelimiter) {
  return {
    "yml": yamlFormatter,
    "yaml": yamlFormatter,
    "toml": tomlFormatter,
    "json": jsonFormatter,
    "frontmatter": FrontmatterInfer,
    'json-frontmatter': frontmatterJSON(customDelimiter),
    'toml-frontmatter': frontmatterTOML(customDelimiter),
    'yaml-frontmatter': frontmatterYAML(customDelimiter),
  }[name];
}

export function resolveFormat(collectionOrEntity, entry) {
  // Check for custom delimiter
  const customDelimiter = collectionOrEntity.get('frontmatter_delimiter');
  // If the format is specified in the collection, use that format.
  const formatSpecification = collectionOrEntity.get('format');
  if (formatSpecification) {
    return formatByName(formatSpecification, customDelimiter);
  }

  // If a file already exists, infer the format from its file extension.
  const filePath = entry && entry.path;
  if (filePath) {
    const fileExtension = filePath.split('.').pop();
    return formatByExtension(fileExtension);
  }

  // If creating a new file, and an `extension` is specified in the
  //   collection config, infer the format from that extension.
  const extension = collectionOrEntity.get('extension');
  if (extension) {
    return formatByExtension(extension);
  }

  // If no format is specified and it cannot be inferred, return the default.
  return formatByName('frontmatter', customDelimiter);
}
