var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    oldPassword:"",
    newPassword:""
  },

  setOldPassword:function(e){
    var value = e.detail.value;
    this.setData({oldPassword:value});
  },
  setNewPassword: function (e) {
    var value = e.detail.value;
    this.setData({ newPassword: value });
  },
  commit:function(){
    var newPassword = this.data.newPassword;
    var oldPassword = this.data.oldPassword;
    if (oldPassword.length < 6) {
      this.getPromptPark('请输入旧密码');
      return;
    }
    if (newPassword.length < 6) {
      this.getPromptPark('请输入新密码');
      return;
    }
    this.updePassword();
  },
  updePassword:function(){
    wx.showLoading({
      title: '提交中',
    })
    var that = this;
    var newPassword = this.data.newPassword;
    var oldPassword = this.data.oldPassword;
    integralUtil.controllerUtil.addSafePassword("PUT",{
      "newSafePassword": newPassword,
      "oldSafePassword": oldPassword
    }, function (res) {
      that.transFromServer(res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  transFromServer: function (res) {
    console.info("信息", res);
    if (res.data.succeeded) {
      var blackUserInfo = wx.getStorageSync("blackUserInfo");
      blackUserInfo.commonData.safePasswordFlag = true;
      wx.setStorageSync("blackUserInfo", blackUserInfo);
      wx.showModal({
        title: '修改成功',
        content: '请妥善保管好您的安全密码',
        showCancel: false,
        confirmColor: "#222",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
              delta:1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.getPromptPark(res.data.message.descript);
    }

  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  showForgetPassword:function(){
    wx.navigateTo({
      url: '/pages/my/securitycenter/addPassword/addPassword',
    })
  },
  onLoad: function (options) {

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