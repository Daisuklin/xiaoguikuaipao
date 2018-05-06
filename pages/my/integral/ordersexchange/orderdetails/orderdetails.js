var iconsUtils = require("../../../../../image/icons.js");
var integralUtil = require("../../../../../utils/integralUtil.js");
Page({
  data: {

  },
  comfirmGetOrder: function () {
    wx.showLoading({
      title: '确认中',
    })
    var that = this;
    var orderId = this.data.item.id;
    integralUtil.controllerUtil.comfirmGetGood(orderId, {

    }, function (res) {
      console.info("确定收货返回",res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '400-660-9727',
    })
  },
  transFromServer: function (res) {
    console.info("成功", res);
    console.info("时间", integralUtil.appUtils.getDateFormat(res.data.data.createdTime));
    res.data.data.createdTime = integralUtil.appUtils.getDateFormat(res.data.data.createdTime);
    this.setData({ ods: res.data.data });
  },
  getOrderDetails: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var orderId = this.data.item.id;
    integralUtil.controllerUtil.getOrderDetails(orderId, {

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
    if (options.item != undefined) {
      var item = JSON.parse(options.item);
      this.setData({ item: item });
    }
    this.setData({ icons: iconsUtils.getIcons().integralIcons });
    this.getOrderDetails();
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
    this.getOrderDetails();
  },
  onReachBottom: function () {

  },
})