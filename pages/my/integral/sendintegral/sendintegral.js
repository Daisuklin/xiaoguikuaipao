var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
Page({
  data: {
    passWord: '',
    passWordArr: [],
    focus: false,
    focus2: false,
    focus3: false,
    adjust_position: true,
    integralV: "",
    phone: "",
    isOk: false,
    isOver: false
  },
  forgetPassword:function(){
    wx.navigateTo({
      url: '/pages/my/securitycenter/addPassword/addPassword',
    })
  },
  commit: function () {
    var blackUserInfo = wx.getStorageSync("blackUserInfo");
    var havaPassword = blackUserInfo.commonData.safePasswordFlag;
    if (!havaPassword) {
      this.showPasswordTips();
      return ;
    }
    var integralV = this.data.integralV;
    var phone = this.data.phone;
    if (phone == '' || phone.length != 11 || isNaN(phone)) {
      wx.showToast({
        icon: "loading",
        title: '请输入正确号码',
      })
      return;
    }
    if (integralV == '' || integralV <= 0) {
      wx.showToast({
        icon: "loading",
        title: '请输入正确积分值',
      })
      return;
    }
    this.setData({ focus: true });
  },
  tapMask: function () {
    this.setData({ focus: false });
  },
  setPhone: function (e) {//设置电话
    var value = e.detail.value;
    var integralV = this.data.integralV;
    if (integralV != "" && integralV <= this.data.viewPointNum && integralV > 0 && value != '' && value.length == 11 && !isNaN(value)) {
      this.setData({ isOk: true });
    } else if (integralV == "" || integralV > this.data.viewPointNum || integralV <= 0 || value == '' || value.length != 11 || isNaN(value)) {
      this.setData({ isOk: false });
    }
    this.setData({ phone: value });
  },
  setIntegral: function (e) {//设置积分
    var value = e.detail.value;
    var phone = this.data.phone;
    if (value > this.data.viewPointNum) {
      this.setData({ isOver: true });
    } else if (value <= this.data.viewPointNum) {
      this.setData({ isOver: false });
    }
    if (value <= this.data.viewPointNum && value != 0 && phone != '' && phone.length == 11 && !isNaN(phone)) {
      this.setData({ isOk: true });
    } else if (value > this.data.viewPointNum || value <= 0 || value == "" || phone == '' || phone.length != 11 || isNaN(phone)) {
      this.setData({ isOk: false });
    }
    this.setData({ integralV: value });
  },
  showToast: function (res) {
    console.info("成功", res);
    var that = this;
    if (res.data.succeeded) {
      this.setData({
        passWord: '',
        passWordArr: [],
        focus: false,
        focus2: false,
        focus3: false,
        adjust_position: true
      });
      var integralV = this.data.integralV;
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/my/integral/tips/tips?id=1&integralV=' + integralV,
      })
    } else if (!res.data.succeeded) {
      this.setData({
        passWord: '',
        passWordArr: [],
        focus: false,
        focus2: false,
        focus3: false,
        adjust_position: true
      });
      wx.showModal({
        title: '',
        content: '密码错误，请重试',
        cancelText: "忘记密码",
        confirmText: "重试",
        cancelColor: "#222222",
        confirmColor: "#222222",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({ focus: true });
          } else if (res.cancel) {
            wx.navigateTo({
              url: '/pages/my/securitycenter/addPassword/addPassword',
            })
          }
        }
      })
    }

  },
  onChangeInput: function (e) {
    let that = this;
    if (e.detail.value.length > that.data.passWord.length) {
      that.data.passWordArr.push(true);
    } else if (e.detail.value.length < that.data.passWord.length) {
      that.data.passWordArr.pop();
    }
    that.setData({
      passWord: e.detail.value,
      passWordArr: that.data.passWordArr
    });
    if (e.detail.value.length >= 6) {
      this.sendIntagral();
      return;
    }
  },
  sendIntagral: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var passWord = this.data.passWord;
    var phone = this.data.phone;
    var integralV = this.data.integralV;
    integralUtil.controllerUtil.sendIntagral({
      safePassword: passWord,
      mobile: phone,
      change: integralV
    }, function (res) {
      var viewPointNum = wx.getStorageSync("viewPointNum");
      var tmp = viewPointNum - parseInt(integralV);
      wx.setStorageSync("viewPointNum", tmp);
      that.showToast(res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.setData({
      icons: iconsUtils.getIcons().integralIcons,
      viewPointNum: parseInt(options.viewPointNum)
    });
  },
  onReady: function () {

  },
  showPasswordTips: function () {
    wx.showModal({
      title: '温馨提示',
      content: '为确保账户资金安全，请设置安全密码不设置，龟米使用，提现将受限制',
      cancelText: "暂不设置",
      confirmText: "去设置",
      cancelColor: "#222222",
      confirmColor: "#222222",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/my/securitycenter/securitycenter?havaPassword=false',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  onShow: function () {
    var blackUserInfo = wx.getStorageSync("blackUserInfo");
    var havaPassword = blackUserInfo.commonData.safePasswordFlag;
    if (!havaPassword) {
      this.setData({ havaPassword: havaPassword});
      this.showPasswordTips();
    }

    this.setData({
      passWord: '',
      passWordArr: [],
      focus: false,
      focus2: false,
      focus3: false,
      adjust_position: true,
      integralV: "",
      phone: ""
    });
    var viewPointNum = wx.getStorageSync("viewPointNum");
    this.setData({ viewPointNum: viewPointNum });
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