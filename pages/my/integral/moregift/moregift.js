var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    pageIndex: 1,
    gifts:[]
  },
  //点击去兑换礼品
  exchageProduct: function (e) {
    var good = e.currentTarget.dataset.my;
    console.log(good);
    var viewPointNum = wx.getStorageSync("viewPointNum");
    wx.navigateTo({
      url: '/pages/my/integral/exchangeProduct/exchangeProduct?goodID=' + good.id + '&name=' + good.name + '&viewPointNum=' + viewPointNum
    })
  },
  transFromServer: function (res) {
    console.info("成功", res);
    var gifts = this.data.gifts;
    for (var i in res.data.data) {
      gifts.push(res.data.data[i]);
    }
    this.setData({ gifts: gifts, len: res.data.totalNum});
  },
  //获取礼品列表
  getGifts: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pageIndex = this.data.pageIndex;
    integralUtil.controllerUtil.getGifts({
      "areaCode": wx.getStorageSync("areaCode"),
      "pageIndex": pageIndex
    }, function (res) {
      that.transFromServer(res);
      that.setData({ pageIndex: pageIndex + 1 });
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons, viewPointNum: parseInt(options.viewPointNum) });
    this.getGifts();
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
    this.getGifts();
  },
})