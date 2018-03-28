'use strict';
import { Component } from 'preact'; /** @jsx h */
import axios from 'axios/dist/axios';
import MdRender from '_/components/mdrender/index.js';
import Loading from '_/components/loading/index.js';
import libbase64 from 'libbase64';
import './index.less';

let SupportFileReg = /(\.(?:gitignore|html|css|js|json|md|xml)|makefile|license)$/i;

class Code extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nowsha: ''
    };

    this.load(props.file);
  }

  componentWillReceiveProps(props) {
    this.load(props.file);
  }

  load(file) {
    if (!file) return;
    if (file.sha == this.state.nowsha) return;
    if (this.state[file.sha]) {
      this.setState({
        nowsha: file.sha
      });
    } else {
      this.getRemote(file);
    }
  }

  getRemote(file) {
    let { user, repo} = this.props.urlParams;
    let { sha, path, fullPath } = file;
    
    this.setState({
      loading: true
    });
    if (!SupportFileReg.test(fullPath)) {
      this.setState({
        [sha]: {
          path,
          data: '',
          fullPath
        },
        loading: false,
        nowsha: sha,
        [path]: sha
      });
      return;
    }
    axios.get(`//api.github.com/repos/${user}/${repo}/git/blobs/` + sha)
    .then((response) => {
      let data = libbase64.decode(response.data.content).toString();
      let path = 'path_' + fullPath.replace(/^\//, '');
      this.setState({
        [sha]: {
          path,
          data,
          fullPath
        },
        loading: false,
        nowsha: sha,
        [path]: sha
      });
    }).catch((error) => {
      console.log("getRemote error", error)
      this.setState({
        loading: false
      });
    });
  }

  getRemoteByPath(path) {
    let { user, repo} = this.props.urlParams;
    if (this.state['path_' + path]) {
      this.setState({
        nowsha: this.state['path_' + path]
      });
      return;
    }
    this.setState({
      loading: true
    });
    axios.get(`//api.github.com/repos/${user}/${repo}/contents/` + path)
    .then((response) => {
      let sha = response.data.sha;
      let data = libbase64.decode(response.data.content).toString();
      
      this.setState({
        [sha]: {
          path: response.data.name,
          data,
          fullPath: path
        },
        loading: false,
        nowsha: sha,
        ['path_' + path]: sha
      });
    }).catch((error) => {
      console.log(error)
      this.setState({
        loading: false
      });
    });
  }

  renderCode() {
    let { nowsha, loading } = this.state;
    let { user, repo, sha} = this.props.urlParams;
    let data = this.state[nowsha];
    if (!data || loading) return <Loading />;
    if (/\.md$/i.test(data.fullPath)) {
      return <MdRender data={ data } repo={this.props.repo} getRemoteByPath={this.getRemoteByPath.bind(this)}/>;
    } else if(SupportFileReg.test(data.fullPath)) {
      return <div>{ data.data }</div>
    } else {
      return <div class="notSupport">
        <div class="notSupportTip">{ data.path }</div>
        <div class="notSupportTip">not support file type</div>
        <a href={'//github.com/' + user + '/' + repo + '/tree/' + sha +  data.fullPath } class="toDownload" target="_blank" download>Click here to Github</a><br />
        <a href={'//github.com/' + user + '/' + repo + '/raw/' + sha +  data.fullPath } class="toDownload" target="_blank" download>Click here to Download</a>
        
      </div>;
    }
    
    
  }

  render() {
    return <div class="componentCode">{ this.renderCode() }</div>;
  }
}

export default Code;

