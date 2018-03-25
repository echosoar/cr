'use strict';
import { Component } from 'preact'; /** @jsx h */
import './index.less';

class Base extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nowChild: []
    }
    this.filterChildren();


    window.onhashchange = this.filterChildren.bind(this);
  }

  filterChildren() {
    let nowPath = location.hash || '';
    nowPath = nowPath.replace(/^(#\/|\/)/, '').replace(/\/$/, '').split('/');

    let nowMatchChildLength = 0;
    let nowChild = [];
    let noMatterChild = [];

    this.props.children.map((e, eIndex) => {
      let path = e.attributes && e.attributes.path || '';

      if (!path) { // no matter match path
        noMatterChild.push({
          index: eIndex,
          ele: e
        });
      }

      let pathArr = path.replace(/^(#\/|\/)/, '').replace(/\/$/, '').split('/');
      let nowMatch = 0;
      let nowParam = {};

      if (pathArr.length > nowPath.length) return;

      pathArr.map((pathItem, pathIndex) => {
        if (pathItem == nowPath[pathIndex]) {
          nowMatch ++;
        } else if (/^:(.*)$/.test(pathItem)) {
          nowMatch ++;
          let param = /^:(.*)$/.exec(pathItem)[1];
          nowParam[param] = nowPath[pathIndex];
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
      <div class="copyright">© 2018 Code Reader</div>
    </div>
  }
}

export default Base;

