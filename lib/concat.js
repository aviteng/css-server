const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const appendFile = promisify(fs.appendFile);

function spaces(str, maxLength) {
  let ret = str;

  for (let i = str.length; i < maxLength; ++i) {
    ret += " ";
  }

  return ret;
}

async function concat(sources, target, dirname = path.join(__dirname, '../')) {
  const maxLength = sources.reduce((max, cur) => {
    if (cur.replace(dirname, '').length > max) return cur.replace(dirname, '').length;

    return max;
  }, 0);

  console.log('Maxlength is', maxLength);

  for (let i = 0; i < sources.length; ++i) {
    console.log(`${spaces(sources[i].replace(dirname, ''), maxLength)} >> ${target.replace(dirname, '')}`);
    
    const file = await readFile(sources[i]);
    await appendFile(target, file);
  }
}

module.exports = (sources, target) => {
  concat(sources, target).catch((err) => { 
    console.trace(err); 
    process.exit(1); 
  });
}
