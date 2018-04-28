'use strict';
import { Component } from 'preact'; /** @jsx h */
import TimeFormat from '_/utils/timeFormat.js';
import Storage from '_/utils/storage.js';
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

  introduction() {
    return <div class="introduction">
      <div class="introductionTitle">Guidelines for use</div>
      <div class="paragraph">CR is a Web application that helps you read Github code more easily and comfortably.</div>
      <div class="paragraph bold">How to use？</div>
      <div class="howTo">
        <div class="paragraph list">1. Click "Add Repo" in the upper right corner to add a Git repository to this application</div>
        <div class="paragraph list">2. CR will help you pull his branch, recent Commit, or you manually enter the version of the SHA string, from which you can choose a branch of code you wish to read.</div>
      </div>
      <div class="paragraph">After a simple two-step process above, you can happily read the code on your mobile device.</div>
      <div class="paragraph">Currently, CR has made special optimizations for Markdown files, and the code has also been adapted to read on the mobile.</div>
      <div class="paragraph bold">If you have a better idea, you can submit an issue by clicking on the Github link at the bottom of the page. If you like this project you can give star, and you are interested in participating in this project.</div>
      <div class="paragraph">In addition, you can directly share the code you are reading to others by link. For example, directly opening the link below will automatically add the CR code to your reading list.</div>
      <a href="https://cr.js.org/#/code/echosoar/cr" target="_blank">https://cr.js.org/#/code/echosoar/cr</a>

      <div class="introductionTitle">使用指引</div>
      <div class="paragraph">CR是一个无后端的Web应用，能够帮助你更加方便、舒适地阅读Github的代码。</div>
      <div class="paragraph bold">如何使用？</div>
      <div class="howTo">
        <div class="paragraph list">1. 点击右上角的 “Add Repo” 添加一个Git仓库到本应用。</div>
        <div class="paragraph list">2. CR会帮您拉取他的分支、最近Commit，或者是你手动输入版本的SHA字符串，你可以从中选取一个你希望阅读的代码分支。</div>
      </div>
      <div class="paragraph">经过上面简单的两步你就可以愉快地在移动设备（手机、平板）上面阅读代码了。</div>
      <div class="paragraph">目前CR对于Markdown文件做了特殊的优化展示，对于代码也进行了适合在移动端阅读的适配。</div>
      <div class="paragraph bold">如果有更好的想法可以点击页面底部的Github链接提交 issue，如果喜欢这个项目可以给予 star ，有兴趣可以一起参与这个项目。</div>
      <div class="paragraph">另外你可以直接通过链接分享你正在阅读的代码给其他人，比如直接打开下面的链接就会自动添加 CR 的代码到你的阅读列表中</div>
      <a href="https://cr.js.org/#/code/echosoar/cr" target="_blank">https://cr.js.org/#/code/echosoar/cr</a>
    </div>;
  }

  render() {

    let repoList = Storage.RepoList();
    return <div class="repoList">
      <div class="title">Code Reader</div>
      <a href="#/add" class="add">+ Add Repo</a>
      {
        repoList && repoList.length ? this.getList(repoList) : this.introduction()
      }
    </div>
  }
}

export default RepoList;

