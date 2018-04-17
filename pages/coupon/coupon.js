var appUtil = require('../../utils/appUtil.js');
Page({
  data: {
    histories: [],
    wechatPay: 0,
    money: 0,
    historyIndex: 1
  },
  changeStatePay: function (e) {
    console.log(e);
    var state = e.detail.value;
    if (state) {
      state = 1;
    } else {
      state = 0;
    }
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().setPayState,
      data: {
        defaultPay: state
      },
      method: "PUT",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("修改状态返回");
        console.log(res)
        if (res.data.message.type == "success") {
          if (state == 1) {
            setTimeout(function () {
              wx.showToast({
                title: '已开启抵扣支付',
                icon:"success",
                duration:1000
              })
            }, 200);
          } else {
            setTimeout(function () {
              wx.showToast({
                title: '已关闭抵扣支付',
                icon: "success",
                duration: 1000
              })
            }, 200);
          }
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  toBuy: function () {
    var remainMoney = this.data.money;
    wx.navigateTo({
      url: '/pages/coupon/buycoupon/buycoupon?remainMoney=' + remainMoney,
    })
  },
  transFromServer: function (histories) {
    var historiesArr = this.data.histories;
    for (var i = 0; i < histories.length; i++) {
      if (histories[i].money > 0) {
        histories[i].money = "+" + histories[i].money;
        histories[i].color = "#FE751A";
      } else {
        histories[i].color = "#444444";
      }
      historiesArr.push(histories[i]);
    }

    this.setData({ histories: historiesArr });
  },
  getHistories: function () {
    var that = this;
    var historyIndex = this.data.historyIndex;
    wx.request({
      url: appUtil.ajaxUrls().getHistories,
      data: {
        "pageIndex": historyIndex
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("得到历史充值返回");
        console.log(res)
        if (res.data.message.type == "success") {
          that.setData({ historyIndex: historyIndex + 1 });
          that.transFromServer(res.data.data);
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getCouponDetail: function () {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getCouponDetail,
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("得到优惠券信息返回");
        console.log(res)
        if (res.data.message.type == "success") {
          ////默认余额支付(0=关闭 1=开启)
          that.setData({ money: res.data.data.profile.payBalance, wechatPay: res.data.data.profile.defaultPay });
          //that.transFromServer(res.data.data);
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  onLoad: function (options) {
    
    if (options.paytip != undefined) {
      wx.showToast({
        title: '购买成功',
        icon: "success",
        duration: 1000
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    this.getHistories();
    this.getCouponDetail();
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
    this.getHistories();
  },
})