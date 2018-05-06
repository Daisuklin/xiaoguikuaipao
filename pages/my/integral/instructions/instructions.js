var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    url:"http://dev.xiaoguikuaipao.com/index/point_goods/Analysis",
    //"dev.xiaoguikuaipao.com/index/point_goods/Coupon"
  },
  transFromServer: function (res) {
    console.info("成功", res);
    this.setData({ gifts: res.data.data });
  },
  getGifts: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    integralUtil.controllerUtil.getGifts({
      "areaCode": wx.getStorageSync("areaCode"),
      "pageIndex": 1
    }, function (res) {
      that.transFromServer(res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons, viewPointNum: parseInt(options.viewPointNum) });
   // this.getGifts();
    if(options.isVoucher!=undefined){
      this.setData({ url:"http://dev.xiaoguikuaipao.com/index/point_goods/Coupon"});
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