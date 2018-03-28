'use strict';
import { Component } from 'preact'; /** @jsx h */
import TimeFormat from '_/utils/timeFormat.js';
import Storage from '_/utils/storage.js';
import './index.less';

class RepoList extends Component {

  getList() {
    return <div class="listContainer">{
      Storage.RepoList().map(repo => {
        return <a class="listItem" href={'#/repo/' + repo.user + '/' + repo.repo}>
          <div class="listName">{repo.user} / {repo.repo}</div>
          <div class="listInfo">{ TimeFormat(repo.date, 'yyyy-MM-dd hh:mm:ss') }</div>
        </a>
      })
    }</div>;
  }

  render() {
    return <div class="repoList">
      <div class="title">Code Reader</div>
      <a href="#/add" class="add">+ Add Repo</a>
      {
        this.getList()
      }
    </div>
  }
}

export default RepoList;

