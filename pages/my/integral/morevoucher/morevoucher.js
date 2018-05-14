var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
     pageIndex:1,
     vouchers:[]
  },
  //去兑换优惠券
  exchangerVoucher: function (e) {
    console.log(e);
    var voucher = e.currentTarget.dataset.my;
    var viewPointNum = wx.getStorageSync("viewPointNum");
    wx.navigateTo({
      url: '/pages/my/integral/exchangeVoucher/exchangeVoucher?voucher=' + JSON.stringify(voucher) + '&viewPointNum=' + viewPointNum,
    })
  },
  transFromServer:function(res){
    console.info("成功", res);
    var vouchers = this.data.vouchers;
    for (var i in res.data.data){
      vouchers.push(res.data.data[i]);
    }
    this.setData({ vouchers: vouchers, len:res.data.totalNum});
  },
  //获取优惠券列表
  getVouchers:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pageIndex = this.data.pageIndex;
    integralUtil.controllerUtil.getVouchers({
      "areaCode": wx.getStorageSync("areaCode"),
      "pageIndex": pageIndex
    }, function (res) {
      that.transFromServer(res);
      that.setData({ pageIndex: pageIndex+1});
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons, viewPointNum: parseInt(options.viewPointNum)});
    this.getVouchers();
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
    this.getVouchers();
  },
})