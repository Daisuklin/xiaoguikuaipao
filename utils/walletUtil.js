/*
*钱包专用接口文件
*/
// 接口地址
const requestUrlList = () => {
  var isTest = true
  if (!isTest) {
    var logisticsUrl = "https://logistics.xiaoguikuaipao.com";//寄件生产环境
    var requestUrl = 'https://api.xiaoguikuaipao.com';//商城生产环境
  } else {
    var logisticsUrl = "https://dev-logistics.xiaoguikuaipao.com";
    var requestUrl = 'https://dev-api.xiaoguikuaipao.com';
  }
  var getwallet = logisticsUrl + '/api/v1/onePayBalanceDetail/home' //收账本首页
  var addAssistants = logisticsUrl +'/api/v1/onePayEmployee/list' //店铺添加店员二维码
  var employeeAdd = logisticsUrl + '/api/v1/onePayEmployee/add/'//添加店员--确认添加
  var employeeDel = logisticsUrl + '/api/v1/onePayEmployee/del/'//添加店员--确认删除
  var employeeUpdate = logisticsUrl + '/api/v1/onePayEmployee/remark' //添加店员--修改备注
  var receiptslist = logisticsUrl + '/api/v1/onePayBalanceDetail/views' //收款记录(列表/查看)
  var receipStatistics = logisticsUrl + '/api/v1/onePayBalanceDetail/stat' //收入统计
  
  return {
    getwallet: getwallet,
    addAssistants: addAssistants,
    employeeAdd: employeeAdd,
    employeeDel: employeeDel,
    employeeUpdate: employeeUpdate,
    receiptslist: receiptslist,
    receipStatistics: receipStatistics,
  }
}
// 接口预调用
const controllerUtil = {
  // 收账本首页
  getwallet: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getwallet,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        succuess(data);
      },
      fail: function (data) {
        fail(data);
      },
      complete: function (data) {
        complete(data);
      }
    })
  },
  // 店铺添加店员二维码
  getAddAssistants: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().addAssistants,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        succuess(data);
      },
      fail: function (data) {
        fail(data);
      },
      complete: function (data) {
        complete(data);
      }
    })
  },
//添加店员--确认添加
  getemployeeAdd: (employeeId,paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().employeeAdd + employeeId,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        succuess(data);
      },
      fail: function (data) {
        fail(data);
      },
      complete: function (data) {
        complete(data);
      }
    })
  },
  //添加店员--确认删除
  getemployeeDel: (employeeId, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().employeeDel + employeeId,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        succuess(data);
      },
      fail: function (data) {
        fail(data);
      },
      complete: function (data) {
        complete(data);
      }
    })
  },
  //添加店员--修改备注
  getemployeeUpdate: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().employeeUpdate,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        succuess(data);
      },
      fail: function (data) {
        fail(data);
      },
      complete: function (data) {
        complete(data);
      }
    })
  },
  //收款记录(列表/查看)
  receiptslist: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().receiptslist,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        succuess(data);
      },
      fail: function (data) {
        fail(data);
      },
      complete: function (data) {
        complete(data);
      }
    })
  },
  // 收入统计
  getreceipStatistics: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().receipStatistics,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        succuess(data);
      },
      fail: function (data) {
        fail(data);
      },
      complete: function (data) {
        complete(data);
      }
    })
  },
}
// 获取本地数据
const appUtils = {
  getTokenData: () => {
    //得到的用户sessionkey
    return (undefined != typeof (wx.getStorageSync("token")) && wx.getStorageSync("token") != null) ? wx.getStorageSync("token") : null;
  },
  getUserData: () => {
    //得到的用户所开得店铺信息
    return (undefined != typeof (wx.getStorageSync("blackUserInfo")) && wx.getStorageSync("blackUserInfo") != null) ? wx.getStorageSync("blackUserInfo") : null;
  },
}

module.exports = {
  requestUrlList: requestUrlList,
  controllerUtil: controllerUtil,
  appUtils: appUtils,
  logisticsUrl:'https://dev-logistics.xiaoguikuaipao.com'
}