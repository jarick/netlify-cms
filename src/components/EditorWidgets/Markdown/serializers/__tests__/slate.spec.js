import { flow } from 'lodash';
import { markdownToSlate, slateToMarkdown } from '../index';

const processText = flow([markdownToSlate, slateToMarkdown]);

describe('slate', () => {
  it('should not decode encoded html entities in inline code', () => {
    expect(processText('<code>&lt;div&gt;</code>')).toEqual('<code>&lt;div&gt;</code>');
  });

  it('should parse non-text children of mark nodes', () => {
    expect(processText('**a[b](c)d**')).toEqual('**a[b](c)d**');
    expect(processText('**[a](b)**')).toEqual('**[a](b)**');
    expect(processText('**![a](b)**')).toEqual('**![a](b)**');
    expect(processText('_`a`_')).toEqual('_`a`_');
    expect(processText('_`a`b_')).toEqual('_`a`b_');
  });

  it('should condense adjacent, identically styled text and inline nodes', () => {
    expect(processText('**a ~~b~~~~c~~**')).toEqual('**a ~~bc~~**');
    expect(processText('**a ~~b~~~~[c](d)~~**')).toEqual('**a ~~b[c](d)~~**');
  });

  it('should handle nested markdown entities', () => {
    expect(processText('**a**b**c**')).toEqual('**a**b**c**');
    expect(processText('**a _b_ c**')).toEqual('**a _b_ c**');
  });

  it('should parse inline images as images', () => {
    expect(processText('a ![b](c)')).toEqual('a ![b](c)');
  });

  it('should not escape markdown entities in html', () => {
    expect(processText('<span>*</span>')).toEqual('<span>*</span>');
  });
});
