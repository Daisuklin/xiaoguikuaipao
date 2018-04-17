var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    valueFlag: false,
    icon: {
      coupon_l: '../../../image/coupon/coupon-01.png',
      coupon_r: '../../../image/coupon/coupon-02.png',
      close: '../../../image/coupon/close.png'
    },
    tanchuang: true,
    begin: '',
    give: 0,
    couponId:-1,
    coupons: '',
    value: '',
    money: '',
    actuallyNum: '',
    man: false,

    focus: true,
    coupons:[],
    isToReback: -1
  },
  moreCoupons: function () {
    var coupons = this.data.coupons;
    var couponId = this.data.couponId;
    if (couponId!=-1){
      wx.navigateTo({
        url: '/pages/coupon/couponList/couponList?coupons=' + JSON.stringify(coupons),
      })
    }else{
      wx.redirectTo({
        url: '/pages/coupon/couponList/couponList?coupons=' + JSON.stringify(coupons),
      })
    }
  
  },
  //获取更多优惠券
  getCoupons: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getCoupons,
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("获取更多优惠券");
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          that.setData({ coupons: res.data.data });
          if (res.data.data.length >= 1 && that.data.give == 0 && that.data.couponId==-1) {
            that.setData({ begin: res.data.data[0].begin, give: res.data.data[0].give });
          } else if (that.data.couponId!=-1) {
            that.getCouponById();
          }
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        }

        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  buy: function () {
    if (this.data.value > 50000) {
      wx.showToast({
        title: '最大值是5万',
        icon: 'loading',
        duration: 800
      })
      return;
    }
    if (this.data.value == '') {
      wx.showToast({
        title: '请输入数值',
        icon: 'loading',
        duration: 500
      })
      return;
    }

    //actuallyNum
    var value = this.data.value;
    var coupons = this.data.coupons;
    var len = coupons.length;
    if (len == 0) {
      this.setData({ actuallyNum: value });
      this.setData({ tanchuang: false });
      return;
    }
    //不够
    if (coupons.length >= 1 && value < coupons[0].begin) {
      this.setData({ actuallyNum: value });
      this.setData({ tanchuang: false });
      return;
    }
    //超出
    if (coupons.length >= 1 && value >= coupons[len - 1].end) {
      value = parseFloat(value);
      this.setData({ actuallyNum: value + coupons[len - 1].give });
      this.setData({ tanchuang: false });
      return;
    }
    for (var i = 0; i < coupons.length; i++) {
      if (coupons[i].begin <= value && value <= coupons[i].end) {
        value = parseFloat(value);
        this.setData({ actuallyNum: value + coupons[i].give });
        this.setData({ tanchuang: false });
        break;
      }
    }

  },
  submitPay:function(){
    this.sendBuyToServer();
  },
  sendBuyToServer:function(){
    var that = this;
    var value = this.data.value;
    wx.request({
      url: appUtil.ajaxUrls().payCoupon,
      data: {
        payWay:"wxa",//(app = APP支付, wxa = 小程序支付)
        amount: value,//(支付金额, 单位为元)
        openId: wx.getStorageSync("openid"),//(小程序支付时必传)
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("调起支付返回");
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success:function(res){
              console.log("支付成功"); 
              console.log(res)
              if (that.data.isToReback==0){
                wx.redirectTo({
                  url: '/pages/store/my/payment/payment',
                })
              } else if (that.data.isToReback==1){
                wx.redirectTo({
                  url: '/pages/my/payment/payment',
                })
              }else{
                wx.redirectTo({
                  url: '/pages/coupon/coupon?paytip=1',
                })
              }
            },
            fail:function(res){
              console.log("支付失败");
              console.log(res)
            }
          })
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        } else if (res.data.error.descript =="抵扣券暂时只支持商家充值"){
          wx.showToast({
            title: '暂支持商家',
            icon: "loading",
            duration: 1000,
          })
          setTimeout(function () {
            that.setData({ tanchuang:true});
          }, 1200);
        }

        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },

  setValue: function (e) {
    var value = e.detail.value;
    var numMax = parseFloat(value);
    //.replace(/\b(0+)/gi, "")
    if (numMax > 50000) {
      // this.setData({focus:false});
      // setTimeout(function(){
      //   wx.showToast({
      //     title: '最大值是5万',
      //     icon:'loading',
      //     duration:800
      //   })
      // },100);

      // //this.setData({value:50000});
      // return;
    } else if (numMax < 0) {
      this.setData({ focus: false });
      setTimeout(function () {
        wx.showToast({
          title: '请输入正确数值',
          icon: 'loading',
          duration: 800
        })
      }, 100);
      return;
    }
    value = value.replace(/\b(0+)/gi, "");
    console.log(value);
    var coupons = this.data.coupons;
    var flag = false;
    for (var i = 0; i < coupons.length; i++) {
      if (coupons[i].begin <= value && value < coupons[i].end) {
        this.setData({ give: coupons[i].give, begin: coupons[i].begin, man: true });
        flag = true;
        break;
      }
    }
    if (!flag && coupons.length >= 1) {
      this.setData({ begin: coupons[0].begin, give: coupons[0].give, man: false });
    }
    var len = coupons.length;
    if (len != 0&&value >= coupons[len - 1].end && coupons.length >= 1) {
      this.setData({ begin: coupons[len - 1].begin, give: coupons[len - 1].give, man: true });
    }
    this.setData({ value: value, actuallyNum: '' });
  },
  close: function () {
    this.setData({ tanchuang: true });
  },
  //获取余额
  getCouponDetail: function () {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getCouponDetail,
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("得余额返回");
        console.log(res)
        if (res.data.message.type == "success") {
          ////默认余额支付(0=关闭 1=开启)
          that.setData({ money: res.data.data.profile.payBalance, wechatPay: res.data.data.profile.defaultPay });
          //that.transFromServer(res.data.data);
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getCouponById:function(couponId){
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getCouponById+that.data.couponId,
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        //'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("通过id获取优惠券返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var coupon = res.data.data;
          that.setData({value:coupon.begin});
          var e = {
            detail:{
              value:coupon.begin
            }
          }
          that.setValue(e);
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  onLoad: function (options) {
    //options.q = "https://api.xiaoguikuaipao.com/coupon/5";
    if (options.isToReback != undefined) {
      this.setData({ isToReback: options.isToReback });
    }
    if (options.q != undefined) {
      var q = decodeURIComponent(options.q);//对二维码进来的链接进行转码
      var strIndex = q.lastIndexOf("/");//获取转码之后的goodsid
      var couponId = q.substring(strIndex + 1, q.length);
      this.setData({ couponId: couponId });
    }
    if (options.coupon != undefined) {
      var coupon = JSON.parse(options.coupon);
      this.setData({ give: coupon.give, begin: coupon.begin, value: coupon.begin, man: true });
    }
    this.getCoupons();
    if (options.remainMoney!=undefined){
      var remainMoney = parseFloat(options.remainMoney);
      this.setData({ money:remainMoney});
    }else{
      this.getCouponDetail();
    }

   
  },
  onReady: function () {

  },
  onShow: function () {
    console.log("token:" + wx.getStorageSync("token"));

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