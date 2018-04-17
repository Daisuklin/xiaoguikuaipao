var app = getApp();
Page({
  data: {
    tags: ["披萨", "鸡脚", "肠粉", "沙拉", "蛋糕", "火龙果", "哈密瓜"]
  },
  setKeyWord: function (e) {
    var value = e.detail.value;
    this.setData({ value: value });
  },

  search: function () {
    var value = this.data.value;
    console.log("搜索词：" + value);
    if (value == "" || value == null) {
      wx.showToast({
        title: '请输入关键词',
        duration: 1000,
        icon: 'loading'
      })
      return;
    }
    var storeId = this.data.storeId;
    wx.redirectTo({
      url: '../goodlist/goodlist?keyword=' + value+'&storeId=' + storeId,
    })
  },
  onLoad: function (options) {
    this.setData({ storeId: options.storeId });
  },
  onReady: function () {

  },
  onShow: function () {
    //app.clearMySelfStorage();
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