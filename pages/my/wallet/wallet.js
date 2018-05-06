var iconsUtils = require("../../../image/icons.js");
var walletUtil = require("../../../utils/walletUtil.js");
Page({
  data: {

  },

  // 收账本首页数据
  getwalletData: function () {
    let that = this;
    walletUtil.controllerUtil.getwallet({},
      function (sucData) {
        console.info("sucData", sucData)
        if (sucData.data.succeeded) {
          that.setData({
            detailsData: sucData.data.data
          })
        } else {
          console.info("error", sucData.data.message.descript)
        }
      }, function (failData) { }, function (comData) { })
  },
  // 收款记录
  gotorecordReceipts: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/recordReceipts/recordReceipts',
    })
  },
  // 收入统计
  gotoincomestatistics: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/incomestatistics/incomestatistics',
    })
  },
  // 跳转到店铺收款码
  gotoReceiptcode: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/receiptcode/receiptcode',
    })
  },
  // 添加店员收款通知
  gotoaddAssistant: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/addAssistant/addAssistant',
    })
  },
  onLoad: function (options) {
    // console.info("图标", iconsUtils.getIcons().walletIcons);
    let getUserStoreData = walletUtil.appUtils.getUserData().mallData;//获取用户店铺信息
    console.info("getUserStoreData", getUserStoreData)
    this.setData({ icons: iconsUtils.getIcons().walletIcons });
    this.getwalletData()
    this.setData({
      getUserStoreData: getUserStoreData
    })
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