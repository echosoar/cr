'use strict';
import { Component } from 'preact'; /** @jsx h */

import './index.less';

class Create extends Component {

  add() {
    let value = document.getElementById('addTextarea').value || '';

    if (value[value.length - 1]!= '/') value += '/';

    let mainMatchReg = /github\.com\/(.*?)\/(.*?)\//i;
    let mainMatchRes = mainMatchReg.exec(value);
    
    if (mainMatchRes[1] && mainMatchRes[2]) {
      location.href = '#/branch/' + mainMatchRes[1] + '/' + mainMatchRes[2];
    } else {
      // error
    }
  }

  handleBack() {
    history.back();
  }
  
  render() {
    return <div class="create">
      <div class="title">Add new repositorie</div>
      <div class="return" onClick={this.handleBack.bind(this)}>Back</div>
      <textarea placeholder="Please enter the repositorie's address\nE.g: https://github.com/echosoar/cr" id="addTextarea"></textarea>
      <div class="button" onClick={this.add.bind(this)}>Confirm</div>
    </div>
  }
}

export default Create;

