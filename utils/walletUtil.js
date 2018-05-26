var PE = require("./publicEnvironment");
/*
*钱包专用接口文件
*/
// 接口地址
const requestUrlList = () => {
  var isTest = PE.isTest
  if (isTest) {
    var requestUrlShop = "https://attach.xiaoguikuaipao.com";//积分商城
    var logisticsUrl = "https://logistics.xiaoguikuaipao.com";//寄件生产环境
    var requestUrl = 'https://api.xiaoguikuaipao.com';//商城生产环境
  } else {
    var logisticsUrl = "https://dev-logistics.xiaoguikuaipao.com";
    var requestUrl = 'https://dev-api.xiaoguikuaipao.com';
    var requestUrlShop = "http://112.74.28.99:9527";//积分商城
  }
  var getwallet = logisticsUrl + '/api/v1/onePayBalanceDetail/home' //收账本首页
  var addAssistants = logisticsUrl + '/api/v1/onePayEmployee/list' //店铺添加店员二维码
  var employeeAdd = logisticsUrl + '/api/v1/onePayEmployee/add/'//添加店员--确认添加
  var employeeDel = logisticsUrl + '/api/v1/onePayEmployee/del/'//添加店员--确认删除
  var employeeUpdate = logisticsUrl + '/api/v1/onePayEmployee/remark' //添加店员--修改备注
  var receiptslist = logisticsUrl + '/api/v1/onePayBalanceDetail/views' //收款记录(列表/查看)
  var receipStatistics = logisticsUrl + '/api/v1/onePayBalanceDetail/stat' //收入统计
  var branchShopList = logisticsUrl + '/api/v1/profileOnePay/list' //分店列表 
  var newbranchStore = logisticsUrl + '/api/v1/profileOnePay/create' //新增分店
  var storeMain = logisticsUrl + '/api/v1/profileOnePay/main'// 创建分店的时候调用获取填充的信息
  var storeDetail = logisticsUrl + '/api/v1/profileOnePay/' //修改分店-获取分店详情
  var updateEditStore = logisticsUrl + '/api/v1/profileOnePay/update' //修改分店
  var delectStore = logisticsUrl + '/api/v1/profileOnePay/delete/'//删除分店
  var getrewardList = requestUrlShop + '/api/v1/bounty/findShardBounty'//获取奖励明细或奖励在途中列表
  var redqecode = logisticsUrl + '/api/v1/indexData/' //红包二维码页面
  return {
    getwallet: getwallet,
    addAssistants: addAssistants,
    employeeAdd: employeeAdd,
    employeeDel: employeeDel,
    employeeUpdate: employeeUpdate,
    receiptslist: receiptslist,
    receipStatistics: receipStatistics,
    logisticsUrl: logisticsUrl,
    branchShopList: branchShopList,
    newbranchStore: newbranchStore,
    storeMain: storeMain,
    storeDetail: storeDetail,
    updateEditStore: updateEditStore,
    delectStore: delectStore,
    getrewardList: getrewardList,
    redqecode: redqecode
  }
}
// 接口预调用
const controllerUtil = {
  // 红包二维码页面
  getredqecode: (id, profileId, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().redqecode + id + '/' + profileId,
      data: paras,
      method: 'GET',
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
  //获取奖励明细或奖励在途中列表
  getrewardList: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getrewardList,
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
  // 删除分店
  getdelectStore: (id, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().delectStore + id,
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
  //修改分店
  getupdateEditStore: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().updateEditStore,
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
  //修改分店-获取分店详情
  getStoreDetail: (id, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().storeDetail + id,
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
  // 创建分店的时候调用获取填充的信息
  getstoreMain: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().storeMain,
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
  // 新增分店
  getnewbranchStore: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().newbranchStore,
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
  // 分店列表
  getbranchShopList: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().branchShopList,
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
  // 收账本首页
  getwallet: (paras, succuess, fail, complete) => {
    if (appUtils.getShopIdData() != null && appUtils.getShopIdData() != "") {
      Object.assign(paras, {
        "profileOnePayId": appUtils.getShopIdData()
      })
    }
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
    if (appUtils.getShopIdData() != null && appUtils.getShopIdData() != "") {
      Object.assign(paras, {
        "profileOnePayId": appUtils.getShopIdData()
      })
    }
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
  getemployeeAdd: (employeeId, paras, succuess, fail, complete) => {
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
    if (appUtils.getShopIdData() != null && appUtils.getShopIdData() != "") {
      Object.assign(paras, {
        "profileOnePayId": appUtils.getShopIdData()
      })
    }
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
    if (appUtils.getShopIdData() != null && appUtils.getShopIdData() != "") {
      Object.assign(paras, {
        "profileOnePayId": appUtils.getShopIdData()
      })
    }
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
  getAddressVal: () => {
    //得到添加分店所需的地址信息
    return (undefined != typeof (wx.getStorageSync("addressVal")) && wx.getStorageSync("addressVal") != null) ? wx.getStorageSync("addressVal") : null;
  },
  getShopIdData: () => {
    //得到的用户所开得店铺信息
    return (undefined != typeof (wx.getStorageSync("shopId")) && wx.getStorageSync("shopId") != null) ? wx.getStorageSync("shopId") : null;
  },
  setShopIdData: (id) => {
    //得到的用户所开得店铺信息
    wx.setStorageSync('shopId', id)
  },
}

module.exports = {
  requestUrlList: requestUrlList,
  controllerUtil: controllerUtil,
  appUtils: appUtils,
  // logisticsUrl:'https://dev-logistics.xiaoguikuaipao.com',
  // logisticsUrl: 'https://logistics.xiaoguikuaipao.com'
}