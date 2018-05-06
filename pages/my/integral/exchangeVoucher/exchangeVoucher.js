var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    passWord: '',
    passWordArr: [],
    focus: false,
    focus2: false,
    focus3: false,
    adjust_position: true
  },
  forgetPassword: function () {
    wx.navigateTo({
      url: '/pages/my/securitycenter/addPassword/addPassword',
    })
  },
  showPasswordTips: function () {
    wx.showModal({
      title: '温馨提示',
      content: '为确保账户资金安全，请设置安全密码不设置，龟米使用，提现将受限制',
      cancelText: "暂不设置",
      confirmText: "去设置",
      cancelColor: "#222222",
      confirmColor: "#222222",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/my/securitycenter/securitycenter?havaPassword=false',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  commit: function () {
    var blackUserInfo = wx.getStorageSync("blackUserInfo");
    var havaPassword = blackUserInfo.commonData.safePasswordFlag;
    if (!havaPassword) {
      this.setData({ havaPassword: havaPassword });
      this.showPasswordTips();
      return;
    }

    this.setData({ focus: true });
  },
  tapMask: function () {
    this.setData({ focus: false });
  },
  exchangeVoucher: function () {
    this.setData({ focus: false });
    wx.showLoading({
      title: '提交中',
    })
    var that = this;
    var voucherId = this.data.voucher.packetId;
    integralUtil.controllerUtil.exchangeVoucher({
      "packetId": voucherId,
      "quantity": 1,
      "safePassword": that.data.passWord,
      "sourcePlatform": "wxa"
    }, function (res) {
      that.showToast(res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  showToast: function (res) {
    console.info("成功", res);
    var that = this;
    var context = this.data.item.context;
    if (res.data.succeeded) {
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/my/integral/tips/tips?id=2&context=' + context,
      })
    } else if (!res.data.succeeded) {
      this.setData({
        passWord: '',
        passWordArr: [],
        focus: false,
        focus2: false,
        focus3: false,
        adjust_position: true
      });
      wx.showModal({
        title: '',
        content: '密码错误，请重试',
        cancelText: "忘记密码",
        confirmText: "重试",
        cancelColor: "#222222",
        confirmColor: "#222222",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({ focus: true });
          } else if (res.cancel) {
            wx.navigateTo({
              url: '/pages/my/securitycenter/addPassword/addPassword',
            })
          }
        }
      })
    }

  },
  onChangeInput: function (e) {
    let that = this;
    if (e.detail.value.length > that.data.passWord.length) {
      that.data.passWordArr.push(true);
    } else if (e.detail.value.length < that.data.passWord.length) {
      that.data.passWordArr.pop();
    }
    that.setData({
      passWord: e.detail.value,
      passWordArr: that.data.passWordArr
    });
    if (e.detail.value.length >= 6) {
      this.exchangeVoucher();
      return;
    }
  },
  transFromServer: function (res) {
    console.info("成功", res);
    this.setData({ item: res.data.data });
  },
  getVoucherDetails: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var voucherId = this.data.voucher.packetId;
    integralUtil.controllerUtil.getVoucherDetails(voucherId, {

    }, function (res) {
      that.transFromServer(res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    var voucher = JSON.parse(options.voucher)
    var viewPointNum = parseInt(options.viewPointNum);
    this.setData({
      icons: iconsUtils.getIcons().integralIcons,
      voucher: voucher,
      viewPointNum: viewPointNum
    });
    wx.setNavigationBarTitle({
      title: voucher.context + "优惠券",
    })
    this.getVoucherDetails();
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({
      passWord: '',
      passWordArr: [],
      focus: false,
      focus2: false,
      focus3: false,
      adjust_position: true
    });
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