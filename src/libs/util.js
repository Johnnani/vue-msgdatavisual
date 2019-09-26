let util = {};
// 页面适配
util.adapt = function () {
  let desW = 1920;
  let winW = document.documentElement.clientWidth;
  document.documentElement.style.fontSize = winW / desW * 100 + "px";
}
//数组arr的对象元素中筛选属性名propertyName值为value的元素
// 数组对象根据某个属性进行过滤
util.filterByProperty = function(arr,propertyKey,propertyValue){
  let isArray = Object.prototype.toString.call(arr) === '[object Array]';
  if(!isArray){
    return null;
  }
  let res = arr.filter(item => item[propertyKey] === propertyValue)// filter 筛选出返回数组，否则返回空数组
  return res.length ? res : null;
}
//数组arr的对象元素，按某个属性进行排序（降序）
util.sortByProperty = function (arr,property){
  let isArray = Object.prototype.toString.call(arr) === '[object Array]';
  if(!isArray){
    return arr;
  }
  return arr.sort((param1,param2) => {
    let value1 = param1[property];
    let value2 = param2[property];
    return value1 - value2;
  })
}
// 数字加千位分隔符
util.formatNumber = function (n) {
  let b = parseInt(n).toString();
  let len = b.length;
  if (len <= 3) return b;
  let r = len % 3;
  return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',');
};
export default util;