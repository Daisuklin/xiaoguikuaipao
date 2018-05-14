var PE=require("./publicEnvironment");
const requestUrlList = () => {
  var isTest = PE.isTest
  if (isTest){
    // 正式
    var requestUrl = "https://attach.xiaoguikuaipao.com";
    // var requestUrlWeiLiang = "https://attach.xiaoguikuaipao.com";
    var logisticsUrl = "https://logistics.xiaoguikuaipao.com";
    var url = "https://logistics.xiaoguikuaipao.com";
    // 龟米说明
    var guimi_explain ="https://new.xiaoguikuaipao.com/index/point_goods/Analysis"
    var coupon_explain ="https://new.xiaoguikuaipao.com/index/point_goods/Coupon"
  }else{
    // 测试
    var logisticsUrl = "https://dev-logistics.xiaoguikuaipao.com";
    var requestUrl = "http://112.74.28.99:9527";//积分商城
    // var requestUrlWeiLiang = "http://112.74.28.99:9527";
    var url = "http://dev-logistics.xiaoguikuaipao.com"//配送接口
    var guimi_explain = "http://dev.xiaoguikuaipao.com/index/point_goods/Analysis"
    var coupon_explain = "http://dev.xiaoguikuaipao.com/index/point_goods/Coupon"
  // var url = "http://112.74.28.99:8081"//配送接口
  }
  var requestUrlWeiLiang = requestUrl;
  var integralHome = requestUrlWeiLiang + "/api/pointGoods/pointHome"//积分商城首页
  var getVouchers = requestUrlWeiLiang + "/api/pointGoods/getRedPacketList"//获取优惠券专区
  var getGifts = requestUrlWeiLiang + "/api/pointGoods/getGoodsList"//获取礼品专区
  var getUserDetails = requestUrlWeiLiang + "/api/userPoint/getUserPointLogList"//获取用户积分数据
  var getVoucherDetails = requestUrlWeiLiang + "/api/pointGoods/getRedPacket/"//获取优惠券详情
  var exchangeVoucher = requestUrlWeiLiang + "/api/userPacket/buyPacket"//兑换优惠券
  var getGiftDetails = requestUrlWeiLiang + "/api/pointGoods/getGoods/"//回去礼品详情
  var exchangeProduct = requestUrlWeiLiang + "/api/goodsOrder/createOrder"//兑换礼品
  var getExchangeOrders = requestUrlWeiLiang + "/api/goodsOrder/getOrderList"//获取兑换订单列表
  var getOrderDetails = requestUrlWeiLiang + "/api/goodsOrder/getOrder/"//获取兑换订单详情
  var sendIntagral = requestUrlWeiLiang + "/api/userPoint/shiftPoint"//赠送龟米
  var getStoreVouchers = requestUrl + "/api/userPacket/checkPacket"//获取优惠券
  var getMyVouchers = requestUrl + "/api/userPacket"//从平台进去查看优惠券列表
  var getMoney = requestUrl + ""
  var getAcountMoney = requestUrl + ""
  var gerUserVaI = requestUrl + "/api/commons/v1/checkPacketPoint"//获取用户的龟米和优惠券数量
  var addSafePassword = url + "/api/v1/profiles/auth/safePassword"//设置安全密码
  var getCodeFromServer = url + "/api/v1/captcha"//获取验证码
  var comfirmGetGood = url + "/api/goodsOrder/sign4User/"//确认收货
  var comfirmGetGood = requestUrlWeiLiang + "/api/goodsOrder/sign4User/"

  var getAccountDetails = logisticsUrl + '/api/v1/onePayBalanceDetail/view/' //已到账详情 id
  var getfindAnalysis = requestUrl + '/api/analysis/findAnalysis' //获取优惠卷和龟米说明文本 type =coupon(优惠卷说明),gold(龟米说明)
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
    guimi_explain: guimi_explain,
    coupon_explain: coupon_explain,
    getfindAnalysis: getfindAnalysis
  }
}
const controllerUtil = {
  // 获取优惠卷和龟米说明文本
  getfindAnalysis: (paras, succuess, fail, complete) =>{
    wx.request({
      url: requestUrlList().getfindAnalysis,
      data: paras,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        // 'Authorization': appUtils.getTokenData(),
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
  },
  // 获取年/月/日 时:分
  getDateTimes: (timeStamp) => {
    var date = new Date(timeStamp);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月  
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();//日  
    var hours = date.getHours();//时  
    var mint = date.getMinutes();//分  
    if (mint < 10) {
      mint = "0" + mint;
    } else {
      mint = mint;
    }
    var Sec = date.getSeconds();//秒
    return year + "/" + month + "/" + day + " " + hours + ":" + mint + ":" + Sec;
  }
}
module.exports = {
  requestUrlList: requestUrlList,
  controllerUtil: controllerUtil,
  appUtils: appUtils
} 