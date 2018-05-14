// pages/my/wallet/findReceipts/findReceipts.js
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
const date = new Date()
const years = []
const months = []
const days = []
for (let i = 2016; i <= date.getFullYear(); i++) {
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
    // month: 2,
    days: days,
    // day: 2,
    // value: [9999, 1, 1],
    // 时间选择器
    isshowtime: false,
    theDate: 0,
    beginTime: '',
    endTime: '',
    isPrompt: false,
    isnewtime:false,//是否选择了新的时间
  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  // 时间选择器
  bindChange: function (e) {
    const val = e.detail.value;
    console.info("val", val, this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]])
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      isnewtime:true
    })
    console.info("选择了新时间")
  },
  // 选择时间-确定
  getDetermine: function (e) {
    let that = this;
    let num = e.currentTarget.id;
    let choiceTime = that.data.year + '/' + that.data.month + "/" + that.data.day;
    let defaultTime = that.data.defaultTime;//默认时间
    let isnewtime = that.data.isnewtime;
    console.info("isnewtime", isnewtime)
    if (num == 1) {
      // 开始时间
      that.setData({
        beginTime: isnewtime == true ? choiceTime : defaultTime,
        isshowtime: false,
      })
    } else {
      // 截止时间
      that.setData({
        endTime: isnewtime == true ? choiceTime : defaultTime,
        isshowtime: false,
      })
    }
    that.setData({ isnewtime:false})
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
    that.setData({ isnewtime: false })
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
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let beginDate = that.data.beginTime;//开始时间
    let endDate = that.data.endTime;//截止时间
    let isTime = that.getDetermineTime();
    if (!isTime) {
      //isTime=true选择的时间正确，反之就为错
      return
    }
    walletUtil.controllerUtil.receiptslist({
      beginDate: beginDate,
      endDate: endDate
    },
      function (sucData) {
        if (sucData.data.succeeded) {
          console.info("recordReceipts", sucData.data.data)
          var recordReceiptsList = sucData.data.data;
          if (recordReceiptsList.length < 1) {
            wx.hideLoading()
            that.getPromptPark('无收款记录');
            return;
          }
          that.setData({
            recordReceiptsList: recordReceiptsList
          })
          wx.hideLoading()
        }else{
          that.getPromptPark(sucData.data.message.descript);
        }
      }, function (failData) {
        that.getPromptPark('后台维护中');
      }, function (comData) {
      })
  },
  // 判断时间选择是否错误
  getDetermineTime: function () {
    let that = this;
    let time_begin = that.data.beginTime.replace(/-/g, '/');//获取开始时间用‘/’分隔开
    let time_end = that.data.endTime.replace(/-/g, '/');//获取截止时间用‘/’分隔开
    let date_begin = new Date(time_begin);
    let data_end = new Date(time_end);
    let getTime_begin = date_begin.getTime();//获取开始时间戳
    let getTime_end = data_end.getTime();//获取截止时间戳
    let nextTwentiethDays = getTime_begin + (24 * 60 * 60 * 1000 * 20);//获取从开始时间开始的20天后的时间戳
    // 判断开始时间是否早于截止时间
    if (getTime_begin > getTime_end) {
      wx.hideLoading();
      that.getPromptPark('开始时间需早于截止时间');
      return false;
    }
    // 判断开始时间和截止之间的时间差距是否在20天之内
    if (getTime_end > nextTwentiethDays) {
      // 选择的时间差大于20天
      wx.hideLoading();
      that.getPromptPark('查询时间不能超过20天');
      return false;
    }
    return true;
  },
  // 收款记录详情
  gotorecordReceiptsdetail: function (e) {
    let that = this;
    console.info("e", e)
    let realTimeIncome = e.currentTarget.dataset.realtimeincome;
    wx.navigateTo({
      url: '/pages/my/wallet/details/details?orderId=' + e.currentTarget.id + "&isfromfather=1"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let datatime = new Date;
    let year = datatime.getFullYear();    //获取完整的年份(4位,1970-????)
    let mon = datatime.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    let day = datatime.getDate();        //获取当前日(1-31)
    console.info(year + "/" + mon + "/" + day)
    let defaultTime = year + "/" + mon + "/" + day;//默认时间
    // icon 图标
    console.info("图标", iconsUtils.getIcons().walletIcons);
    this.setData({ 
      icons: iconsUtils.getIcons().walletIcons,
      month: mon,
      day: day,
      defaultTime:defaultTime,
      value: [9999, mon-1, day-1],//设置默认时间选择器默认时间
       });
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