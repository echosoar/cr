'use strict';
import { Component } from 'preact'; /** @jsx h */
import axios from 'axios/dist/axios';
import MdRender from '_/components/mdrender/index.js';
import CommonCode from '_/components/commonCode/index.js';
import Loading from '_/components/loading/index.js';
import GlobalCache from '_/utils/globalCache.js';
import libbase64 from 'libbase64';
import './index.less';

let SupportFileReg = /(\.(?:c|cs|css|gitignore|go|h|html|java|js|json|jsx|m|map|md|php|podspec|ts|txt|vue|xml|xtpl|yml)|cname|license|makefile|rc)$/i;

class Code extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nowsha: ''
    };

    this.load(props.file);
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    this.load(newProps.file);
  }

  load(file) {
    if (!file) return;
    if (file.sha == this.state.nowsha) return;
    let cacheData = GlobalCache.get('code', file.sha);
    if (cacheData) {
      this.setState({
        nowsha: cacheData.sha
      });
    } else {
      this.getRemote(file);
    }
  }

  getRemote(file) {
    let { user, repo, sha: branch} = this.props.urlParams;
    let { sha, path, fullPath } = file;
    
    this.setState({
      loading: true
    });
    if (!SupportFileReg.test(fullPath)) {
      GlobalCache.add('code', sha, {
        branch: [user,repo,branch].join('/'),
        sha,
        path,
        data: '',
        fullPath
      });
      GlobalCache.add('path', path, sha);
      this.setState({
        loading: false,
        nowsha: sha
      });
      return;
    }
    axios.get(`//api.github.com/repos/${user}/${repo}/git/blobs/` + sha)
    .then((response) => {
      let data = libbase64.decode(response.data.content).toString();
      
      GlobalCache.add('code', sha, {
        branch: [user,repo,branch].join('/'),
        sha,
        path,
        data,
        fullPath
      });
      GlobalCache.add('path', path, sha);
      this.setState({
        loading: false,
        nowsha: sha
      });
    }).catch((error) => {
      this.handleError(error);
    });
  }

  handleError(error) {
    if (/403/.test(error + '')) {
      this.setState({
        loading: false
      });
      window.crConfirm.open(<div>
        <div class="confirmTitle">Error</div>
        <div class="confirmText">Github api rate limit exceeded</div>
      </div>, 'alert');
    } else {
      console.log(error);
    }
  }

  getRemoteByPath(fullPath) {

    let { user, repo, sha: branch } = this.props.urlParams;

    let path = fullPath.split('/').pop();

    let cachePath = GlobalCache.get('path', path);
    if (cachePath) {
      this.setState({
        nowsha: cachePath
      });
      return;
    }
    this.setState({
      loading: true
    });
    axios.get(`//api.github.com/repos/${user}/${repo}/contents/` + fullPath)
    .then((response) => {

      let sha = response.data.sha;
      let data = libbase64.decode(response.data.content).toString();

      GlobalCache.add('code', sha, {
        branch: [user,repo,branch].join('/'),
        sha,
        path,
        data,
        fullPath
      });
      GlobalCache.add('path', path, sha);
      this.setState({
        loading: false,
        nowsha: sha
      });
    }).catch((error) => {
      this.handleError(error);
    });
  }

  renderCode() {
    let { nowsha, loading } = this.state;
    let { user, repo, sha} = this.props.urlParams;
    let data = GlobalCache.get('code', nowsha);
    if (!data || loading) return <Loading />;
    if (/\.md$/i.test(data.fullPath)) {
      return <MdRender data={ data } repo={ this.props.urlParams } getRemoteByPath={this.getRemoteByPath.bind(this)}/>;
    } else if(SupportFileReg.test(data.fullPath)) {
      return <CommonCode data={data.data} />;
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

