const css = require('css');
const vlq = require('vlq');

class SourceMap {
  constructor(params) {
    this.src = {
      fileName: params.sourceFileName,
      contents: params.sourceFileContents
    };

    this.dst = {
      fileName: params.destinationFileName,
      contents: params.destinationFileContents
    };

    this.jcss = params.jcss;
    this.mappings = [];
    this.regex = /\.([a-zA-Z0-9\-]+)/g;
  }

  addMapping(sourceRule, destRule) {
    const srcSelRowStart = +sourceRule.position.start.line;
    const srcSelColStart = +sourceRule.position.start.column;
    const dstSelRowStart = +destRule.position.start.line;
    const dstSelColStart = +destRule.position.start.column;

    this.mappings.push({
      dstCol: dstSelColStart,
      fileIndex: 0,
      srcRow: srcSelRowStart,
      srcCol: srcSelColStart
    });
  }

  generateMappings() {
    const sourceLines = this.src.contents.split('\n');
    const sourceCss = css.parse(this.src.contents);
    const destLines = this.dst.contents.split('\n');
    const destCss = css.parse(this.dst.contents);
    const classNames = Object.keys(this.jcss);

    if (sourceCss && destCss) {
      const srcRules = sourceCss.stylesheet.rules;
      const dstRules = destCss.stylesheet.rules;

      for (let i = 0; i < srcRules.length; ++i) {
        const srcSelectors = srcRules[i].selectors;
        const dstSelectors = dstRules[i].selectors;

        if (this.isSameSelectors(srcSelectors, dstSelectors)) {
          this.addMapping(srcRules[i], dstRules[i]);
        }
      }
    }

    return this.getMappings();
  }

  getMappings() {
    if (!this.mappings.length) return "";

    const lastRowIndex = this.mappings[this.mappings.length - 1].srcRow;
    let mappingsStr = `${this.vlq(0, 0, -1, 0)};`;

    for (let i = 0; i <= lastRowIndex; ++i) {
      mappingsStr += `${this.vlq(0,0,1,0)};`;
    }

    return mappingsStr;
  }

  isSameSelectors(sourceSelectors, destSelectors) {
    for (let i = 0; i < sourceSelectors.length; ++i) {
      let selector = sourceSelectors[i];
      const classNames = selector.match(this.regex);

      if (classNames) {
        for (let j = 0; j < classNames.length; ++j) {
          const className = classNames[j].substring(1);

          if (this.jcss[className]) {
            selector = selector.replace(className, this.jcss[className]);
          }
        }
      }

      if (destSelectors[i] != selector) return false;      
    }

    return true;
  }

  toString(encoding) {
    const asd = css.parse(this.src.contents);

    const map = {
      version: 3,
      file: this.dst.fileName,
      sourceRoot: '',
      sources: [this.src.fileName],
      sourcesContent: [this.src.contents],
      mappings: this.generateMappings()
    };

    return Buffer.from(JSON.stringify(map)).toString(encoding);
  }

  vlq(destinationColumnIndex, sourceFileIndex, sourceRowIndex, sourceColumnIndex) {
    return vlq.encode([destinationColumnIndex, sourceFileIndex, sourceRowIndex, sourceColumnIndex]);
  }
}

module.exports = SourceMap;
