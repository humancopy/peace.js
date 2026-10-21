// Builds dist/peace.min.js and dist/peace.min.css, with source maps, from peace.js and peace.css.
// Run with `npm run build`. The tests check that dist/ matches what this builds.
const fs = require('fs');
const path = require('path');
const {minify} = require('terser');
const CleanCSS = require('clean-css');
const {version} = require('../package.json');

const root = path.resolve(__dirname, '..');
const banner = `/*! peace.js ${version} | MIT | https://peace.humancopy.net */`;

// Resolves to {'dist/peace.min.js': '…', …}, the files as they should be on disk
async function build() {
  const js = fs.readFileSync(path.join(root, 'peace.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'peace.css'), 'utf8');

  const script = await minify({'../peace.js': js}, {
    compress: true,
    mangle: true,
    format: {preamble: banner},
    sourceMap: {filename: 'peace.min.js', url: 'peace.min.js.map'},
  });

  const style = new CleanCSS({sourceMap: true, rebaseTo: path.join(root, 'dist')}).minify({[path.join(root, 'peace.css')]: {styles: css}});
  if (style.errors.length) throw new Error(style.errors.join('\n'));
  const map = JSON.parse(style.sourceMap.toString());
  map.file = 'peace.min.css';
  map.sources = ['../peace.css'];

  return {
    'dist/peace.min.js': script.code + '\n',
    'dist/peace.min.js.map': script.map + '\n',
    'dist/peace.min.css': `${banner}\n${style.styles}\n/*# sourceMappingURL=peace.min.css.map */\n`,
    'dist/peace.min.css.map': JSON.stringify(map) + '\n',
  };
}

module.exports = {build};

if (require.main === module) {
  build().then(files => {
    fs.mkdirSync(path.join(root, 'dist'), {recursive: true});
    for (const [name, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(root, name), content);
      console.log(`${name}: ${Buffer.byteLength(content)} B`);
    }
  });
}
