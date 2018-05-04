'use strict';
import { Component } from 'preact'; /** @jsx h */
import Toc from '_/components/toc/index.js';
import CodeRender from '_/components/code/index.js';
import GlobalCache from '_/utils/globalCache.js';
import Language from '_/utils/language.js';
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

  componentWillReceiveProps(newProps) {
    if (newProps.urlParams.fileSha && this.props.urlParams.fileSha != newProps.urlParams.fileSha) {
      this.props = newProps;
      this.changeNewFile(newProps.urlParams.fileSha);
    }
  }

  changeNewFile(newSha) {
    let { user, repo, sha } = this.props.urlParams;
    let newCode = GlobalCache.get('code', newSha);
    if (!newCode) return;
    this.setState({
      file: {
        sha: newSha,
        path: newCode.path,
        fullPath: newCode.fullPath
      }
    });
  }


  render() {
    let { user, repo, sha } = this.props.urlParams;
    
    let { file } = this.state;

    return <div class="code">
      <div class="title">{ Language('cr') }</div>
      <a href="#"><div class="return">{ Language('back') }</div></a>
      <Toc sha={sha} user={user} repo={repo} fileClick={this.fileClick.bind(this)} />
      <div class="codeContent">
        { file && <CodeRender file={file} urlParams={this.props.urlParams} /> }
      </div>
      
    </div>
  }
}

export default Code;

