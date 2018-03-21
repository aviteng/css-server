class CssProcessor {
  constructor() {
    this.fileName = params.fileName;
    this.regex = /\.([A-Za-z0-9_-]+)/g;
  }

  generateJS(cb) {
    fs.readFile(this.fileName, 'utf8', (err, cssContent) => {
      const obj = css.parse(cssContent);
      const sheet = obj.stylesheet;

      const output = [];
      const o = {};

      for(let i=0; i < sheet.rules.length; i++) {
        const rule = sheet.rules[i];

        for(let j = 0; j < rule.selectors.length; j++) {
          const keys = (rule.selectors[j].match(this.regex) || []);

          for(let k = 0; k < keys.length; k++) {
            const key = keys[k];

            if(key.length) {
              o[key.substring(1)] = key.replace(this.regex, '._$1_ojfe').substring(1);
            }
          }

          rule.selectors[k] = rule.selectors[k].replace(this.regex, '._$1_ojfe').replace(/\s+/g, ' ');
        }

        output.push(`${rule.selectors.join(' ')} {`);

          for(let j = 0; j < rule.declarations.length; j++) {
            const declaration = rule.declarations[j];
            if(declaration.type == 'declaration') {
              output.push(`  ${declaration.property}: ${declaration.value};`);
            }
          }
          output.push('}');
        }
      
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

module.exports = (fileName, cb) => {
  
};
