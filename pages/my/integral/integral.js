var iconsUtils = require("../../../image/icons.js");
var integralUtil = require("../../../utils/integralUtil.js");
Page({
  data: {

  },
  getUserVaI: function () {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var that = this; 
    integralUtil.controllerUtil.getUserVaI({

    }, function (res) {
      console.info("获取到用户：", res);
      that.setData({ viewPoint: res.data.data.pointNum });
      wx.setStorageSync("viewPointNum", res.data.data.pointNum);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  checkInstructions:function(){
    wx.navigateTo({
      url: '/pages/my/integral/instructions/instructions',
    })
  },
  exchangeOrders:function(){
    wx.navigateTo({
      url: '/pages/my/integral/ordersexchange/ordersexchange',
    })
  },
  exchageProduct:function(e){
    var good = e.currentTarget.dataset.my;
    console.log(good);
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/exchangeProduct/exchangeProduct?goodID=' + good.id + '&name=' + good.name + '&viewPointNum=' + viewPointNum
    })
  },
  exchangerVoucher:function(e){
    console.log(e);
    var voucher = e.currentTarget.dataset.my;
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/exchangeVoucher/exchangeVoucher?voucher=' + JSON.stringify(voucher) + '&viewPointNum=' + viewPointNum,
    })
  },
  sendIntegral: function () {
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/sendintegral/sendintegral?viewPointNum=' + viewPointNum,
    })
  },
  checkVoucher:function(){
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/morevoucher/morevoucher?viewPointNum=' + viewPointNum,
    })
  },
  checGifts:function(){
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/moregift/moregift?viewPointNum=' + viewPointNum,
    })
  },
  checkDetails:function(){
    wx.navigateTo({
      url: '/pages/my/integral/useddtails/useddtails',
    })
  },
  transFromServer:function(res){
    console.info("成功", res);
    this.setData({
      freezePoint:res.data.data.freezePoint,
      viewPoint:res.data.data.viewPoint,
      midImageUrl:res.data.data.midImageUrl,
      goodsList:res.data.data.goodsList,
      redPacketList:res.data.data.redPacketList,
      viewPointNum: parseInt(res.data.data.viewPoint)});
  },
  integralHome:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    integralUtil.controllerUtil.integralHome({
      "areaCode": wx.getStorageSync("areaCode")
    },function(res){
      that.transFromServer(res);
      wx.hideLoading();
    },function(res){
      wx.hideLoading();
    },function(res){
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons});
    this.integralHome();
  },
  onReady: function () {

  },

  onShow: function () {
    
    this.getUserVaI();
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