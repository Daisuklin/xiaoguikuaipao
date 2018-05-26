// pages/my/wallet/findReceipts/findReceipts.js
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
const date = new Date()
const years = []
const months = []
const days = []
const hour = []
const minute = []
for (let i = 2016; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  hour.push(i)
}
for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  minute.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSource:false,
    // 时间选择器
    years: years,
    year: date.getFullYear(),
    months: months,
    // month: 2,
    days: days,
    // day: 2,
    // value: [9999, 1, 1],
    hour: hour,
    minute: minute,
    // 时间选择器
    isshowtime: false,
    theDate: 0,
    beginTime: '',
    endTime: '',
    showHourMinBegin: '',
    showHourMinEnd: '',
    isPrompt: false,
    isnewtime: false,//是否选择了新的时间
    isTimeHourMin: false,
    isnewHours: false,
  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  // 时间选择器--选择日期
  bindChange: function (e) {
    const val = e.detail.value;
    console.info("val", val, this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]])
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      isnewtime: true
    })
    console.info("选择了新时间")
  },
  // 选择时间-确定 --选择日期
  getDetermine: function (e) {
    
    let that = this;
    let num = e.currentTarget.id;
    let months = that.data.month;
    let days = that.data.day;
    if (months < 10) {
      months = '0' + months
    }
    if (days < 10) {
      days = '0' + days
    }
    
    let choiceTime = that.data.year + '/' + months + "/" + days;
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
    that.setData({ isnewtime: false })
  },
  // 选择时间-取消 --选择日期
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
  //弹出时间选择器， 判断是开始时间还是截止时间, --选择日期
  bindthetimes: function (e) {
    let that = this;
    let idnum = e.currentTarget.id;//1开始时间,2截止时间
    that.setData({
      judgmentnum: idnum,
      isshowtime: true
    })
  },
  //查询---点击按钮
  geFindTreceiptsList: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    // 判断是否有时间还未选择
    if (that.data.beginTime == '' || that.data.showHourMinBegin == '' || that.data.endTime == '' || that.data.showHourMinEnd == '') {
      wx.hideLoading();
      that.getPromptPark('请选择时间！')
      return
    }
    let beginDate = that.data.beginTime + " " + that.data.showHourMinBegin;//开始时间
    let endDate = that.data.endTime + " " + that.data.showHourMinEnd;//截止时间
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
            showSource:true,
            recordReceiptsList: recordReceiptsList
          })
          wx.hideLoading()
        } else {
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
    let mon = datatime.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
    let day = datatime.getDate();        //获取当前日(1-31)
    console.info(year + "/" + mon + "/" + day)
    if(mon<10){
      mon = "0" + mon
    }
    let defaultTime = year + "/" + mon + "/" + day;//默认时间
    // icon 图标
    console.info("图标", iconsUtils.getIcons().walletIcons);
    let defutVal = '00';
    this.setData({
      icons: iconsUtils.getIcons().walletIcons,
      month: mon,
      day: day,
      defaultTime: defaultTime,
      value: [9999, mon - 1, day - 1],//设置默认时间选择器默认时间
      n_hour: '00',
      n_min: '00'
    });
  },
  // ----------------选择时间 时、分 begin-------------------
  // 时间选择器--选择时间
  bindChangeTimes: function (e) {
    const val = e.detail.value;
    this.setData({
      n_hour: this.data.hour[val[0]],
      n_min: this.data.minute[val[1]],
      isnewHours: true
    })
    console.info("选择了新时间")
  },
  // 弹出时间选择器--选择时间
  getTimeHourMin: function (e) {
    let that = this;
    let idnum = e.currentTarget.id;
    console.info(idnum)
    that.setData({
      isTimeHourMin: true,
      judnum: idnum
    })
  },
  // 取消--选择时间
  getHourMinCancel: function () {
    let that = this;
    that.setData({
      isTimeHourMin: false,
      isnewHours: false
    })
  },
  // 确定--选择时间
  getHourMinDetermine: function (e) {
    let that = this;
    let judnumId = e.currentTarget.id;//1为开始时间，2为截止时间
    let choiceTimeHour = that.data.n_hour + ":" + that.data.n_min;
    let choiceDefaultHour = '00:00';
    let isnewHours = that.data.isnewHours;//是否有选择时间
    console.info("choiceTimeHour", choiceTimeHour)
    if (judnumId == 1) {
      // 开始时间
      that.setData({
        showHourMinBegin: isnewHours == false ? choiceDefaultHour : choiceTimeHour,//开始时间
        isTimeHourMin: false
      })
    } else {
      // 截止时间
      that.setData({
        showHourMinEnd: isnewHours == false ? choiceDefaultHour : choiceTimeHour,//截止时间
        isTimeHourMin: false
      })
    }
    that.setData({ isnewHours: false })
  },
  // ----------------选择时间 时、分 end-------------------
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