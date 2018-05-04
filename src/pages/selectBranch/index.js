'use strict';
import { Component } from 'preact'; /** @jsx h */
import Loading from '_/components/loading/index.js';
import Storage from '_/utils/storage.js';
import Language from '_/utils/language.js';
import axios from 'axios/dist/axios';
import './index.less';

class SelectBranch extends Component {

  constructor(props) {
    super(props);
    
    let { sha } = this.props.urlParams;

    this.state = {
      isLoading: sha? false: true,
      branches: null,
      commits: null,
      nowType: sha? 'Hash' : 'Branch'
    }

    !sha && this.getBranch();
  }

  getBranch() {
    if (this.state.branches!= null) {
      return;
    }
    let {user, repo} = this.props.urlParams;
    // https://api.github.com/repos/:user/:repo/branches
    axios.get(`//api.github.com/repos/${user}/${repo}/branches`)
    .then((response) => {
      this.setState({
        isLoading: false,
        branches: response.data
      });
    }).catch((error) => {
      console.log(error)
      this.setState({
        isLoading: false
      });
    });
  }

  getCommit() {
    if (this.state.commits!= null) {
      return;
    }
    let {user, repo} = this.props.urlParams;
    this.setState({
      isLoading: true
    });
    axios.get(`//api.github.com/repos/${user}/${repo}/commits`)
    .then((response) => {
      this.setState({
        isLoading: false,
        commits: response.data
      });
    }).catch((error) => {
      this.setState({
        isLoading: false
      });
    });
  }

  addCommit(name, sha) {
    let {user, repo} = this.props.urlParams;
    Storage.BranchAdd(user, repo, name, sha);
    location.href = '#/';
  }

  changeType(type) {
    this.setState({
      nowType: type
    });
    this['get' + type] && this['get' + type]();
  }

  handleBack() {
    // history.back();
    location.href = '#';
  }

  addHashHandle() {
    let ele = document.getElementById('selectBranchTextarea');
    let sha = ele.value;
    if (!sha) return;
    let { user, repo } = this.props.urlParams;
    Storage.BranchAdd(user, repo, sha, sha);
    location.href = '#/';
  }
  
  render() {
    let {isLoading, branches, nowType, commits} = this.state;
    let {user, repo, sha} = this.props.urlParams;
    return <div class="selectBranch">
      <div class="title">
        { Language('by') }{
          ['Branch', 'Commit', 'Hash'].map(type => {
            return <span class={type == nowType? 'selected': ''} onClick={this.changeType.bind(this, type)}>{Language(type.toLowerCase())}</span>;
          })
        }
      </div>
      <div class="return" onClick={this.handleBack.bind(this)}>{ Language('back') }</div>
      <div class="user">
        <div class="listContainer">{user} / {repo}</div>
      </div>
      <div class="listContainer">
        
        {
          isLoading && <Loading />
        }
        {
          !isLoading && nowType == 'Branch' && branches!=null && branches.map(branch => {
            return <div class="branch" onClick={this.addCommit.bind(this, branch.name, branch.commit.sha)}>
              <div class="branchName">{ branch.name }</div>
              <div class="branchSha">{ branch.commit.sha }</div>
            </div>
          })
        }
        {
          !isLoading && nowType == 'Commit' && commits!=null && commits.map(commit => {
            return <div class="commit" onClick={this.addCommit.bind(this, commit.sha, commit.sha)}>
              <div class="commitMsg">{ commit.commit.message }</div>
              <div class="commitInfo">{ commit.commit.author.name } @ { commit.commit.author.date }</div>
            </div>
          })
        }
        {
          nowType == 'Hash' && <div class="hash">
            <textarea placeholder={ Language('enterHashTip') } id="selectBranchTextarea">{ sha }</textarea>
            <div class="button" onClick={this.addHashHandle.bind(this)}>{ Language('confirm') }</div>
          </div>
        }
      </div>
    </div>
  }
}

export default SelectBranch;

