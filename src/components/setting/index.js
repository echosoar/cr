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
      autoScroll: false,
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
        <div class="settingFontSizeContainerBtn subtract" onClick={this.change_mdfontsize.bind(this, -1)}></div>
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

  render_language() {
    let nowLang = SettingData.get('crlang') || 'cn';
    return <div class="settingItem">
      <div class="settingItemTitle">Language</div>
      {
        [{
          title: '中文',
          value: 'cn'
        }, {
          title: 'English',
          value: 'en'
        }].map(item => {
          return <div class="settingLanguageBtn" onClick={this.change_language.bind(this, item.value)}>
            { item.title }
            { item.value == nowLang && <div class="settingLanguageBtnSelected" />}  
          </div>;
        })
      }
    </div>
  }

  change_language(lang) {
    SettingData.set('crlang', lang);
    location.reload();
  }

  render_autoscroll() {
    return <div class="settingItem">
      <div class="settingItemTitle">{ Language('autoScroll') }</div>
      <div class="settingItemAutoScroll" onClick={this.change_autoscroll.bind(this)}>
        { Language('autoScrollClose') }
        <div class="settingItemAutoScrollBtn"></div>
      </div>
    </div>
  }

  change_autoscroll() {
    this.setState({ isOpen: false, autoScroll: true });
  }

  render() {
    
    let { type } = this.props;
    if (!type || !type.length) return <span />;

    let { isOpen, autoScroll } = this.state;

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
      {
        autoScroll && <div class="settingAutoScroll">
          <div class="settingAutoScrollContainer">
          
        </div>
        </div>
      }
    </div>;
  }
}

export default Setting;