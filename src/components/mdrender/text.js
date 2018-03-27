'use strict';
import { Component } from 'preact'; /** @jsx h */
import path from 'path';
import './text.less';

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

var renderer = new marked.Renderer();
renderer.listitem = function(text) {
if (/^\s*\[[x ]\]\s*/.test(text)) {
text = text
  .replace(/^\s*\[ \]\s*/, '<i class="empty checkbox icon"></i> ')
  .replace(/^\s*\[x\]\s*/, '<i class="checked checkbox icon"></i> ');
    return '<li style="list-style: none">' + text + '</li>';
  } else {
    return '<li>' + text + '</li>';
  }
};


var toc = [];

renderer.heading = function(text, level, raw) {
    var anchor = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
    toc.push({
        anchor: anchor,
        level: level,
        text: text
    });
    return '<h'
        + level
        + ' id="'
        + anchor
        + '">'
        + text
        + (level < 4 ? '<a class="returnToToc" onclick="mdTocClick()">TOC</a>' : '')
        + '</h'
        + level
        + '>\n';
};

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true
});

class TextRender extends Component {
  
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(newProps) {
    if (newProps.data == this.props.data) return false;
  }

  componentDidMount() {
    this.props.toc && this.props.toc(toc);
    let ele = document.getElementById('mdtextrender');
    ele.onclick = this.handleClick.bind(this, ele);
  }

  handleClick(ele, e) {
    let target = e.target;
    while(target != ele) {
      if (target.nodeName == 'A') {
        break;
      }
      target = target.parentNode;
    }
    if (!target || target.nodeName != 'A') return;
    let link = target.getAttribute('href');
    if (!link) return;

    e.preventDefault();
    e.stopPropagation();
    
    if (/(?:http[s]?\/|\/\/)/i.test(link)) { // outer
      window.crConfirm && window.crConfirm(<div>
        <div class="confirmTitle">Open Link</div>
        <div class="confirmText">{ link }</div>
      </div>, {
          text: 'Open',
          handle: () => {
            console.log("sss", link)
            window.open(link);
          }
      })
    } else if (/^#/.test(link)) { // anchor

    } else {
      if (!/^\./.test(link)) link = './' + link;
      link = link.replace(/\\/g, '');
      let nowPath = path.resolve(this.props.fullPath, '../', link).replace(/^\//, '');
      this.props.getRemoteByPath(nowPath);
    }
  }

  componentDidUpdate() {
    this.props.toc && this.props.toc(toc);
  }

  formatData(data) {
    data = data.replace(/<img(.*?)src=['"](.*?)['"]/ig, (preData, match1, src) => {
      if (!/(?:http[s]?\/|\/\/)/i.test(src)) { // local

        if (!/^\./.test(src)) src = './' + src;
        src = src.replace(/\\/g, '');
        let { user, repo, sha } = this.props.repo;
        src = `//raw.githubusercontent.com/${ user }/${ repo }/${ sha }/` + path.resolve(this.props.fullPath, '../', src).replace(/^\//, '');
        return '<img ' + match1 + 'src="' + src + '"';
      }
      return preData;
    });
    return data;
  }

  render() {
    toc = [];
    let {data} = this.props;
    data = this.formatData(data);
    return <div class="mdtextrender" id="mdtextrender" dangerouslySetInnerHTML={{__html: marked(data, { renderer: renderer })}} />;
  }
}

export default TextRender;