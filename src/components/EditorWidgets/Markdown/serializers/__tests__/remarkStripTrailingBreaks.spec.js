import unified from 'unified';
import u from 'unist-builder';
import remarkStripTrailingBreaks from '../remarkStripTrailingBreaks';

const processText = (children) => {
  const tree = u('root', children);
  const strippedMdast = unified()
    .use(remarkStripTrailingBreaks)
    .runSync(tree);

  return strippedMdast.children;
};

describe('remarkStripTrailingBreaks', () => {
  it('should remove trailing breaks at the end of a block', () => {
    expect(processText([u('break')])).toEqual([]);
    expect(processText([u('break'), u('text', '\n  \n')])).toEqual([u('text', '\n  \n')]);
    expect(processText([u('text', 'a'), u('break')])).toEqual([u('text', 'a')]);
  });

  it('should not remove trailing breaks that are not at the end of a block', () => {
    expect(processText([u('break'), u('text', 'a')])).toEqual([u('break'), u('text', 'a')]);
  });
});
