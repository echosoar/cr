let Storage = {}

Storage.RepoList = () => {
  let repoList = {};
  try {
    let storageData = localStorage.getItem('crRepoList') || '';
    repoList = JSON.parse(storageData);
  } catch(e){};
  
  return Object.keys(repoList).map(repo => {
    return repoList[repo];
  }).sort((a, b) => {
    return b.date - a.date;
  });
}

Storage.RepoCheck = (user, repo) => {
  let repoList = {};
  try {
    let storageData = localStorage.getItem('crRepoList') || '';
    repoList = JSON.parse(storageData);
  } catch(e){};
  let repoItem = repoList[user + '/' + repo];
  if (repoItem) return repoItem;
  return false;
}
/**
 * name 为分支名称，添加commit sha或者sha的时候为sha
 */
Storage.BranchAdd = (user, repo, name, sha) => {
  let repoList = {};
  try {
    let storageData = localStorage.getItem('crRepoList') || '';
    repoList = JSON.parse(storageData);
  } catch(e){};

  if (!repoList[user + '/' + repo]) {
    repoList[user + '/' + repo] = {
      date: new Date() - 0,
      branch: [],
      user,
      repo
    };
  }

  let nowIndex = -1;
  
  repoList[user + '/' + repo].branch.map((branch, index) => {
    if (branch.sha == sha) {
      nowIndex = index;
    }
  });
  
  let insertData = {
    sha,
    name,
    date: new Date() - 0
  };
  
  if (nowIndex != -1) {
    repoList[user + '/' + repo].branch.splice(nowIndex, 1);
  }
  repoList[user + '/' + repo].branch.unshift(insertData);
  repoList[user + '/' + repo].date = new Date() - 0;
  localStorage.setItem('crRepoList', JSON.stringify(repoList));
}

Storage.BranchCheck = (repoItem, sha) => {
  if (!repoItem.branch) return;
  let branch = repoItem.branch.find(branch => {
    if (branch.sha == sha) return branch;
    return false;
  });
  return branch;
}

Storage.checkURL = () => {
  let nowPath = location.hash || '';
  nowPath = nowPath.replace(/^(#\/|\/)/, '').replace(/\/$/, '').split('/');
  if (nowPath.length < 3) return;
  let user = nowPath[1], repo = nowPath[2], sha = nowPath[3] || '';

  let repoExists = Storage.RepoCheck(user, repo);
  if (!repoExists) location.href = '#/branch/' + user + '/' + repo;
  if (!sha) return;
  let branchExists = Storage.BranchCheck(repoExists, sha);
  // if repo and sha exists return;
  if (!branchExists) location.href = '#/branch/' + user + '/' + repo + '/' + sha;
}
export default Storage;