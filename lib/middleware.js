const path = require('path');
const fs = require('fs');
const css = require('css');

class CssProcessor {
  constructor(params) {
    this.fileName = params.fileName;
  }

  generateJS(cb) {
    fs.readFile(this.fileName, 'utf8', (err, cssContent) => {
      const obj = css.parse(cssContent);
      const sheet = obj.stylesheet;

      const cssLines = [];
      const o = {};

      for(let i=0; i < sheet.rules.length; i++) {
        const rule = sheet.rules[i];
        for(let k = 0; k < rule.selectors.length; k++) {
          const keys = (rule.selectors[k].match(/\.([A-Za-z0-9]+)/g)||[]);
          for(let l = 0; l < keys.length; l++) {
            if(keys[l].length) {
              o[keys[l].substring(1)] = keys[l].replace(/\.([A-Za-z0-9]+)/g, '._$1_ojfe').substring(1);
            }
          }
          rule.selectors[k] = rule.selectors[k].replace(/\.([A-Za-z0-9]+)/g, '._$1_ojfe').replace(/\s+/g, ' ');
        }
        cssLines.push(rule.selectors.join(' ') + ' {');
          for(let j = 0; j < rule.declarations.length; j++) {
            const declaration = rule.declarations[j];
            if(declaration.type == 'declaration') {
              cssLines.push(`  ${declaration.property}: ${declaration.value};`);
            }
          }
          cssLines.push('}');
      }
      //console.log('OBJECT:\n' + JSON.stringify(o, 0, '  ') + '\n\nCSS:\n' + cssLines.join('\n'));
      
      const jsContent = `
export default ${JSON.stringify(o, null, 2)};

const stylesToInject = \`${cssLines.join('\n').replace(/\`/g,'\\`')}\`;

console.log(stylesToInject);
`;
      return cb(err, jsContent);
    });
  }
//const obj = css.parse(fs.readFile...);
}

module.exports = (staticPath) => {
  return (req, res, next) => {
    if (/\.css$/.test(req.path)) {
      const fileName = path.join(staticPath, req.path);
      const cssProcessor = new CssProcessor({fileName});
      
      cssProcessor.generateJS((err, jsContent) => {

        if(err) {
          if(err.code == 'ENOENT') {
            next();
          }else {
            res.status(500);
            res.send(err.toString());
          }
        } else {
          res.setHeader('Content-type', 'text/javascript');
          res.send(jsContent);
        }
      });
    } else {
      next();
    }
  };
}



/*
var css = require('css');
var obj = css.parse(`
body { 
  font-size: 12px; 
}

.test {
  background: black;
}

.test.abc:not(   .mehmet)         >div,      .mehmet:first-child {
  color: red;
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#7db9e8',GradientType=0 );
}



`, {});

var sheet = obj.stylesheet;

const cssLines = [];
const o = {};

for(let i=0; i < sheet.rules.length; i++) {
  const rule = sheet.rules[i];
  for(let k = 0; k < rule.selectors.length; k++) {
    const keys = (rule.selectors[k].match(/\.([A-Za-z0-9]+)/g)||[]);
    for(let l = 0; l < keys.length; l++) {
      if(keys[l].length) {
        o[keys[l].substring(1)] = keys[l].replace(/\.([A-Za-z0-9]+)/g, '._$1_ojfe').substring(1);
      }
    }
    rule.selectors[k] = rule.selectors[k].replace(/\.([A-Za-z0-9]+)/g, '._$1_ojfe').replace(/\s+/g, ' ');
  }
  cssLines.push(rule.selectors.join(' ') + ' {');
  for(let j = 0; j < rule.declarations.length; j++) {
    const declaration = rule.declarations[j];
    if(declaration.type == 'declaration') {
      cssLines.push(`  ${declaration.property}: ${declaration.value};`);
    }
  }
  cssLines.push('}');
}
  console.log('OBJECT:\n' + JSON.stringify(o, 0, '  ') + '\n\nCSS:\n' + cssLines.join('\n'));

*/
