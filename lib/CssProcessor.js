const fs = require('fs');
const css = require('css');
const path = require('path');

const Hasher = require('./Hasher');
const SourceMap = require('./SourceMap');

function replacePattern(inStr, pattern, replacement) {
  const re = new RegExp('%' + pattern + '%', 'g');
  return inStr.replace(re, replacement);
}

module.exports = {
  generateJS: (fileName, template, cb) => {
    const hasher = new Hasher();

    fs.readFile(fileName, 'utf8', (err, cssContent) => {
      if (err) return cb(err);

      const obj = css.parse(cssContent);
      const sheet = obj.stylesheet;

      const cssStr = [];
      const jcssObj = {};

      const rules = [];

      const regex = /\.([a-zA-Z0-9\-]+)/g;

      for(let i=0; i < sheet.rules.length; i++) {
        const rule = sheet.rules[i];

        const ruleLines = [];

        for(let j = 0; j < rule.selectors.length; j++) {
          const keys = (rule.selectors[j].match(regex) || []);

          for(let k = 0; k < keys.length; k++) {
            const key = keys[k];

            if(key.length) {
              const hash = hasher.hash(key);
             
              jsClass[key.substring(1)] = key.replace(regex, '.$1_' + hash).substring(1);
            }
          }

          const classNames = rule.selectors[j].match(regex);
          let ruleSelectors = rule.selectors[j];

          if (classNames) {
            for (let c = 0; c < classNames.length; ++c) {
              const className = classNames[c];
              const hash = hasher.hash(className);

              ruleSelectors = ruleSelectors.replace(className, `${className}_${hash}`);             
            }
          }

          rule.selectors[j] = ruleSelectors.replace(/\s+/g, ' ');
        }

        for(let j = 0; j < rule.declarations.length; j++) {
          const declaration = rule.declarations[j];

          if(declaration.type == 'declaration') {
            ruleLines.push(`  ${declaration.property}: ${declaration.value};`);
          }
        }

        const ruleContent = ruleLines.join('\n');

        rules.push(`${rule.selectors.join(', ')} {\n${ruleContent}\n}\n`);
      }

      let styles = rules.join('\n').replace(/\`/g, '\\`');
      const sourceMap = new SourceMap({
        sourceFileName: path.basename(fileName),
        sourceFileContents: cssContent,
        destinationFileName: path.basename(fileName),
        destinationFileContents: styles,
        jcss: jsClass
      });

      styles += `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${sourceMap.toString('base64')}*/`;

      let jsContent = replacePattern(template, 'jsClass', JSON.stringify(jsClass, null, 2));
      jsContent = replacePattern(jsContent, 'rules', styles);

      return cb(err, jsContent);
    });
  }
};
