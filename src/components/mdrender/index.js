'use strict';
import { Component } from 'preact'; /** @jsx h */
import Toc from './toc.js';
import TextRender from './text.js';

class MdRender extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toc: {},
      date: Date.now()
    }

    
  }
  
  handleTocChange(index, toc) {
    this.state.toc[index] = toc;
    this.setState({
      date: Date.now()
    });
  }

  render() {
    let { toc } = this.state;
    let { data, repo } = this.props;
    return <div class="post">
        <Toc data={ toc }/>
        { data.data && <TextRender repo={repo} data={data.data} fullPath={data.fullPath} toc={this.handleTocChange.bind(this, 0)} getRemoteByPath={this.props.getRemoteByPath} /> }
    </div>;
  }
}

export default MdRender;