'use strict';
import { Component } from 'preact'; /** @jsx h */
import './index.less';

class Confirm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAlert: false,
      isOpen: false
    }

    window.crConfirm = {
      open: this.confirm.bind(this),
      close: this.onlyClose.bind(this)
    }
  }

  confirm(ele, ok, cancel) {
    if (this.state.isOpen) return;
    let isAlert = false;
    if (ok == 'alert') {
      ok = null;
      isAlert = true;
    }
    this.setState({
      isAlert,
      isOpen: true,
      ele,
      ok,
      cancel
    });
  }

  onlyClose() {
    this.setState({
      isOpen: false
    });
  }

  close() {
    this.setState({
      isOpen: false
    });
    this.state.cancel && this.state.cancel.handle && this.state.cancel.handle();
  }

  ok() {
    this.setState({
      isOpen: false
    });
    this.state.ok && this.state.ok.handle && this.state.ok.handle();
  }
  render() {
    let { isOpen, ele, ok, cancel, isAlert } = this.state;
    let { data, repo } = this.props;
    return <div class="confirm">
        {
          isOpen && ele && <div class="confirmContainer">
            <div class="content">
              { ele }
              
              {
                !isAlert ? <div class="btnContainer">
                  <div class="btnOk" onClick={this.ok.bind(this)}>{ ok && ok.text || 'Confirm' }</div>
                  <div class="btnCancel" onClick={this.close.bind(this)}>{ cancel && cancel.text || 'Cancel' }</div>
                </div>: <div class="btnClose" onClick={this.close.bind(this)}>Close</div>
              }
            </div>
          </div>
        }
    </div>;
  }
}

export default Confirm;