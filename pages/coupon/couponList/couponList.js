
Page({
  data: {
    icon: {
      coupon_l: '../../../image/coupon/coupon-01.png',
      coupon_r: '../../../image/coupon/coupon-02.png',
      close: '../../../image/coupon/close.png'
    },
    coupons:[]
  },
  //点击选择优惠券
  tapCoupon:function(e){
    console.log(e);
    var coupon = e.currentTarget.dataset.my;
    wx.redirectTo({
      url: '/pages/coupon/buycoupon/buycoupon?coupon='+JSON.stringify(coupon),
    })
  },
  onLoad: function (options) {
    var couponsStr = options.coupons;
    this.setData({ coupons: JSON.parse(couponsStr)});
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
  onShareAppMessage: function () {

  }
})