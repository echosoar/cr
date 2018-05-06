'use strict';
import { Component } from 'preact'; /** @jsx h */
import path from 'path';
import Language from '_/utils/language.js';
import './text.less';


let githubRepoReg = /github\.com\/(.*?)\/(.*?)(?:\/|$)/i;

class TextRender extends Component {
  
  constructor(props) {
    super(props);
    this.toc = [];
    this.markedConfig();
  }

  shouldComponentUpdate(newProps) {
    if (newProps.fontSize != this.props.fontSize) return true;
    if (newProps.data == this.props.data) return false;
  }

  componentDidMount() {
    this.props.toc && this.props.toc(this.toc);
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

      let gitRepoLink = null;

      if (githubRepoReg.test(link)) {
        let gitinfo = githubRepoReg.exec(link);
        gitRepoLink = '#/branch/' + gitinfo[1] + '/' + gitinfo[2].replace(/#.*$/i, '');
      }

      window.crConfirm && window.crConfirm.open(<div>
        <div class="confirmTitle">{ Language('openLink') }</div>
        <div class="confirmText">{ link }</div>
        { gitRepoLink && <div class="confirmTip" onClick={() => {
            window.crConfirm.close();
            location.href = gitRepoLink;
          }}>
          This is a github repo<br />
          Add this repo to your cr list?
        </div> }
      </div>, {
          text: Language('openLink'),
          handle: () => {
            window.open(link);
          }
      })
    } else if (/^#/.test(link)) { // anchor

    } else { // local
      if (!/^\./.test(link)) link = './' + link;
      link = link.replace(/\\/g, '');
      let nowPath = path.resolve(this.props.fullPath, '../', link).replace(/^\//, '');
      this.props.getRemoteByPath(nowPath);
    }
  }

  componentDidUpdate() {
    this.props.toc && this.props.toc(this.toc);
    window.scrollTo({top: 0});
  }

  formatData(data) {
    return data.replace(/<img(.*?)src=['"](.*?)['"]/ig, (preData, match1, src) => {
      return '<img ' + match1 + 'src="' + this.checkRelativeImgLink(src) + '"';
    });
  }

  markedConfig() {

    marked.setOptions({
      highlight: code => {
        return hljs.highlightAuto(code).value;
      },
      gfm: true,
      tables: true,
      breaks: true
    });

    this.renderer = new marked.Renderer();
    this.renderer.listitem = this.markedRendererTodo.bind(this);
    this.renderer.heading = this.markedRendererHeading.bind(this);
    this.renderer.link = this.markedRendererLink.bind(this);
    this.renderer.image = this.markedRendererImage.bind(this);
  }

  markedRendererTodo(text) {
    if (/^\s*\[[x ]\]\s*/.test(text)) {
    text = text
      .replace(/^\s*\[ \]\s*/, '<i class="empty checkbox icon"></i> ')
      .replace(/^\s*\[x\]\s*/, '<i class="checked checkbox icon"></i> ');
        return '<li style="list-style: none">' + text + '</li>';
      } else {
        return '<li>' + text + '</li>';
      }
  }

  markedRendererHeading(text, level, raw) {
    var anchor = raw.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
    this.toc.push({
        anchor: anchor,
        level: level,
        text: text
    });
    return '<h' + level + ' id="' + anchor + '">'
        + text + (level < 4 ? '<a class="returnToToc" onclick="mdTocClick()">TOC</a>' : '')
    + '</h' + level  + '>\n';
}

  markedRendererLink(href, title, text) {
    let add = '';
    if (githubRepoReg.test(href) && !/<[^>]+>/.test(text)) {
      add += '<i class="githubhref"></i>';
    }

    return add + '<a target="_blank" href="'+ href +'" title="' + title + '">' + text + '</a>';
  }

  markedRendererImage(src, title, text) {
    return `<img src="${ this.checkRelativeImgLink(src) }" alt="${ title }" />`;
  }

  checkRelativeImgLink(src) {
    if (!/(?:http[s]?\/|\/\/)/i.test(src)) { // local
      if (!/^\./.test(src)) src = './' + src;
      src = src.replace(/\\/g, '');
      let { user, repo, sha } = this.props.repo;
      return `//raw.githubusercontent.com/${ user }/${ repo }/${ sha }/` + path.resolve(this.props.fullPath, '../', src).replace(/^\//, '');
    } else {
      return src;
    }
  }

  render() {
    this.toc = [];
    let { data, fontSize } = this.props;
    data = this.formatData(data);
    return <div class="mdtextrender" style={{fontSize: fontSize + 'px'}} id="mdtextrender" dangerouslySetInnerHTML={{__html: marked(data, { renderer: this.renderer })}} />;
  }
}

export default TextRender;