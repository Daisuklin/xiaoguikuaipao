var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    orders:[],
    pageIndex:1,
  },
  //查看订单
  checkOrder: function (e) {
    console.log(e);
    var item = e.currentTarget.dataset.my;
    wx.navigateTo({
      url: '/pages/my/integral/ordersexchange/orderdetails/orderdetails?item=' + JSON.stringify(item),
    })
  },
  transFromServer: function (res) {
    console.info("成功", res);
    var orders = this.data.orders;
    for (var i in res.data.data) {
      orders.push(res.data.data[i]);
    }
    this.setData({ orders: orders, len: res.data.totalNum});
  },
  //获取兑换订单列表
  getExchangeOrders: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pageIndex = this.data.pageIndex;
    integralUtil.controllerUtil.getExchangeOrders({
      "areaCode": wx.getStorageSync("areaCode"),
      "pageIndex": pageIndex
    }, function (res) {
      that.transFromServer(res);
      that.setData({ pageIndex: pageIndex+1 });
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons,
      icons2: iconsUtils.getIcons().walletIcons });
    this.getExchangeOrders();
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
    this.getExchangeOrders();
  },
})