import SettingData from './setting.js';

const data = {
  addBranch: {
    en: 'Add Branch',
    cn: '添加新分支'
  },
  addRepo: {
    en: 'Add Repo',
    cn: '添加新仓库'
  },
  addNewRepo: {
    en: 'Add New Repositorie',
    cn: '添加新仓库'
  },
  addNewRepoTip: {
    en: 'Please enter the repositorie\'s address \nE.g: https://github.com/echosoar/cr',
    cn: '请输入github仓库地址 \n例如: https://github.com/echosoar/cr'
  },
  autoScroll: {
    en: 'Automatic scrolling',
    cn: '自动滚屏'
  },
  autoScrollClose: {
    en: 'Closed, click to use',
    cn: '已关闭，点击使用'
  },
  back: {
    en: 'Back',
    cn: '返回'
  },
  branch: {
    en: 'Branch',
    cn: '分支'
  },
  branchList: {
    en: 'Branch List',
    cn: '分支列表'
  },
  by: {
    en: 'By',
    cn: '通过'
  },
  cancel: {
    en: 'Cancel',
    cn: '取消'
  },
  close: {
    en: 'Close',
    cn: '关闭'
  },
  commit: {
    en: 'Commit',
    cn: '提交记录'
  },
  confirm: {
    en: 'Confirm',
    cn: '确认'
  },
  cr: {
    en: 'Code Reader',
    cn: '代码阅读器'
  },
  enterHashTip: {
    en: 'Please enter the hash',
    cn: '请输入哈希（hash）值'
  },
  fileTree: {
    en: 'Tree',
    cn: '文件树'
  },
  fontSize: {
    en: 'Font Size',
    cn: '文字大小'
  },
  hash: {
    en: 'Hash',
    cn: '哈希值'
  },
  introduction: {
    en: <div class="introduction">
      <div class="introductionTitle">Guidelines for use</div>
      <div class="paragraph">CR is a Web application that helps you read Github code more easily and comfortably.</div>
      <div class="paragraph bold">How to use？</div>
      <div class="howTo">
        <div class="paragraph list">1. Click "Add Repo" to add a Git repository to this application</div>
        <div class="paragraph list">2. CR will help you pull his branch, recent Commit, or you manually enter the version of the SHA string, from which you can choose a branch of code you wish to read.</div>
      </div>
      <div class="paragraph">After a simple two-step process above, you can happily read the code on your mobile device.</div>
      <div class="paragraph">Currently, CR has made special optimizations for Markdown files, and the code has also been adapted to read on the mobile.</div>
      <div class="paragraph bold">If you have a better idea, you can submit an issue by clicking on the Github link at the bottom of the page. If you like this project you can give star, and you are interested in participating in this project.</div>
      <div class="paragraph">In addition, you can directly share the code you are reading to others by link. For example, directly opening the link below will automatically add the CR code to your reading list.</div>
      <a href="https://cr.js.org/#/code/echosoar/cr" target="_blank">https://cr.js.org/#/code/echosoar/cr</a>
    </div>,
    cn: <div class="introduction">
      <div class="introductionTitle">使用指引</div>
      <div class="paragraph">CR是一个无后端的Web应用，能够帮助你更加方便、舒适地阅读Github的代码。</div>
      <div class="paragraph bold">如何使用？</div>
      <div class="howTo">
        <div class="paragraph list">1. 点击上方的 “添加新仓库” 按钮添加一个Git仓库到本应用。</div>
        <div class="paragraph list">2. CR会帮您拉取他的分支、最近Commit，或者是你手动输入版本的SHA字符串，你可以从中选取一个你希望阅读的代码分支。</div>
      </div>
      <div class="paragraph">经过上面简单的两步你就可以愉快地在移动设备（手机、平板）上面阅读代码了。</div>
      <div class="paragraph">目前CR对于Markdown文件做了特殊的优化展示，对于代码也进行了适合在移动端阅读的适配。</div>
      <div class="paragraph bold">如果有更好的想法可以点击页面底部的Github链接提交 issue，如果喜欢这个项目可以给予 star ，有兴趣可以一起参与这个项目。</div>
      <div class="paragraph">另外你可以直接通过链接分享你正在阅读的代码给其他人，比如直接打开下面的链接就会自动添加 CR 的代码到你的阅读列表中</div>
      <a href="https://cr.js.org/#/code/echosoar/cr" target="_blank">https://cr.js.org/#/code/echosoar/cr</a>
    </div>
  },
  openLink: {
    en: 'Open Link',
    cn: '打开链接'
  },
  recentOpen: {
    en: 'Recent Open',
    cn: '最近打开'
  },
  settingTitle:{
    en: 'Setting',
    cn: '设置'
  },
  toc: {
    en: 'TOC',
    cn: '目录'
  }
}

let lang = (type) => {
  let language = SettingData.get('crlang') || 'cn';
  return data[type] && data[type][language] || type || '';
}
export default lang;