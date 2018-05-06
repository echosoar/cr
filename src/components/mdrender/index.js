'use strict';
import { Component } from 'preact'; /** @jsx h */
import Toc from './toc.js';
import TextRender from './text.js';
import SettingData from '_/utils/setting.js';
import Setting from '_/components/setting/index.js';

class MdRender extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toc: {},
      date: Date.now(),
      mdFontSize: SettingData.get('mdFontSize') || 14
    }

    
  }
  
  handleTocChange(index, toc) {
    this.state.toc[index] = toc;
    this.setState({
      date: Date.now()
    });
  }

  settingChange(type, value) {
    this.setState({
      [type]: value
    });
  }

  render() {
    let { toc, mdFontSize } = this.state;
    let { data, repo } = this.props;
    return <div class="post">
        <Toc data={ toc }/>
        <Setting type={['mdFontSize', 'autoScroll']} onChange={this.settingChange.bind(this)} />
        { data.data && <TextRender repo={repo} fontSize={this.state.mdFontSize} data={data.data} fullPath={data.fullPath} toc={this.handleTocChange.bind(this, 0)} getRemoteByPath={this.props.getRemoteByPath} /> }
    </div>;
  }
}

export default MdRender;