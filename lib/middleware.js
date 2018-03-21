const path = require('path');
const fs = require('fs');
const css = require('css');

const cssProcessor = require('./CssProcessor');

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
