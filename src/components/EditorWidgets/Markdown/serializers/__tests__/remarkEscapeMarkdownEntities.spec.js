import unified from 'unified';
import u from 'unist-builder';
import remarkEscapeMarkdownEntities from '../remarkEscapeMarkdownEntities';

const processText = (text) => {
  const tree = u('root', [u('text', text)]);
  const escapedMdast = unified()
    .use(remarkEscapeMarkdownEntities)
    .runSync(tree);

  return escapedMdast.children[0].value;
};

describe('remarkEscapeMarkdownEntities', () => {
  it('should escape common markdown entities', () => {
    expect(processText('*a*')).toEqual('\\*a\\*');
    expect(processText('**a**')).toEqual('\\*\\*a\\*\\*');
    expect(processText('***a***')).toEqual('\\*\\*\\*a\\*\\*\\*');
    expect(processText('_a_')).toEqual('\\_a\\_');
    expect(processText('__a__')).toEqual('\\_\\_a\\_\\_');
    expect(processText('~~a~~')).toEqual('\\~\\~a\\~\\~');
    expect(processText('[]')).toEqual('\\[]');
    expect(processText('[]()')).toEqual('\\[]()');
    expect(processText('[a](b)')).toEqual('\\[a](b)');
    expect(processText('[Test sentence.](https://www.example.com)'))
      .toEqual('\\[Test sentence.](https://www.example.com)');
    expect(processText('![a](b)')).toEqual('!\\[a](b)');
  });

  it('should not escape inactive, single markdown entities', () => {
    expect(processText('a*b')).toEqual('a*b');
    expect(processText('_')).toEqual('_');
    expect(processText('~')).toEqual('~');
    expect(processText('[')).toEqual('[');
  });

  it('should escape leading markdown entities', () => {
    expect(processText('#')).toEqual('\\#');
    expect(processText('-')).toEqual('\\-');
    expect(processText('*')).toEqual('\\*');
    expect(processText('>')).toEqual('\\>');
    expect(processText('=')).toEqual('\\=');
    expect(processText('|')).toEqual('\\|');
    expect(processText('```')).toEqual('\\`\\``');
    expect(processText('    ')).toEqual('\\    ');
  });

  it('should escape leading markdown entities preceded by whitespace', () => {
    expect(processText('\n #')).toEqual('\\#');
    expect(processText(' \n-')).toEqual('\\-');
  });

  it('should not escape leading markdown entities preceded by non-whitespace characters', () => {
    expect(processText('a# # b #')).toEqual('a# # b #');
    expect(processText('a- - b -')).toEqual('a- - b -');
  });

  it('should not escape html tags', () => {
    expect(processText('<a attr="**a**">')).toEqual('<a attr="**a**">');
    expect(processText('a b <c attr="**d**"> e')).toEqual('a b <c attr="**d**"> e');
  });

  it('should escape the contents of html blocks', () => {
    expect(processText('<div>*a*</div>')).toEqual('<div>\\*a\\*</div>');
  });

  it('should not escape the contents of preformatted html blocks', () => {
    expect(processText('<pre>*a*</pre>')).toEqual('<pre>*a*</pre>');
    expect(processText('<script>*a*</script>')).toEqual('<script>*a*</script>');
    expect(processText('<style>*a*</style>')).toEqual('<style>*a*</style>');
    expect(processText('<pre>\n*a*\n</pre>')).toEqual('<pre>\n*a*\n</pre>');
    expect(processText('a b <pre>*c*</pre> d e')).toEqual('a b <pre>*c*</pre> d e');
  });

  it('should not parse footnotes', () => {
    expect(processText('[^a]')).toEqual('\\[^a]');
  });
});
