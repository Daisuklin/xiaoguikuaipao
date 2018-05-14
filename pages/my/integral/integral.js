var iconsUtils = require("../../../image/icons.js");
var integralUtil = require("../../../utils/integralUtil.js");
Page({
  data: {

  },
  //获取用户优惠券和龟米数量
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
  //查看优惠券使用说明
  checkInstructions:function(){
    wx.navigateTo({
      url: '/pages/my/integral/instructions/instructions?isVoucher=false',
    })
  },
  //兑换订单
  exchangeOrders:function(){
    wx.navigateTo({
      url: '/pages/my/integral/ordersexchange/ordersexchange',
    })
  },
  //兑换礼品
  exchageProduct:function(e){
    var good = e.currentTarget.dataset.my;
    console.log(good);
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/exchangeProduct/exchangeProduct?goodID=' + good.id + '&name=' + good.name + '&viewPointNum=' + viewPointNum
    })
  },
  //兑换优惠券
  exchangerVoucher:function(e){
    console.log(e);
    var voucher = e.currentTarget.dataset.my;
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/exchangeVoucher/exchangeVoucher?voucher=' + JSON.stringify(voucher) + '&viewPointNum=' + viewPointNum,
    })
  },
  //赠送龟米
  sendIntegral: function () {
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/sendintegral/sendintegral?viewPointNum=' + viewPointNum,
    })
  },
  //查看优惠券
  checkVoucher:function(){
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/morevoucher/morevoucher?viewPointNum=' + viewPointNum,
    })
  },
  //查看礼品
  checGifts:function(){
    var viewPointNum = this.data.viewPointNum;
    wx.navigateTo({
      url: '/pages/my/integral/moregift/moregift?viewPointNum=' + viewPointNum,
    })
  },
  //查看使用明细
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
  // 回到首页
  getbackhomes: function () {
    let that = this;
    wx.switchTab({
      url: '/pages/home2/home2'
    })
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons});
    //----判断是否从父级页面中心过来的 isfromfather=1是 isfromfather!=1否 -----
    if (options.isfromfather == 1) {
      // 是来自父级页面的
      this.setData({
        isfromfather: 1
      })
    } else {
      // 非来父级页面
      this.setData({
        isfromfather: 0
      })
    }
   //----判断是否从父级页面中心过来的 end-----
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