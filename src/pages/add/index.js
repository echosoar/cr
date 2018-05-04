'use strict';
import { Component } from 'preact'; /** @jsx h */
import Language from '_/utils/language.js';
import './index.less';

class Create extends Component {

  add() {
    let value = document.getElementById('addTextarea').value || '';

    if (value[value.length - 1]!= '/') value += '/';

    let mainMatchReg = /github\.com\/(.*?)\/(.*?)(?:\/|$)/i;
    let mainMatchRes = mainMatchReg.exec(value);
    
    if (mainMatchRes[1] && mainMatchRes[2]) {
      location.href = '#/branch/' + mainMatchRes[1] + '/' + mainMatchRes[2].replace(/#.*$/i, '');
    } else {
      // error
    }
  }

  handleBack() {
    history.back();
  }
  
  render() {
    return <div class="create">
      <div class="title">{ Language('addNewRepo') }</div>
      <div class="return" onClick={this.handleBack.bind(this)}>{ Language('back') }</div>
      <textarea placeholder={ Language('addNewRepoTip') } id="addTextarea"></textarea>
      <div class="button" onClick={this.add.bind(this)}>{ Language('confirm') }</div>
    </div>
  }
}

export default Create;

