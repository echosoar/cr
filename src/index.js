'use strict';

import { h, Component, render } from 'preact';

import Base from '_/components/base/index.js';
import Confirm from '_/components/confirm/index.js';
import Add from '_/pages/add/index.js';
import Code from '_/pages/code/index.js';
import SelectBranch from '_/pages/selectBranch/index.js';
import RepoList from '_/pages/repoList/index.js';
import RepoBranch from '_/pages/repoBranch/index.js';


const Cr = () => {
  return <Base>
    <Confirm />
    <RepoList home />
    <Add path="/add" />
    <Code path="/code/:user/:repo/:sha" />
    <RepoBranch path="/repo/:user/:repo" />
    <SelectBranch path="/branch/:user/:repo/(:sha)" />
  </Base>;
}


render(<Cr />, document.getElementById('container'));