'use strict';

import { h, Component, render } from 'preact';

import Base from '_/components/base/index.js';
import Add from '_/pages/add/index.js';
import SelectBranch from '_/pages/selectBranch/index.js';

const Cr = () => {
  return <Base>
    <Add path="/add" />
    <SelectBranch path="/branch/:user/:repo" />
  </Base>;
}


render(<Cr />, document.getElementById('container'));