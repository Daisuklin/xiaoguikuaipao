// pages/my/wallet/incomestatistics/incomestatistics.js
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
    indexid: 1,
    // 时间选择器
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, 1, 1],
    // 时间选择器 end
    isshowtime: false,
  },
  // -----------------------------------start
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
    let months = that.data.month;
    if (months < 10) {
      months = "0" + months;
    } else {
      months = months;
    }
    let dayTime = that.data.year + '年' + months + "月" + that.data.day + '日';
    let monTime = that.data.year + '年' + months + "月";
    let showTimes_day = that.data.year + '-' + months + "-" + that.data.day;
    let showTimes_month = that.data.year + '-' + months;
    if (num == 1) {
      //  1 day,
      that.getreceipStatistics(showTimes_day, "day");//获取日报数据
      that.setData({
        choicetime: dayTime,
        isshowtime: false,
        showTimes: showTimes_day,//传到接口的时间
        dayTime: dayTime,//显示时间
        monTime: monTime,//显示时间
        showTimes_day: showTimes_day,
        showTimes_month: showTimes_month
      })
    } else {
      // month
      that.getreceipStatistics(showTimes_month, "month");//获取月报数据
      that.setData({
        choicetime: monTime,
        isshowtime: false,
        showTimes: showTimes_month,//传到接口的时间
        // dayTime: dayTime,//显示时间
        monTime: monTime,//显示时间
        // showTimes_day: showTimes_day,
        showTimes_month: showTimes_month
      })
    }
  },
  // 选择时间-取消
  getCancel: function () {
    let that = this;
    that.setData({
      // showTimes: that.data.showTimes == '' ? '' : that.data.showTimes,
      isshowtime: false,
    })
    // if (that.data.judgmentnum == 1) {
    //   //1 day,
    //   that.setData({
    //     showTimes: that.data.showTimes == '' ? '' : that.data.showTimes,
    //     isshowtime: false,
    //   })
    // } else {
    //   // 2 month
    //   that.setData({
    //     showTimes: that.data.showTimes == '' ? '' : that.data.showTimes,
    //     isshowtime: false,
    //   })
    // }

  },
  //弹出时间选择器， 判断是开始时间还是截止时间,
  bindthetimes: function (e) {
    let that = this;
    let idnum = e.currentTarget.id;//1 day,2 month
    console.info("idnum", idnum)
    that.setData({
      judgmentnum: idnum,
      isshowtime: true
    })
  },
  // --------------------------------------end

  // 日报，月报切换
  chooseTar: function (e) {
    let that = this;
    var id = e.currentTarget.id;
    console.info("e", id)
    if (id == 1) {
      //  1 day,
      that.getreceipStatistics(that.data.showTimes_day, "day");//获取日报数据
      that.setData({
        choicetime: that.data.dayTime,//显示时间
        showTimes: that.data.showTimes_day,//传到接口的时间
      })
    } else {
      // month
      that.getreceipStatistics(that.data.showTimes_month, "month");//获取月报数据
      that.setData({
        choicetime: that.data.monTime,//显示时间
        showTimes: that.data.showTimes_month,//传到接口的时间
      })
    }
    that.setData({
      indexid: id
    })
  },
  // 获取收入统计数据
  getreceipStatistics: function (showTimes, types) {
    let that = this;
    wx.showLoading({
      title: '加载中..',
    })
    walletUtil.controllerUtil.getreceipStatistics({
      time: showTimes,
      type: types
    },
      function (sucData) {
        if (sucData.data.succeeded) {
          console.info("recordReceipts", sucData.data.data)
          that.setData({
            recordReceiptsList: sucData.data.data
          })
          wx.hideLoading()
        }
      }, function (failData) {
      }, function (comData) {
      })
  },
  // 获取今天默认时间
  getDefaultDate: function () {
    let that = this;
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    var Yeart = date.getFullYear(); //年  
    var Mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月  
    var Dates = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();//日  
    let dayTime = Yeart + '年' + Mon + "月" + Dates + '日';
    let monTime = Yeart + '年' + Mon + "月";
    let showTimes_day = Yeart + '-' + Mon + "-" + Dates;
    let showTimes_month = Yeart + '-' + Mon;
    if (that.data.indexid == 1) {
      //  1 day,
      that.getreceipStatistics(showTimes_day, "day");//获取日报数据
      that.setData({
        choicetime: dayTime,
        showTimes: showTimes_day,//传到接口的时间
        dayTime: dayTime,//显示时间
        monTime: monTime,//显示时间
        showTimes_day: showTimes_day,
        showTimes_month: showTimes_month
      })
    } else {
      // month
      that.getreceipStatistics(showTimes_month, "month");//获取月报数据
      that.setData({
        choicetime: monTime,
        showTimes: showTimes_month,//传到接口的时间
        dayTime: dayTime,//显示时间
        monTime: monTime,//显示时间
        showTimes_day: showTimes_day,
        showTimes_month: showTimes_month
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // icon 图标
    console.info("图标", iconsUtils.getIcons().walletIcons);
    this.setData({ icons: iconsUtils.getIcons().walletIcons });
    // this.getreceipStatistics();
    this.getDefaultDate();
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