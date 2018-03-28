'use strict';
import { Component } from 'preact'; /** @jsx h */
import './index.less';
import Storage from '_/utils/storage.js';
class Base extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nowChild: []
    }
    Storage.checkURL();
    window.onhashchange = this.filterChildren.bind(this);
    this.filterChildren();
  }

  filterChildren() {
    let nowPath = location.hash || '';
    nowPath = nowPath.replace(/^(#\/|\/)/, '').replace(/\/$/, '').split('/');

    let nowMatchChildLength = 0;
    let nowChild = [];
    let noMatterChild = [];
    let home = {};

    this.props.children.map((e, eIndex) => {
      let path = e.attributes && e.attributes.path || '';

      if (e.attributes && e.attributes.home) {
        home.ele = e;
        home.index = eIndex;
        return;
      }

      if (!path) { // no matter match path
        noMatterChild.push({
          index: eIndex,
          ele: e
        });
        return;
      }

      let pathArrLen = 0;
      let pathArr = path.replace(/^(#\/|\/)/, '').replace(/\/$/, '').split('/').map(path => {
        if (/^\(.*?\)$/.test(path)) {
          return path.replace(/(^\(|\)$)/g, '');
        }
        pathArrLen ++;
        return path;
      });
      let nowMatch = 0;
      let nowParam = {};

      if (pathArrLen > nowPath.length) return;

      pathArr.map((pathItem, pathIndex) => {
        if (nowMatch == pathIndex) {
          if (pathItem == nowPath[pathIndex]) {
            nowMatch ++;
          } else if (/^:(.*)$/.test(pathItem)) {
            nowMatch ++;
            let param = /^:(.*)$/.exec(pathItem)[1];
            nowParam[param] = nowPath[pathIndex];
          }
        }
      });
      
      if (nowMatch > nowMatchChildLength) {
        nowMatchChildLength = nowMatch;
        nowChild = [{
          index: eIndex,
          ele: e,
          param: nowParam
        }];
      } else if(nowMatch && nowMatch == nowMatchChildLength) {
        nowChild.push({
          index: eIndex,
          ele: e,
          param: nowParam
        });
      }
    });

    if (!nowChild.length && home.ele) {
      nowChild = [home];
    }

    let display = nowChild.concat(noMatterChild).sort((a, b) => {
        return a.index - b.index
    }).map(item => {
      let ele = item.ele;
      ele.attributes = ele.attributes || {};
      ele.attributes.urlParams = item.param;
      return item.ele;
    });

    this.setState({
      nowChild: display
    });
  }

  render() {
    return <div class="main">
      <div>{ this.state.nowChild }</div>
      <div class="copyright">© 2018 Cr.js</div>
    </div>
  }
}

export default Base;

