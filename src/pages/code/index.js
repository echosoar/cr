'use strict';
import { Component } from 'preact'; /** @jsx h */
import Toc from '_/components/toc/index.js';
import CodeRender from '_/components/code/index.js';
import './index.less';

class Code extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null
    }
  }

  fileClick(file) {
    this.setState({
      file
    });
  }

  handleBack() {
    history.back();
  }

  render() {
    let { user, repo, sha } = this.props.urlParams;
    let { file } = this.state;
    return <div class="code">
      <div class="title">Code</div>
      <div class="return" onClick={this.handleBack.bind(this)}>Back</div>
      <Toc sha={sha} user={user} repo={repo} fileClick={this.fileClick.bind(this)} />
      <div class="codeContent">
        { file && <CodeRender repo={this.props.urlParams} file={file} urlParams={this.props.urlParams} /> }
      </div>
      
    </div>
  }
}

export default Code;

