var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    pageIndex: 1,
    details:[]
  },
  transFromServer:function(res){
    console.info("成功", res);
    var details = this.data.details;
    for (var i in res.data.data) {
      //时间转换
      res.data.data[i].createAt = integralUtil.appUtils.getDateTimes(res.data.data[i].createAt);
     // console.info(integralUtil.appUtils.getDateTimes(res.data.data[i].createAt))
      details.push(res.data.data[i]);
    }
    this.setData({ details: details, len: res.data.totalNum});
  },
  getUserDetails:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pageIndex = this.data.pageIndex;
    integralUtil.controllerUtil.getUserDetails({
      "pageIndex": pageIndex
    }, function (res) {
      that.transFromServer(res);
      // 分页
      that.setData({ pageIndex: pageIndex + 1 });
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.setData({ icons: iconsUtils.getIcons().integralIcons });
    this.getUserDetails();
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
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    // 下拉事件
    console.info("下拉事件")
    this.getUserDetails();
  },
})