//app.js
var appUtil = require("/utils/appUtil.js")
var amapFile = require('/utils/amap-wx.js');
App({
  userSetFunction: function () {
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          appUtil.controllerUtil.getUserOpenIdController({ code: res.code }, function (res) {
            appUtil.appUtils.setSessionkeyData(res.data.data.session_key);
            appUtil.appUtils.setOpenIdData(res.data.data.openid);
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  initLoction:function(){
    
    var myAmapFun = new amapFile.AMapWX({
      key: 'd0063cd5d8e04b14dfe98eae69dc9617'
    });
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        console.log("获取的位置信息1");
        console.log(data);
        var areaCode = data[0].regeocodeData.addressComponent.adcode;
        var latitude = data["0"].latitude;
        var longitude = data["0"].longitude;
        var addrName = data["0"].desc;
        wx.setStorageSync("latitude", latitude);
        wx.setStorageSync("longitude", longitude);
        wx.setStorageSync("areaCode", areaCode);
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    appUtil.lrhMethods.initPageState();
    this.initLoction();
    this.userSetFunction();

    wx.getSetting({
      success: (res) => {
        console.info(res);
        //授权判断
        if (!res.authSetting['scope.userInfo']) {
          //未授权激活授权
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              wx.getUserInfo({
                success: (res) => {

                }
              })
            }
          })
        }
      }
    })
    this.clearMySelfStorage();
    this.clearStoreDataInStorage();
  },
  clearStoreDataInStorage:function(){
    wx.removeStorageSync("nowCheckStroreId");
    wx.removeStorageSync("storageGoods");
    wx.removeStorageSync("newCheckStoreData");
    wx.removeStorageSync("newCheckStoreCat");
    wx.removeStorageSync("storageGoods");
  },
  clearMySelfStorage: function () {
    // wx.clearStorageSync();
    wx.removeStorageSync("changeAddFlag");
    wx.removeStorageSync("addrLRH");
    wx.removeStorageSync("distanceIndex");
    wx.removeStorageSync("salesIndex");
    wx.removeStorageSync("filterIndex");
    wx.removeStorageSync("storeIndex");
    wx.removeStorageSync("allgoodsIndex");
    wx.removeStorageSync("newGoodsIndex");
    wx.removeStorageSync("getActLifeIndex");
    wx.removeStorageSync("homeDataIndex");
    wx.removeStorageSync("singleAct");
    wx.removeStorageSync("seachGoodsIndex");
    wx.removeStorageSync("scanGoodsIndex");
    wx.removeStorageSync("secondClassIndex");
    wx.removeStorageSync("priceIndex");
    // wx.removeStorageSync("latitude");
    // wx.removeStorageSync("longitude");
    // wx.removeStorageSync("areaCode");
    // wx.removeStorageSync("theme");
    // wx.removeStorageSync("allClass");
  },
   "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    // requestUrl: 'http://112.74.28.99:8080/api/v1/',
    isDebug: false,
    requestUrl: 'https://api-test.xiaoguikuaipao.com/api/v1/',
    changePageState:true
  }
})
