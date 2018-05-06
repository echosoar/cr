'use strict';
import { Component } from 'preact'; /** @jsx h */
import SettingData from '_/utils/setting.js';
import Language from '_/utils/language.js';
import './index.less';

class Setting extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isOpen: false,
      mdFontSize: SettingData.get('mdFontSize') || 14
    }
    
  }
  
  changeOpen(isOpen, e) {
    e.stopPropagation();
    this.setState({ isOpen });
  }

  renderItem() {
    let { type } = this.props;
    if (!type || !type.length) return <span />;
    return <div>
      {
        type.map(item => {
          if (this['render_' + item.toLowerCase()]) {
            return this['render_' + item.toLowerCase()]();
          }
          return <span />;
        })
      }
    </div>
  }

  render_mdfontsize() {
    let nowValue = this.state.mdFontSize;
    return <div class="settingItem">
      <div class="settingItemTitle">{ Language('fontSize') }</div>
      <div class="settingFontSizeContainer">
        <div class="settingFontSizeContainerBtn add" onClick={this.change_mdfontsize.bind(this, 1)}></div>
        <div class="settingFontSizeContainerBtn jian" onClick={this.change_mdfontsize.bind(this, -1)}></div>
        { nowValue }
      </div>
    </div>
  }

  change_mdfontsize(zl) {
    let newValue = Math.ceil(this.state.mdFontSize - 0 + zl);
    if (newValue < 12 || newValue > 72) return;
    this.props.onChange && this.props.onChange('mdFontSize', newValue);
    SettingData.set('mdFontSize', newValue);
    this.setState({
      mdFontSize: newValue
    });
  }

  render() {
    
    let { type } = this.props;
    if (!type || !type.length) return <span />;

    let { isOpen } = this.state;

    return <div class="setting">
      <div class="settingOpenBtn" onClick={this.changeOpen.bind(this, true)}></div>
      { isOpen && <div class="settingPage">
        <div class="settingContainer">
          <div class="close">
            <span onClick={this.changeOpen.bind(this, false)}>{ Language('close') }</span>
          </div>
          <div class="title">{ Language('settingTitle') }</div>
          {
            this.renderItem()
          }
        </div>
      </div>}
    </div>;
  }
}

export default Setting;