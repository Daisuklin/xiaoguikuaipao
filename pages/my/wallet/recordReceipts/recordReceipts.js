// pages/my/wallet/recordReceipts/recordReceipts.js
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  getFindReceipts:function(){
    let that = this;
    wx.navigateTo({
      url: '/pages/my/wallet/findReceipts/findReceipts',
    })
  },
  // 收款记录详情
  gotorecordReceiptsdetail:function(e){
    let that = this;
    console.info("e",e)
    let realTimeIncome = e.currentTarget.dataset.realtimeincome;
    wx.navigateTo({
      url: '/pages/my/wallet/details/details?orderId=' + e.currentTarget.id +"&isfromfather=1"
    })
  },
  // 收款记录列表
  getreceiptslist:function(){
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    walletUtil.controllerUtil.receiptslist({
      current:1
    },
      function (sucData) {
        if (sucData.data.succeeded) {
          console.info("recordReceipts", sucData.data)
          that.setData({
            recordReceiptsList: sucData.data.data
          })
          wx.hideLoading()
        }
      }, function (failData) {
      }, function (comData) {
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // icon 图标
    console.info("图标", iconsUtils.getIcons().walletIcons);
    this.setData({ icons: iconsUtils.getIcons().walletIcons });
    this.getreceiptslist();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})