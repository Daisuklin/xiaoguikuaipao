// pages/my/wallet/findReceipts/findReceipts.js
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
const date = new Date()
const years = []
const months = []
const days = []
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 时间选择器
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, 1, 1],
    // 时间选择器
    isshowtime: false,
    theDate: 0,
    beginTime: '',
    endTime: ''
  },
  // 时间选择器
  bindChange: function (e) {
    const val = e.detail.value;
    console.info("val", this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]])
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  // 选择时间-确定
  getDetermine: function (e) {
    let that = this;
    let num = e.currentTarget.id;
    let choiceTime = that.data.year + '/' + that.data.month + "/" + that.data.day;
    if (num == 1) {
      // 开始时间
      that.setData({
        beginTime: choiceTime,
        isshowtime: false,
      })
    } else {
      // 截止时间
      that.setData({
        endTime: choiceTime,
        isshowtime: false,
      })
    }

  },
  // 选择时间-取消
  getCancel: function () {
    let that = this;
    if (that.data.judgmentnum == 1) {
      // 开始时间
      that.setData({
        beginTime: that.data.beginTime == '' ? '' : that.data.beginTime,
        isshowtime: false,
      })
    } else {
      // 截止时间
      that.setData({
        endTime: that.data.endTime == '' ? '' : that.data.endTime,
        isshowtime: false,
      })
    }
  
  },
  //弹出时间选择器， 判断是开始时间还是截止时间,
  bindthetimes: function (e) {
    let that = this;
    let idnum = e.currentTarget.id;//1开始时间,2截止时间
    that.setData({
      judgmentnum: idnum,
      isshowtime: true
    })
  },
  // 记录列表查询
  geFindTreceiptsList: function () {
    let that = this;
    let beginDate = that.data.beginTime;//开始时间
    let endDate = that.data.endTime;//截止时间
    walletUtil.controllerUtil.receiptslist({
      beginDate: beginDate,
      endDate: endDate
    },
      function (sucData) {
        if (sucData.data.succeeded) {
          console.info("recordReceipts", sucData.data.data)
          that.setData({
            recordReceiptsList: sucData.data.data
          })
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
    this.geFindTreceiptsList()
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