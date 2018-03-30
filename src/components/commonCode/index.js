'use strict';
import { Component } from 'preact'; /** @jsx h */
import './index.less';
class CommonCode extends Component {

  formatData(code) {
    let codeTransfromData = hljs.highlightAuto(code || '').value;
    let codeLines = (codeTransfromData || '').split('\n');
    
    let lineIndexLen = (codeLines.length + '').length * 2;
    console.log(lineIndexLen)
    
    return `<div class="commoncode light">${
      codeLines.map((line, lineIndex) => {
        let preSpaceSize = 0;
        let style = [];
        let preSpace = /^(\s*)/.exec(line);
        if (preSpace) {
          preSpaceSize = preSpace[0].length;
        }
        if (preSpaceSize > 20) preSpaceSize = 20;
        style.push('padding-left:' + ( lineIndexLen + preSpaceSize + 2)/2 + 'em');
        style.push('padding-right: 0.5em');
        return `<div class="commoncode-line hljs" style="${ style.join(';') }"><div class="commoncode-lineindex" style="width: ${ lineIndexLen/2 + 'em' }">${ lineIndex + 1 }</div>${ line }</div>`;
      }).join('')
    }</div>`;
  }

  render() {
    return <div dangerouslySetInnerHTML={{__html: this.formatData(this.props.data)}}></div>
  }
}

export default CommonCode;