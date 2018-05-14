var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    // url:"http://dev.xiaoguikuaipao.com/index/point_goods/Analysis",
    // url: "https://new.xiaoguikuaipao.com/index/point_goods/Analysis",
    // url: integralUtil.requestUrlList().guimi_explain
    //"dev.xiaoguikuaipao.com/index/point_goods/Coupon"
  },
  transFromServer: function (res) {
    console.info("成功", res);
    this.setData({ gifts: res.data.data });
  },
  // getGifts: function () {
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   var that = this;
  //   integralUtil.controllerUtil.getGifts({
  //     "areaCode": wx.getStorageSync("areaCode"),
  //     "pageIndex": 1
  //   }, function (res) {
  //     that.transFromServer(res);
  //     wx.hideLoading();
  //   }, function (res) {
  //     wx.hideLoading();
  //   }, function (res) {
  //     wx.hideLoading();
  //   });
  // },
  // 获取优惠卷和龟米说明文本
  getfindAnalysisData:function(types){
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    integralUtil.controllerUtil.getfindAnalysis({
      type: types
    },function(sucData){
      console.info(sucData.data)
      if (sucData.data.succeeded){
        that.setData({
          AnalysisData: sucData.data.data
        })
      }else{
        console.info("error",sucData.data)
      }
      wx.hideLoading();
    },function(failData){
      console.info("failData", failData)
      wx.hideLoading();
    },function(temData){

    })

  },
  onLoad: function (options) {
    console.info("options", options)
    this.setData({
    icons: iconsUtils.getIcons().integralIcons, 
    });
    if (options.isVoucher=='true') {
      // 优惠券说明
      this.getfindAnalysisData('coupon');
      wx.setNavigationBarTitle({
        title: '优惠券说明'
      })
    }else{
      // 龟米说明
      this.getfindAnalysisData('gold')
      wx.setNavigationBarTitle({
        title: '龟米说明'
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {


  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})