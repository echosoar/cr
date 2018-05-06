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