var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    
  },
  chooseTar: function (e) {
    var id = e.currentTarget.id;
    this.setData({ index: id });
  },
  getAccountDetails: function (options) {
    let that = this;
    let orderId = options.orderId;
    let realTimeIncome = options.realTimeIncome;
    // let orderId ='1';
    integralUtil.controllerUtil.getAccountDetails(orderId, {
    }, function (detailData) {
      console.info("detailData", detailData)
      if (detailData.data.succeeded){
        // 转换时间戳
        //获取当前时间戳  
        var timestamp = detailData.data.data.createAt;
        timestamp = timestamp / 1000;
        console.log("当前时间戳为：" + timestamp);
        //获取当前时间  
        var n = timestamp * 1000;
        var date = new Date(n);
        var Yeart = date.getFullYear(); //年  
        var Mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月  
        var Dates = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();//日  
        var hours = date.getHours();//时  
        var mint = date.getMinutes();//分  
        if (mint < 10) {
          mint = "0" + mint;
        } else {
          mint = mint;
        }
        let times = Yeart + "-" + Mon + "-" + Dates + " " + hours + ":" + mint;
        console.info(times)
        // 
        that.setData({
          detailsdata: detailData.data.data,
          index: realTimeIncome,
          createAt: times
        })
      }
    }, function (res) {
      console.info("fail")
    }, function (res) {
      console.info("complete")
    })

  },
  onLoad: function (options) {
    // var orderId = options.orderId;
    this.getAccountDetails(options)

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
