// pages/my/securitycenter/addPassword/addPassword.js
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    text: "获取验证码",
    getClass: "canget",
    waitTime: "60s",
    phone: "",
    password: "",
    code: ""
  },
  //获取验证码
  getCodeFromServer: function () {
    var that = this;
    var phone = this.data.phone;
    integralUtil.controllerUtil.getCodeFromServer({
      "mobile": phone,
      "type": "safePassword"
    }, function (res) {
      
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  //设置安全密码
  addSafePassword: function () {
    wx.showLoading({
      title: '提交中',
    })
    var that = this;
    var phone = this.data.phone;
    var code = this.data.code;
    var password = this.data.password;
    integralUtil.controllerUtil.addSafePassword("POST",{
      "code": code,
      "mobile": phone,
      "safePassword": password
    }, function (res) {
      that.transFromServer(res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  transFromServer:function(res){
    console.info("信息",res);
    if (res.data.succeeded){
      var blackUserInfo = wx.getStorageSync("blackUserInfo");
      blackUserInfo.commonData.safePasswordFlag = true;
      wx.setStorageSync("blackUserInfo", blackUserInfo);
      wx.showModal({
        title: '设置成功',
        content: '请妥善保管好您的安全密码',
        showCancel:false,
        confirmColor:"#222",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      this.getPromptPark(res.data.message.descript);
    }
    
  },
  //获取验证码前作数据合法性判断
  getCode: function () {
    var phone = this.data.phone;
    if (phone == '' || phone.length != 11 || isNaN(phone)) {
      this.getPromptPark('请正确输入手机号码');
      return;
    }
    var that = this;
    var waitTime = this.data.waitTime;
    this.setData({ text: waitTime, getClass: "noget" });
    wx.setStorageSync("waitTime", waitTime);
    var t1 = setInterval(function () {
      var textTmp = that.data.text;
      if (textTmp == "获取验证码") {
        var intervals = wx.getStorageSync("intervals");
        if (intervals != "") {
          for (var i in intervals) {
            clearInterval(intervals[i]);
          }
        }
        wx.setStorageSync("intervals", "");
        return;
      }
      var time = parseInt(textTmp.substring(0, textTmp.length - 1)) - 1;
      if (time == 0) {
        that.setData({ text: "获取验证码", getClass: "canget" });
        wx.setStorageSync("waitTime", "");
        var intervals = wx.getStorageSync("intervals");
        if (intervals != "") {
          for (var i in intervals) {
            clearInterval(intervals[i]);
          }
        }
        wx.setStorageSync("intervals", "");
        return;
      }
      that.setData({ text: time + "s" });
      wx.setStorageSync("waitTime", time + "s");
    }, 1000);
    var intervals = wx.getStorageSync("intervals");
    if (intervals == "") {
      intervals = [];
      intervals.push(t1);
      wx.setStorageSync("intervals", intervals);
    } else {
      intervals.push(t1);
      wx.setStorageSync("intervals", intervals);
    }
    this.getCodeFromServer();
  },
  //设置倒计时
  reSetWaitTime: function (waitTime) {
    var that = this;
    this.setData({ text: waitTime, getClass: "noget" });
    var t1 = setInterval(function () {
      var textTmp = that.data.text;
      if (textTmp == "获取验证码") {
        var intervals = wx.getStorageSync("intervals");
        if (intervals != "") {
          for (var i in intervals) {
            clearInterval(intervals[i]);
          }
        }
        wx.setStorageSync("intervals", "");
        return;
      }
      var time = parseInt(textTmp.substring(0, textTmp.length - 1)) - 1;

      if (time == 0) {
        that.setData({ text: "获取验证码", getClass: "canget" });
        wx.setStorageSync("waitTime", "");
        clearInterval(t1);
        var intervals = wx.getStorageSync("intervals");
        if (intervals != "") {
          for (var i in intervals) {
            clearInterval(intervals[i]);
          }
        }
        wx.setStorageSync("intervals", "");
        return;
      }
      that.setData({ text: time + "s" });
      wx.setStorageSync("waitTime", time + "s");
    }, 1000);
    var intervals = wx.getStorageSync("intervals");
    if (intervals == "") {
      intervals = [];
      intervals.push(t1);
      wx.setStorageSync("intervals", intervals);
    } else {
      intervals.push(t1);
      wx.setStorageSync("intervals", intervals);
    }

  },
  //初始化数据
  initPhoneData:function(){
    var blackUserInfo = wx.getStorageSync("blackUserInfo");
    this.setData({ phone: blackUserInfo.userData.mobile});
  },
  onShow: function () {
    this.initPhoneData();
    wx.removeStorageSync("waitTime");
    var waitTime = wx.getStorageSync("waitTime");
    var intervals = wx.getStorageSync("intervals");
    if (intervals != "") {
      for (var i in intervals) {
        clearInterval(intervals[i]);
      }
    }
    if (waitTime == "NaNs") {
      wx.setStorageSync("waitTime", "");
      waitTime = "";
    }
    if (waitTime != "") {
      this.reSetWaitTime(waitTime);
    }
  },
  //设置验证码
  setCode: function (e) {
    var code = e.detail.value;
    this.setData({ code: code });
  },
  //设置手机号
  setPhone: function (e) {
    var phone = e.detail.value;
    this.setData({ phone: phone });
  },
  //设置密码
  setPassword: function (e) {
    var password = e.detail.value;
    this.setData({ password: password });
  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  onLoad: function (options) {

  },
  //点击提交
  onTapCommit: function () {
    let that = this;
    if (that.data.code.length < 6) {
      that.getPromptPark('请输入验证码');
      return;
    }
    if (that.data.password.length < 6) {
      that.getPromptPark('请输入密码');
      return;
    }
    this.addSafePassword();
  },
  onReady: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  }

})