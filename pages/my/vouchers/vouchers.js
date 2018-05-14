var integralUtil = require("../../../utils/integralUtil.js");
var iconsUtils = require("../../../image/icons.js");
Page({
  data: {
    isGetStore: false,
    pageIndex: 1,
    vouchers: [],
    showType: 1,
    isOutDate: false
  },
  //查看优惠券使用说明
  voucherIntru: function () {
    wx.navigateTo({
      url: '/pages/my/integral/instructions/instructions?isVoucher=true',
    })
  },
  
  toUse: function () {
    wx.switchTab({
      url: '/pages/home2/home2',
    })
  },
  // 返回上一级
  getReturn: function (e) {
    let that = this;
    console.info(e)
    var couponPrice = e.currentTarget.dataset.item;//优惠券价格
    wx.setStorageSync('couponPrice', couponPrice);//将优惠券价格缓存到本地
    wx.navigateBack();
  },
  // 不使用优惠券
  getNoCoupons:function(){
    let that = this;
    wx.setStorageSync('couponPrice', '');//将优惠券价格缓存到本地
    wx.navigateBack();
  },
  transFromServer: function (res) {
    console.info("成功", res);
    var vouchers = this.data.vouchers;
    for (var i in res.data.data) {
      vouchers.push(res.data.data[i]);
    }
    this.setData({ vouchers: vouchers, len: res.data.totalNum });
  },
  // 获取优惠券数据
  getStoreVouchers: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    let ifManSong = options.ifManSong;
    let ifPackageMall = options.ifPackageMall;
    let order_amount = options.order_amount;//实付总金额
    var pageIndex = this.data.pageIndex;
    // 优惠券接口
    integralUtil.controllerUtil.getStoreVouchers({
      gcId: '0',
      money: order_amount,
      ifManSong: ifManSong,
      ifPackageMall: ifPackageMall,
      pageIndex: pageIndex
    }, function (res) {
      if (res.data.succeeded == true) {
        that.transFromServer(res);
        that.setData({ pageIndex: pageIndex + 1 });
        wx.hideLoading();
      }
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  transFromServer2: function (res) {
    console.info("成功2", res);
    var vouchers = this.data.vouchers;
    for (var i in res.data.data) {
      vouchers.push(res.data.data[i]);
    }
    this.setData({ vouchers: vouchers, len: res.data.totalNum });
  },
  //查看过期优惠券
  checkOutDateVoucher: function () {
    wx.navigateTo({
      url: '/pages/my/vouchers/vouchers?showType=3',
    })
  },
  //获取我的优惠券
  getMyVouchers: function (isOutDate) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pageIndex = this.data.pageIndex;
    // 优惠券接口
    integralUtil.controllerUtil.getMyVouchers({
      pageIndex: pageIndex,
      overdue: isOutDate
    }, function (res) {
      if (res.data.succeeded == true) {
        // succeeded
        var vouchersData = res.data.data;
        that.transFromServer2(res);
        that.setData({ pageIndex: pageIndex + 1 });
        wx.hideLoading();
      }
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    // options = {
    //   showType: 2,
    //   gcId: "0",
    //   ifManSong: "true",
    //   ifPackageMall: "false",
    //   money: "0"
    // }
    //showType==1时候是平台 ==2时候是订单
    this.setData({ icons: iconsUtils.getIcons().voucherIcons, showType: options.showType });
    if (options.showType == 2) {
      this.setData({ isGetStore: true, options: options });
      this.getStoreVouchers(options);
    } else if (options.showType == 1) {//
      this.setData({ isOutDate: false });
      this.getMyVouchers(this.data.isOutDate);
    } else if (options.showType == 3) {//查看过期优惠券
      this.setData({ isOutDate: false });
      this.getMyVouchers(this.data.isOutDate);
    }
  },
  getOutDateVoucher: function () {

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
    if (this.data.showType == 2) {
      this.getStoreVouchers(this.data.options);
    } else {
      this.getMyVouchers(this.data.isOutDate);
    }
  },
})