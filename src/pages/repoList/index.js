'use strict';

import { Component } from 'preact'; /** @jsx h */
import TimeFormat from '_/utils/timeFormat.js';
import Storage from '_/utils/storage.js';
import Setting from '_/components/setting/index.js';
import Language from '_/utils/language.js';
import './index.less';

class RepoList extends Component {

  getList(repoList) {
    return <div class="listContainer">{
      repoList.map(repo => {
        return <a class="listItem" href={'#/repo/' + repo.user + '/' + repo.repo}>
          <div class="listName">{repo.user} / {repo.repo}</div>
          <div class="listInfo">{ TimeFormat(repo.date, 'yyyy-MM-dd hh:mm:ss') }</div>
        </a>
      })
    }</div>;
  }

  render() {

    let repoList = Storage.RepoList();
    return <div class="repoList">
      <div class="title">{ Language('cr') }</div>
      <Setting type={['language']} />
      <a href="#/add" class="add">+ { Language('addRepo') }</a>
      {
        repoList && repoList.length ? this.getList(repoList) : Language('introduction')
      }
    </div>
  }
}

export default RepoList;

