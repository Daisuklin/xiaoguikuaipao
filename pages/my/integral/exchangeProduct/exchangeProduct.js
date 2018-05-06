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
  // commit: function () {
  //   this.setData({ focus: true });
  // },

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

    var item = this.data.item;
    var viewPointNum = this.data.viewPointNum;
    var goodID = this.data.goodID;
    var obj = {
      name:item.name,
      point: item.point,
      viewPointNum: viewPointNum,
      goodID: goodID
    }
    wx.navigateTo({
      url: '/pages/my/integral/exchangeChooseAddr/exchangeChooseAddr?obj=' + JSON.stringify(obj),
    })
  },
  myReplaceAll: function (str, mode, replace) {//处理富文本
    if (str != null) {
      while (str.indexOf(mode) != -1) {
        str = str.replace(mode, replace);
      }
      while (str.indexOf('imgmy') != -1) {
        str = str.replace('imgmy', 'img');
      }
      return str;
    }
  },
  transFromServer: function (res) {
    console.info("成功", res);
    var nodes = this.myReplaceAll(res.data.data.description, "<img ", "<img style=\"width:100%;\" mode=\"widthFix\" ");
    this.setData({ item: res.data.data, nodes: nodes});
  },
  getGiftDetails: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var goodId = this.data.goodID;
    integralUtil.controllerUtil.getGiftDetails(goodId, {

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
    this.setData({ icons: iconsUtils.getIcons().integralIcons,
      goodID: options.goodID, name: options.name, viewPointNum: options.viewPointNum});
      wx.setNavigationBarTitle({
        title: options.name,
      })
    this.getGiftDetails();
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
})