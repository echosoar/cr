'use strict';
import { Component } from 'preact'; /** @jsx h */
import Loading from '_/components/loading/index.js';
import axios from 'axios/dist/axios';
import './index.less';

class SelectBranch extends Component {

  constructor(props) {
    super(props);
    

    this.state = {
      isLoading: true,
      branches: null,
      commits: null,
      nowType: 'Branch'
    }

    this.getBranch();
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

  changeType(type) {
    this.setState({
      nowType: type
    });
    this['get' + type]();
  }
  
  render() {
    let {isLoading, branches, nowType, commits} = this.state;
    let {user, repo} = this.props.urlParams;
    return <div class="selectBranch">
      <div class="title">
        Select{
          ['Branch', 'Commit'].map(type => {
            return <span class={type == nowType? 'selected': ''} onClick={this.changeType.bind(this, type)}>{type}</span>;
          })
        }
      </div>
      <div class="user">{user}</div>
      <div class="repo">{repo}</div>
      {
        isLoading && <Loading />
      }
      {
        !isLoading && nowType == 'Branch' && branches!=null && branches.map(branch => {
          return <div class="branch">
            <div class="branchName">{ branch.name }</div>
            <div class="branchSha">{ branch.commit.sha }</div>
          </div>
        })
      }
      {
        !isLoading && nowType == 'Commit' && commits!=null && commits.map(commit => {
          return <div class="commit">
            <div class="commitMsg">{ commit.commit.message }</div>
            <div class="commitInfo">{ commit.commit.author.name } @ { commit.commit.author.date }</div>
          </div>
        })
      }
    </div>
  }
}

export default SelectBranch;

