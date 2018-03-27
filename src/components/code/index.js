'use strict';
import { Component } from 'preact'; /** @jsx h */
import axios from 'axios/dist/axios';
import MdRender from '_/components/mdrender/index.js';
import Loading from '_/components/loading/index.js';
import libbase64 from 'libbase64';

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
    axios.get(`//api.github.com/repos/${user}/${repo}/git/blobs/` + sha)
    .then((response) => {
      let data = libbase64.decode(response.data.content).toString();
      this.setState({
        [sha]: {
          path,
          data,
          fullPath
        },
        loading: false,
        nowsha: sha
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
    this.setState({
      loading: true
    });
    axios.get(`//api.github.com/repos/${user}/${repo}/contents/` + path)
    .then((response) => {
      let sha = response.data.sha;
      let data = Base64.atob(response.data.content);
      this.setState({
        [sha]: {
          path: response.data.name,
          data,
          fullPath: path
        },
        loading: false,
        nowsha: sha
      });
    }).catch((error) => {
      this.setState({
        loading: false
      });
    });
  }

  renderCode() {
    let { nowsha, loading } = this.state;
    let data = this.state[nowsha];
    if (!data || loading) return <Loading />;
    return <MdRender data={ data } repo={this.props.repo} getRemoteByPath={this.getRemoteByPath.bind(this)}/>;
    return <div>{ data.data }</div>
  }

  render() {
    return <div>{ this.renderCode() }</div>;
  }
}

export default Code;

