const requestUrlList = () => {
  var devrequestUrl = "https://dev-api.xiaoguikuaipao.com"
  var logisticsUrl = "https://dev-logistics.xiaoguikuaipao.com";
  var requestUrl = "http://112.74.28.99:9527";
  var requestUrlWeiLiang = "http://112.74.28.99:9527";
  var url = "http://112.74.28.99:8081"
  var integralHome = requestUrlWeiLiang + "/api/pointGoods/pointHome"
  var getVouchers = requestUrlWeiLiang + "/api/pointGoods/getRedPacketList"
  var getGifts = requestUrlWeiLiang + "/api/pointGoods/getGoodsList"
  var getUserDetails = requestUrlWeiLiang + "/api/userPoint/getUserPointLogList"
  var getVoucherDetails = requestUrlWeiLiang + "/api/pointGoods/getRedPacket/"
  var exchangeVoucher = requestUrlWeiLiang + "/api/userPacket/buyPacket"
  var getGiftDetails = requestUrlWeiLiang + "/api/pointGoods/getGoods/"
  var exchangeProduct = requestUrlWeiLiang + "/api/goodsOrder/createOrder"
  var getExchangeOrders = requestUrlWeiLiang + "/api/goodsOrder/getOrderList"
  var getOrderDetails = requestUrlWeiLiang + "/api/goodsOrder/getOrder/"
  var sendIntagral = requestUrlWeiLiang + "/api/userPoint/shiftPoint"
  var getStoreVouchers = requestUrl + "/api/userPacket/checkPacket"//获取优惠券
  var getMyVouchers = requestUrl + "/api/userPacket"
  var getMoney = requestUrl + ""
  var getAcountMoney = requestUrl + ""
  var gerUserVaI = requestUrl + "/api/commons/v1/checkPacketPoint"
  var addSafePassword = url + "/api/v1/profiles/auth/safePassword"
  var getCodeFromServer = url + "/api/v1/captcha"
  var comfirmGetGood = url + "/api/goodsOrder/sign4User/"
  var comfirmGetGood = requestUrlWeiLiang + "/api/goodsOrder/sign4User/"

  var getAccountDetails = logisticsUrl + '/api/v1/onePayBalanceDetail/view/' //已到账详情 id
  return {
    integralHome: integralHome,
    getVouchers: getVouchers,
    getGifts: getGifts,
    getUserDetails: getUserDetails,
    getVoucherDetails: getVoucherDetails,
    exchangeVoucher: exchangeVoucher,
    getGiftDetails: getGiftDetails,
    exchangeProduct: exchangeProduct,
    getExchangeOrders: getExchangeOrders,
    getOrderDetails: getOrderDetails,
    sendIntagral: sendIntagral,
    getStoreVouchers: getStoreVouchers,
    getMyVouchers: getMyVouchers,
    getMoney: getMoney,
    getAcountMoney: getAcountMoney,
    gerUserVaI: gerUserVaI,
    addSafePassword: addSafePassword,
    getCodeFromServer: getCodeFromServer,
    getAccountDetails: getAccountDetails,
  }
}
const controllerUtil = {
  // 已到账详情
  getAccountDetails: (id, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getAccountDetails + id,
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
  comfirmGetGood: (id, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().comfirmGetGood + id,
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
  getCodeFromServer: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getCodeFromServer,
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
  addSafePassword: (method, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().addSafePassword,
      data: paras,
      method: method,
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
  getUserVaI: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().gerUserVaI,
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
  //得到账号金额TODO
  getAcountMoney: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getAcountMoney,
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
  //提现TODO
  getMoney: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getMoney,
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

  getMyVouchers: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getMyVouchers,
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
  getStoreVouchers: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getStoreVouchers,
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
  sendIntagral: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().sendIntagral,
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
  getOrderDetails: (orderId, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getOrderDetails + orderId,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': appUtils.getTokenData(),
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
  getExchangeOrders: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getExchangeOrders,
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
  exchangeProduct: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().exchangeProduct,
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
  getGiftDetails: (goodId, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getGiftDetails + goodId,
      data: paras,
      method: 'GET',
      header: {
        'content-type': 'application/json'
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
  exchangeVoucher: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().exchangeVoucher,
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
  getVoucherDetails: (voucherId, paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getVoucherDetails + voucherId,
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
  getUserDetails: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getUserDetails,
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
  integralHome: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().integralHome,
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
  getVouchers: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getVouchers,
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
  getGifts: (paras, succuess, fail, complete) => {
    wx.request({
      url: requestUrlList().getGifts,
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
const appUtils = {
  getTokenData: () => {
    //得到的用户sessionkey
    return (undefined != typeof (wx.getStorageSync("token")) && wx.getStorageSync("token") != null) ? wx.getStorageSync("token") : null;
  },
  getDateFormat: (oldTime) => {
    var date = new Date(oldTime);
    var year = date.getFullYear();
    var month = parseInt(date.getMonth()) + 1;
    var day = date.getDate();
    return year + "-" + month + "-" + day;
  }
}
module.exports = {
  requestUrlList: requestUrlList,
  controllerUtil: controllerUtil,
  appUtils: appUtils
} 