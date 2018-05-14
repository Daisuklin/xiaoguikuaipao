var iconsUtils = require("../../../image/icons.js");
var walletUtil = require("../../../utils/walletUtil.js");
var appUtil = require("../../../utils/appUtil.js");
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
          if (sucData.data.error.code == 401 || sucData.data.message.descript =='后台信息更新，请重新登录') {
            // 未登录,重新登录
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }
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
  // 回到首页
  getbackhomes:function(){
    let that = this;
    wx.switchTab({
      url: '/pages/home2/home2'
    })
  },
  onLoad: function (options) {
    //----判断是否从个人中心过来的 isfromuser=1是 isfromuser!=1否 -----
    if (options.isfromuser==1){
      // 是来自个人中心的
      this.setData({
        isfromuser:1
      })
    }else{
      // 非来自个人中心
      this.setData({
        isfromuser: 0
      })
    }
   //----判断是否从个人中心过来的 end-----
    console.info(walletUtil.appUtils.getUserData())
    let getUserStoreData = walletUtil.appUtils.getUserData().userData;//获取用户店铺信息
    let commonData = walletUtil.appUtils.getUserData().commonData;
    let onePayFlag = commonData.onePayFlag;//判断是否店员
    console.info("commonData", commonData)
    this.setData({
      icons: iconsUtils.getIcons().walletIcons,// console.info("图标", iconsUtils.getIcons().walletIcons);
      getUserStoreData: getUserStoreData,
      onePayFlag: onePayFlag
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getwalletData();
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    // 下拉刷新
    wx.stopPullDownRefresh();
    this.getwalletData();
  },
  onReachBottom: function () {

  },
})