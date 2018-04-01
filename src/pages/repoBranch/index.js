'use strict';
import { Component } from 'preact'; /** @jsx h */
import TimeFormat from '_/utils/timeFormat.js';
import Storage from '_/utils/storage.js';
import './index.less';

class RepoBranch extends Component {

  getList() {
    let {user, repo} = this.props.urlParams;

    return <div>{
      Storage.BranchList(user, repo).map(rep => {
        return <a class="branchItem" href={'#/code/' + user + '/' + repo + '/' + rep.sha}>
          <div class="branchName">{rep.name || rep.sha}</div>
          <div class="branchInfo">{ TimeFormat(rep.date, 'yyyy-MM-dd hh:mm:ss') }</div>
        </a>
      })
    }</div>;
  }

  handleBack() {
    history.back();
  }

  render() {
    let {user, repo} = this.props.urlParams;

    return <div class="branchList">
      <div class="title">Branch List</div>
      <div class="return" onClick={this.handleBack.bind(this)}>Back</div>
      <a href={'#/branch/' + user + '/' + repo} class="add">+ Add Branch</a>
      <div class="user">
        <div class="listContainer">{user} / {repo}</div>
      </div>
      <div class="listContainer">
        { this.getList() }
      </div>
    </div>
  }
}

export default RepoBranch;

