let set = (name, value) => {
  let settingData = window.localStorage.getItem('crSetting') || '{}';
  try {
    settingData = JSON.parse(settingData);
  } catch (e) {
    settingData = {};
  }
  settingData[name] = value;
  window.localStorage.setItem('crSetting', JSON.stringify(settingData));
}

let get = (name) => {
  let settingData = window.localStorage.getItem('crSetting') || '{}';
  try {
    settingData = JSON.parse(settingData);
  } catch (e) {
    settingData = {};
  }
  return settingData[name];
}

export default {
  set,
  get
}