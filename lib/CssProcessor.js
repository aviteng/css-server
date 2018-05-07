const fs = require('fs');
const css = require('css');
const path = require('path');

const Hasher = require('./Hasher');
const SourceMap = require('./SourceMap');

function replacePattern(inStr, pattern, replacement) {
  const re = new RegExp('%' + pattern + '%', 'g');
  return inStr.replace(re, replacement);
}

function escapeOctalLiterals(content) {
  return content.replace(/\\/g, '\\\\');
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) return reject(err);

      resolve(escapeOctalLiterals(content));
    });
  });
}

async function fetchFile(possiblePaths = []) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < possiblePaths.length; ++i) {
      const filePath = possiblePaths[i];

      try {
        const content = await readFile(filePath);

        return resolve(content);
      } catch (ex) {
        if (ex.code != 'ENOENT' || i == possiblePaths.length - 1) {
          return reject(ex);
        }
      }
    }

    return resolve('');
  });
}

async function generate(fileName, {template, global, staticRoot, moduleRoot}, cb) {
  const hasher = new Hasher();
  const staticFilePath = path.join(staticRoot, fileName);
  const moduleFilePath = path.join(moduleRoot, fileName);
  let cssContent;

  try { 
    cssContent = await fetchFile([staticFilePath, moduleFilePath]);
  } catch (ex) {
    return cb(ex);      
  }

  if (global) {
    let jsContent = replacePattern(template, 'jcssObj', JSON.stringify({}, null, 2));

    jsContent = replacePattern(jsContent, 'rules', cssContent);
    return cb(null, jsContent);
  }

  const obj = css.parse(cssContent);
  const sheet = obj.stylesheet;

  const cssStr = [];
  const jcssObj = {};

  const rules = [];

  const regex = /\.([a-zA-Z0-9\-]+)/g;

  for(let i=0; i < sheet.rules.length; i++) {
    const rule = sheet.rules[i];

    const ruleLines = [];

    if (rule.type == 'rule') {
      for(let j = 0; j < rule.selectors.length; j++) {
        const keys = (rule.selectors[j].match(regex) || []);

        for(let k = 0; k < keys.length; k++) {
          const key = keys[k];

          if(key.length) {
            const hash = hasher.hash(key);

            jcssObj[key.substring(1)] = key.replace(regex, '.$1_' + hash).substring(1);
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
  }

  let styles = rules.join('\n').replace(/\`/g, '\\`');
  const sourceMap = new SourceMap({
    sourceFileName: path.basename(fileName),
    sourceFileContents: cssContent,
    destinationFileName: path.basename(fileName),
    destinationFileContents: styles,
    jcss: jcssObj
  });

  styles += `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${sourceMap.toString('base64')}*/`;

  let jsContent = replacePattern(template, 'jcssObj', JSON.stringify(jcssObj, null, 2));
  jsContent = replacePattern(jsContent, 'rules', styles);

  return cb(null, jsContent);
}

module.exports = {
  generateJS: (fileName, options, cb) => {
    generate(fileName, options, cb);
  }
};
