// pages/my/wallet/reward/reward.js 龟米奖励
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    pageNo: 1,
    pageSize: 8,
    rewardData: [],
    isLast: false
  },
  // nav tab切换事件
  bindNav: function (e) {
    let that = this;
    let id = e.currentTarget.id;

    //切换颜色
    that.setData({
      isLast: false,
      pageNo: 1,
      active: id,
      rewardData: []
    })
    that.getrewardListData(id, that.data.pageNo);
  },
  // 获取列表数据
  getrewardListData: function (active, pageIndex) {
    let that = this;
    wx.showLoading({
      title: '加载中..',
    })
    if (active == 1) {
      var usedType = true;
    } else {
      var usedType = false;
    }
    walletUtil.controllerUtil.getrewardList({
      used: usedType,
      pageIndex: this.data.pageNo,
      pageSize: this.data.pageSize
    }, function (sucData) {
      if (sucData.data.succeeded) {
        console.info("sucData.data.data", sucData.data.data)
        that.setData({
          rewardMessage: sucData.data.data,
          rewardData: that.data.rewardData.concat(sucData.data.data.shardBounties),
          totalNum: sucData.data.totalNum
        })
        wx.hideLoading();
      } else {
        console.info("error", sucData.data)
        wx.hideLoading();
      }
    }, function (failData) {

    }, function (comData) { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 跳转到红包收款码
  gotoReceiptcode: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/redPacketCode/redPacketCode',
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let that = this;
    let active = that.data.active;
    let pageNo = that.data.pageNo;
    let pageSize = that.data.pageSize;
    let totalNum = that.data.totalNum;//总数据数
    //判断是否最后一页
    if (that.data.isLast == true) {
      that.setData({
        isLast: true
      })
      return false;
    }
    if (((pageNo) < Number(Number((totalNum / pageSize) + (0 != (totalNum % pageSize) ? 0.5:0)).toFixed(0)))) {
      that.setData({
        pageNo: pageNo + 1
      })
      that.getrewardListData(that.data.active, that.data.pageNo);
    } else {
      that.setData({
        isLast: true
      })
    }
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
    this.getrewardListData(this.data.active, this.data.pageNo);
    this.setData({
      icons: iconsUtils.getIcons().walletIcons,
      baseIcons: iconsUtils.getIcons().baseIcons,
      icons2: iconsUtils.getIcons().walletIcons
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})