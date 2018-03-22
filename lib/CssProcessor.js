const fs = require('fs');
const css = require('css');
const loaderUtils = require('loader-utils');

function replacePattern(inStr, pattern, replacement) {
  const re = new RegExp('%' + pattern + '%', 'g');
  return inStr.replace(re, replacement);
}

module.exports = {
  generateJS: (fileName, template, cb) => {
    fs.readFile(fileName, 'utf8', (err, cssContent) => {
      const obj = css.parse(cssContent);
      const sheet = obj.stylesheet;

      const cssStr = [];
      const jsClass = {};

      const rules = [];

      const regex = /\.([a-zA-Z0-9\-]+)/g;

      for(let i=0; i < sheet.rules.length; i++) {
        const rule = sheet.rules[i];

        const ruleLines = [];//[`${rule.selectors.join(' ')} \{`];

        for(let j = 0; j < rule.declarations.length; j++) {
          const declaration = rule.declarations[j];
          if(declaration.type == 'declaration') {
            ruleLines.push(`  ${declaration.property}: ${declaration.value};`);
          }
        }

        const ruleContent = ruleLines.join('\n');
        const hash = loaderUtils.interpolateName({resurcePath: fileName}, '[hash:base64:5]', {content: ruleContent});

        for(let j = 0; j < rule.selectors.length; j++) {
          const keys = (rule.selectors[j].match(regex) || []);

          for(let k = 0; k < keys.length; k++) {
            const key = keys[k];

            if(key.length) {
              jsClass[key.substring(1)] = key.replace(regex, '.$1_' + hash).substring(1);
            }
          }

          rule.selectors[j] = rule.selectors[j].replace(regex, '.$1_' + hash).replace(/\s+/g, '');
        }

        rules.push(`${rule.selectors.join('')} {\n${ruleContent}\n}`);
      }


      let jsContent = replacePattern(template, 'jsClass', JSON.stringify(jsClass, null, 2));
      jsContent = replacePattern(jsContent, 'rules', rules.join('\n').replace(/\`/g, '\\`'));

      return cb(err, jsContent);
    });
  }
};
