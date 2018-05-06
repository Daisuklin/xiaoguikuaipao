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

  },
  onReachBottom: function () {
    this.getUserDetails();
  },
})