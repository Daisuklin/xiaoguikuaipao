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
    isOver: false,
    isPrompt: false
  },
  forgetPassword: function () {
    wx.navigateTo({
      url: '/pages/my/securitycenter/addPassword/addPassword',
    })
  },
  commit: function () {
    var blackUserInfo = wx.getStorageSync("blackUserInfo");
    var havaPassword = blackUserInfo.commonData.safePasswordFlag;
    if (!havaPassword) {
      this.showPasswordTips();
      return;
    }
    var integralV = this.data.integralV;
    var phone = this.data.phone;
    if (phone == '' || phone.length > 11 || isNaN(phone)) {
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
  let that = this;
    var value = e.detail.value;
    var integralV = this.data.integralV;
   
    if (integralV != "" && integralV <= this.data.viewPointNum && integralV > 0 && value != '' && value.length == 11 && !isNaN(value)) {
      this.setData({ isOk: true });
    } else if (integralV == "" || integralV > this.data.viewPointNum || integralV <= 0 || value == '' || value.length != 11 || isNaN(value)) {
      this.setData({ isOk: false });
    }
    if (value.length > 11) {
      that.getPromptPark("请正确输入电话号码");
      this.setData({ phone: that.data.phone });
      return;
    }else{
      this.setData({ phone: value });
    }
    console.info("value", value, that.data.phone)
  },
  
  setIntegral: function (e) {//设置积分
    var value = e.detail.value;
    var phone = this.data.phone;
    var viewPointNum = parseFloat(this.data.viewPointNum);
    console.info("value", value, "viewPointNum", viewPointNum, value > viewPointNum)
    if (value > viewPointNum) {
      console.info("123")
      this.setData({
        isOver: true,
        integralV: viewPointNum
      });
    } else if (value <= viewPointNum) {
      this.setData({ isOver: false, integralV: value });
    }
    if (value <= viewPointNum && value != 0 && phone != '' && phone.length == 11 && !isNaN(phone)) {
      this.setData({ isOk: true });
    } else if (value > viewPointNum || value <= 0 || value == "" || phone == '' || phone.length != 11 || isNaN(phone)) {
      this.setData({ isOk: false });
    }
    // this.setData({ integralV: value });
  },
  //赠送龟米给送回反馈提示
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
      // 赠送龟米失败
      this.setData({
        passWord: '',
        passWordArr: [],
        focus: false,
        focus2: false,
        focus3: false,
        adjust_position: true
      });
      if (res.data.error.code == '1004' || res.data.message.descript =='安全密码错误,请重试'){
        // 输入密码错误
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
      }else{
        // 其他错误类型
        that.getPromptPark(res.data.message.descript);
      }
    }
  },
  //监听密码输入
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
  //向服务器请求赠送龟米
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
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  onLoad: function (options) {
    this.setData({
      icons: iconsUtils.getIcons().integralIcons,
      viewPointNum: parseInt(options.viewPointNum)
    });
  },
  onReady: function () {

  },
  //给用户提示是否设置安全密码
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
      this.setData({ havaPassword: havaPassword });
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