// global cache data
// 1. file data

/**
 * {
 *  name,
 *  date,
 *  data
 * }
 */
class GlobalCache {
  constructor() {
    if (!window.crGlobalCache) window.crGlobalCache = {};

    this.dataCacheSizeDefault = 6;
    this.dataCacheSizeType = {
      code: 20
    }
  }

  add(type, name, data) {
    let size = this.dataCacheSizeType[type] || this.dataCacheSizeDefault;
    if (!window.crGlobalCache[type]) window.crGlobalCache[type] = [];

    let cacheIndex = this.getIndex(name, window.crGlobalCache[type]);
    if (cacheIndex) {
      data = window.crGlobalCache[type][cacheIndex].data;
      window.crGlobalCache[type].splice(cacheIndex, 1);
    }
    if (window.crGlobalCache[type].length >= size -1) {
      window.crGlobalCache[type].pop();
    }
    window.crGlobalCache[type].unshift({
      name,
      date: new Date() - 0,
      data
    });
  }

  getIndex(name, cacheData) {
    let matchIndex = null;
    cacheData.map((item, index) => {
      if (item.name == name) matchIndex = index;
    });
    return matchIndex;
  }

  get(type, name) {
    if (!window.crGlobalCache[type]) return null;
    if (!name) return window.crGlobalCache[type];
    let cacheIndex = this.getIndex(name, window.crGlobalCache[type]);
    if (cacheIndex == null) return;
    let data = window.crGlobalCache[type][cacheIndex].data;
    window.crGlobalCache[type].splice(cacheIndex, 1);
    window.crGlobalCache[type].unshift({
      name,
      date: new Date() - 0,
      data
    });
    return data;
  }

}

export default new GlobalCache();