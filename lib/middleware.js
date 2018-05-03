const path = require('path');
const fs = require('fs');

const cssProcessor = require('./CssProcessor');
const template = fs.readFileSync(path.join(__dirname, 'classTemplate.js'), 'utf8');

module.exports = (staticPath) => {
  return (req, res, next) => {
    if (/\.css$/.test(req.path)) {
      const fileName = path.join(staticPath, req.path);
      const options = {template, global: !!req.query.global};
      
      cssProcessor.generateJS(fileName, options, (err, jsContent) => {
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
