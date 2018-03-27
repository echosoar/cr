'use strict';
import { Component } from 'preact'; /** @jsx h */
import './toc.less';
class Toc extends Component {

  constructor(props) {
    this.state = {
      isOpen: false
    }

    this.levelQueue = [];
    window.mdTocClick = this.handleTocClick.bind(this);
  }

  handleClick(isOpen) {
    this.setState({
      isOpen
    });
  }

  handleSkip(anchor) {
    let ele = document.getElementById(anchor);
    if (!ele) return;
    let posi = ele.getBoundingClientRect();
    window.scrollTo({ top: posi.top - 60 });
  }

  renderToc(toc, degree) {
    if (!toc.child) return '';
    return <div class="toc-container">{
      toc.child.map((item, index) => {
        return <div>
          <a class="toc-item" onClick={this.handleSkip.bind(this, item.anchor)}>{index + 1}. { item.title }</a>
          {
            item.child.length ? <div class="toc-child">
              {
                this.renderToc(item, degree + 1)
              }
            </div> : ''
          }
        </div>;
      })
    }</div>



    return <div class="toc-container">{
      Object.keys(this.props.data).map(key => {
        return <div>{
          this.props.data[key] && this.props.data[key].map(item => {

            let style = {
              'padding-left': (item.level - 1) * 24 + 'px'
            }
            return <a class="toc-item" href={'#' + item.anchor } style={style}>{ item.text }</a>;
          })
        }</div>;
      })
    }</div>

  }

  filterHavaItem() {
    return Object.keys(this.props.data).some(key => {
      if (this.props.data[key] && this.props.data[key].length) {
        return true;
      };
    });
  }


  execData() {
    /**
     * [
     * {
     *  title:
     *  anchor: []
     *  child: []
     * }]
     */

     /**
      * 如果当期anchor小于上一级的anchor那么就是上一级的child
      * 如果当前anchor等于上一级，那么平等
      * 如果当前anchor大于上一级从根节点最后一个开始对比
      */
      let toc = {
        title: 'toc',
        anchor: '',
        level: 0,
        child: []
      };
      
      Object.keys(this.props.data).map(key => {
        
        this.props.data[key] && this.props.data[key].map(item => {
 
            let last = toc;
            let ischeck = false;
            while(item.level > last.level && !ischeck) {
              if (last.child.length) {
                let temNode = last.child[last.child.length - 1];
                if (item.level > temNode.level) {
                  last = temNode;
                } else {
                  ischeck = true;
                }
              } else {
                ischeck = true;
              }
            }

            last.child.push({
              title: item.text,
              anchor: item.anchor,
              level: item.level,
              child: []
            });

        });
      });
      return toc;
  }

  handleTocClick() {
    let ele = document.getElementById('cr-md-toc');
    if (!ele) return;
    let posi = ele.getBoundingClientRect();
    window.scrollTo({ top: posi.top - 60 });
  }

  render() {
    if (!this.filterHavaItem()) return <span />;
    
    let toc = this.execData();

    let { isOpen } = this.state;
    return <div class='toc-main'>
      <a id="cr-md-toc">&nbsp;</a>
      {
        isOpen && this.renderToc(toc, 1)
      }
      <div class="toc-button" onClick={this.handleClick.bind(this, !isOpen)}>{
        isOpen ? '- Close Toc' : '+ Open Toc'
      }</div>
    </div>
  }
}

export default Toc;