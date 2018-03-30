'use strict';
import { Component } from 'preact'; /** @jsx h */
import axios from 'axios/dist/axios';
import GlobalCache from '_/utils/globalCache.js';
import './index.less';

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

  componentWillReceiveProps(newProps) {
    if (newProps.sha != this.props.sha) {
      this.props = newProps;
      this.getTree(newProps.sha);
    }
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

  fileClick(sha, path, fullPath, otherBranch,e) {
    e.stopPropagation();
    this.setState({
      isOpen: false,
      date: new Date()
    });
    if (otherBranch) {
      location.href = '#/code/' + otherBranch + '/' + sha;
    } else {
      this.props.fileClick && this.props.fileClick({
        sha,
        path,
        fullPath
      });
    }
  }


  renderTree(sha, path) {
    let nowTree = this.state.tree[sha];
    if (nowTree == null) return null;
    if (!nowTree || !nowTree.map) return false;
    path = path || '';
    return <div>
      {
        nowTree.map(treeItem => {
          
          if (treeItem.type == 0) {
            return <div class="treeItemFile" onClick={this.fileClick.bind(this, treeItem.sha, treeItem.path, path + '/' + treeItem.path, null)}>{ treeItem.path }</div>;
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
    let nowBranch = [user, repo, sha].join('/');
    let recent = GlobalCache.get('code');
    return <div class="toc">
      { !isOpen && <div class="open" onClick={this.changeOpen.bind(this, true)}>Toc</div> }
      <div class={isOpen?'tocContainer tocContainerOpen': 'tocContainer'}>
        <div class="treeContainer">
          <div class="close">
            <span onClick={this.changeOpen.bind(this, false)}>Close</span>
          </div>
          <div class="tocTree">
            <div class="tocTreeRepo">{user} / {repo}</div>
            { recent && <div>
              <div class="tocTreeTitle">Recent</div>
              {
                recent.slice(0, 5).map(item => {
                  let className = 'treeItemFile';
                  let otherBranch = null;
                  if (item.data.branch != nowBranch) {
                    otherBranch = item.data.branch;
                    className += ' treeItemFileOuter';
                  }
                  return <div class={className} onClick={this.fileClick.bind(this, item.data.sha, item.data.path, item.data.fullPath, otherBranch)}>{ item.data.path }</div>;
                })
              }
            </div>}
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

