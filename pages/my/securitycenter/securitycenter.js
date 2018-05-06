Page({
  data: {
    isLogin:false,
    havaPassword:false
  },
  // 跳转至设置密码
  gotoAddPassword:function(e){
    var that = this;
    wx.navigateTo({
      url: '/pages/my/securitycenter/addPassword/addPassword',
    })
  },
  // 跳转至修改密码
  gotoUpdatePassword:function(e){
    let that = this;
    wx.navigateTo({
      url: '/pages/my/securitycenter/updatePassword/updatePassword',
    })
  },
  onLoad: function (options) {
    this.setData({ havaPassword: JSON.parse(options.havaPassword)});
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