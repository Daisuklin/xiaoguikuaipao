var iconsUtils = require("../../../../image/icons.js");
var integralUtil = require("../../../../utils/integralUtil.js");
var appUtil = require("../../../../utils/appUtil.js");
Page({
  data: {
    passWord: '',
    passWordArr: [],
    focus: false,
    focus2: false,
    focus3: false,
    adjust_position: true,
    addressData:''
  },
  forgetPassword: function () {
    wx.navigateTo({
      url: '/pages/my/securitycenter/addPassword/addPassword',
    })
  },
  commit: function () {
    this.setData({ focus: true });
  },
  tapMask: function () {
    this.setData({ focus: false });
  },
  chooseAddr: function () {
    wx.navigateTo({
      url: '/pages/my/site/site?transmitId=' + '15626199190',//来自确认订单页的入口
    })
  },
  showToast: function (res) {
    console.info("成功", res);
    var that = this;
    if (res.data.succeeded) {
      wx.hideLoading();
      var orderId = res.data.data.id;
      wx.navigateTo({
        url: '/pages/my/integral/tips/tips?id=3&orderId=' + orderId,
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
  exchangeProduct: function () {
    this.setData({ focus: false });
    wx.showLoading({
      title: '提交中',
    })
    var that = this;
    var passWord = this.data.passWord;
    var good = this.data.good;
    var defaltId = wx.getStorageSync("defaltId");
    integralUtil.controllerUtil.exchangeProduct({
      "goodsId": good.goodID,
      "quantity": 1,
      "receiverAddId": defaltId,
      "safePassword": passWord,
      "sourcePlatform": "wxa"
    }, function (res) {
      that.showToast(res);
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    }, function (res) {
      wx.hideLoading();
    });
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
      this.exchangeProduct();
      return;
    }
  },
  // 选择地址之后重新渲染地址
  getAdressAgain: function (addressId) {
    let that = this;
    appUtil.controllerUtil.getaddresses(addressId, {}, function (resdata) {
      if (resdata.data.succeeded == true) {
        var addressData = resdata.data.data;
        console.info("addressData", addressData)
        that.setData({
          addressData: addressData
        })
      }
    })



  },
  onLoad: function (options) {
    this.setData({
      icons: iconsUtils.getIcons().integralIcons,
      good: JSON.parse(options.obj)
    });
    // 判断是否有默认地址
    var defaultAdId = appUtil.appUtils.getMemberIdData().userData;//获取默认地址
    var defaultAddress = (defaultAdId == null || defaultAdId == '' || typeof (defaultAdId) == 'undefined') ? '' : defaultAdId.defaultAddress;
    wx.setStorageSync("defaltId", defaultAddress);//初始化地址id，将默认地址id defaultAddress赋值给defaltId
    console.info("defaultAddress--onload", defaultAddress)
    if (defaultAddress != '' && defaultAddress != null && typeof (defaultAddress) != 'undefined') {
      this.getAdressAgain(defaultAddress);
    }
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({
      passWord: '',
      passWordArr: [],
      focus: false,
      focus2: false,
      focus3: false,
      adjust_position: true
    });

    var getDefaltId = appUtil.appUtils.getDefaltId() == '' || appUtil.appUtils.getDefaltId() == null || typeof (appUtil.appUtils.getDefaltId()) == 'undefined' ? '' : appUtil.appUtils.getDefaltId();//选择地址之后返回的地址id
    // var defaultAddress = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
    var defaultAdId = appUtil.appUtils.getMemberIdData().userData;//获取默认地址
    var defaultAddress = (defaultAdId == null || defaultAdId == '' || typeof (defaultAdId) == 'undefined') ? '' : defaultAdId;
    if (getDefaltId != '' && getDefaltId != null && typeof (getDefaltId) != 'undefined') {
      console.info("getDefaltId", getDefaltId, "defaultAddress", defaultAddress)
      this.getAdressAgain(getDefaltId);
    }


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