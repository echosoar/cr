'use strict';
import { Component } from 'preact'; /** @jsx h */
import axios from 'axios/dist/axios';

import './index.less';
/**
 * Tree的格式
 * 存储在 crTree 里面
 * 第一级为分支hash
 * 第二级为项
 * {
 *  [hash]: {
 *    childHash: []
 *  }
 * }
 */

class Toc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      tree: null,
      loading: {},
      open: {},
      date: new Date()
    }
  }

  changeOpen(isOpen, e) {
    e.stopPropagation();
    this.setState({ isOpen });
  }

  componentDidMount() {
    this.getTree(this.props.sha);
  }

  getTree(sha) {
    let tree = this.getLocalTree(sha);
    if (!tree) {
      this.getRemoteTree(sha);
    } else {
      this.setState({
        tree
      });
    }
  }

  getLocalTree(childSha) {
    if (this.state.tree) {
      return this.state.tree[childSha];
    } else {
      let { sha } = this.props;
      let storageData = localStorage.getItem('crTree');
      if (!storageData) return false;
      storageData = JSON.parse(storageData);
      this.state.tree = storageData[sha];
      return this.state.tree;
    }
  }

  getRemoteTree(childSha) {
    this.state.loading[childSha] = true;
    this.setState({
      date: new Date()
    });
    let {user, repo, sha } = this.props;
    axios.get(`//api.github.com/repos/${user}/${repo}/git/trees/${childSha}`)
    .then((response) => {
      let storageData = JSON.parse(localStorage.getItem('crTree') || '{}');
      let mainTree = response.data.tree.map(treeItem => {
        return {
          path: treeItem.path,
          type: treeItem.type == 'tree' ? 1 : 0,
          sha: treeItem.sha,
        };
      }).sort((a, b) => {
        return b.type - a.type;
      });
      if (!storageData[sha]) storageData[sha] = {};
      storageData[sha][childSha] = mainTree;

      localStorage.setItem('crTree', JSON.stringify(storageData));
      if (childSha == sha) {
        this.setState({
          tree: storageData[sha]
        });
      } else {
        this.state.loading[childSha] = false;
        this.state.open[childSha] = true;
        this.setState({
          tree: storageData[sha],
          date: new Date()
        });
      }
    }).catch((error) => {
      console.log("err")
    });
    
    
  }

  closeTree(sha) {
    this.state.open[sha] = false;
    this.setState({
      date: new Date()
    });
  }

  openTree(sha) {
    this.state.open[sha] = true;
    this.setState({
      date: new Date()
    });
  }

  fileClick(sha, path, fullPath, e) {
    e.stopPropagation();
    this.setState({
      isOpen: false,
      date: new Date()
    });
    this.props.fileClick && this.props.fileClick({
      sha,
      path,
      fullPath
    });
  }
  /**
   * 
   * 状态包含4种：
   * 1. 未加载 treeItemNotLoad 显示关闭icon 点击后显示加载中
   * 2. 加载中 treeItemLoading 显示旋转icon
   * 3. 已加载、未展开
   * 3. 已加载、已展开
   */

  renderTree(sha, path) {
    let nowTree = this.state.tree[sha];
    if (nowTree == null) return null;
    if (!nowTree || !nowTree.map) return false;
    path = path || '';
    return <div>
      {
        nowTree.map(treeItem => {
          
          if (treeItem.type == 0) {
            return <div class="treeItemFile" onClick={this.fileClick.bind(this, treeItem.sha, treeItem.path, path + '/' + treeItem.path)}>{ treeItem.path }</div>;
          }
          let clickHandle = () => {};
          let className = 'treeItem';
          let child = this.renderTree(treeItem.sha, path + '/' + treeItem.path);

          if (child == null) {
            if (this.state.loading[treeItem.sha]) {
              className += ' treeItemLoading';
            } else {
              clickHandle = this.getRemoteTree.bind(this, treeItem.sha);
              className += ' treeItemNotLoad';
            }
          } else if (this.state.open[treeItem.sha]) {
            clickHandle = this.closeTree.bind(this, treeItem.sha);
            className += ' treeItemOpen';
          } else {
            clickHandle = this.openTree.bind(this, treeItem.sha);
          }
          return <div class={className}>
            <div class="treeItemPath" onClick={clickHandle}>{ treeItem.path }</div>
            { child }
          </div>
        })
      }
    </div>;
  }

  render() {
    let { isOpen, tree } = this.state;

    let { user, repo, sha } = this.props;
    return <div class="toc">
      { !isOpen && <div class="open" onClick={this.changeOpen.bind(this, true)}>Toc</div> }
      <div class={isOpen?'tocContainer tocContainerOpen': 'tocContainer'}>
        <div class="treeContainer">
          <div class="close">
            <span onClick={this.changeOpen.bind(this, false)}>Close</span>
          </div>
          <div class="tocTree">
            <div class="tocTreeRepo">{user} / {repo}</div>
            <div class="tocTreeTitle">Tree</div>
            {
              tree && this.renderTree(sha)
            }
          </div>
        </div>
        
      </div>
    </div>;
  }
}

export default Toc;

