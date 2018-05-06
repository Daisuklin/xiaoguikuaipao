var iconsUtils = require("../../../../image/icons.js");
Page({
  data: {
    viewPointNum:"",
    orderId:"",
    context:""
  },
  toUse:function(){
    wx.switchTab({
      url: '/pages/home2/home2',
    })
  },
  checkOrder:function(e){
    var orderId = this.data.orderId;
    wx.redirectTo({
      url: '/pages/my/wallet/details/details?orderId=' + orderId,
    })
  },
  back3:function(){
    wx.navigateBack({
      delta: 3,
    })
  },
  back2:function(){
    wx.navigateBack({
      delta: 2,
    })
  },
  back:function(){
    wx.navigateBack({
      delta:2,
    })
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons });
    this.setData({id:options.id});
    if (options.id=='3'){
      wx.setNavigationBarTitle({
        title: '礼品兑换',
      })
      this.setData({ orderId: options.orderId});
    } else if (options.id == '2'){
      wx.setNavigationBarTitle({
        title: '优惠券兑换',
      })
      this.setData({ context: options.context});
    }
  },
  onReady: function () {


  },
  onShow: function () {
    var viewPointNum = wx.getStorageSync("viewPointNum");
    this.setData({ viewPointNum: viewPointNum});
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