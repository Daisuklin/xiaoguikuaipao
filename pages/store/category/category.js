var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    categories:[]
  },
  checkAll:function(){
    var storeId = this.data.storeId;
    wx.navigateTo({
      url: '../goodlist/goodlist?keyword=' + '' + '&storeId=' + storeId,
    })
  },
  checkCategory:function(e){
    var id = e.currentTarget.id;
    var storeId = this.data.storeId;
    wx.navigateTo({
      url: '../goodlist/goodlist?special_id=' + id + '&storeId=' + storeId,
    })
  },
  getStoreCategories:function(){
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getStoreClass, //
      data: {
        store_id: that.data.storeId,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到分类返回" + appUtil.ajaxUrls().getStoreClass);
        console.log(res)
        if (res.data.message.type == "success") {
          that.setData({categories:res.data.data});
        }
        wx.hideLoading();
      },
      fail: function (res) {
        console.log("请求失败返回" + appUtil.ajaxUrls().getStoreClass);
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  onLoad: function (options) {
    var storeId = options.storeId;
    //var storeID = 4887;
    this.setData({ storeId: storeId});
    this.getStoreCategories();
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