var iconsUtils = require("../../../../image/icons.js");
Page({
  data: {
    viewPointNum:"",
    orderId:"",
    context:""
  },
  //点击使用优惠券
  toUse:function(){
    wx.switchTab({
      url: '/pages/home2/home2',
    })
  },
  //查看兑换订单详情
  checkOrder:function(e){
    var orderId = this.data.orderId;
    // wx.redirectTo({
    //   url: '/pages/my/wallet/details/details?orderId=' + orderId,
    // })
    var orderId = this.data.orderId;
    var item = {
      id: orderId
    }
    wx.redirectTo({
      url: '/pages/my/integral/ordersexchange/orderdetails/orderdetails?item='+JSON.stringify(item),
    })
  },
  //返回的积分商城
  back3:function(){
    wx.navigateBack({
      delta: 3,
    })
  },
  //返回赠送龟米
  back2:function(){
    wx.navigateBack({
      delta: 2,
    })
  },
  //返回积分商城
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
    var viewPointNum = parseFloat(wx.getStorageSync("viewPointNum")).toFixed(2);
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