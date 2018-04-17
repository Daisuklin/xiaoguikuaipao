// pages/my/payment/payment.js
var app = getApp();
var appUtil = require('../../../utils/appUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seduce: false,
    pass: true,
    assignTime: 1800000,
  },

  //点击修改默认状态（共四个）
  seduce: function (e) {
    console.log(e)
    var payway = e.currentTarget.id;
    this.setData({
      payway: payway
    })

  },

  //点击返回留在本页
  backtrack: function () {
    this.setData({
      marked: false
    })
  },

  //点击前往购买跳转充值页面
  skip: function () {
    wx.showLoading({
      title: '客官别急哟',
    })
    wx.navigateTo({
      url: '/pages/coupon/buycoupon/buycoupon?isToReback=1',
    })
    wx.hideLoading()
    this.setData({
      marked: false
    })
  },

  //点击确认支付操作
  payment: function () {
    var that = this;
    var assignTime = that.data.assignTime;//获取倒计时
    var payway = that.data.payway;//获取支付方式
    //判断选取支付方式
    if (payway == "paybalance" || payway == "wxa") {
      //判断在倒计时的时限内完成
      if (assignTime >= 1000) {
        wx.request({
          url: appUtil.ajaxUrls().paymentUrl, //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            "id": that.data.orderId,//订单id
            "openId": appUtil.appUtils.getOpenIdData(),//微信openId
            "payWay": payway,//支付类型
            "type": "pay"//类型
          },
          header: {
            'Authorization': appUtil.appUtils.getTokenData(),
            'content-type': 'application/json', // 默认值
            'api': 'web',
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.succeeded == true) {
              //抵扣券直接支付成功
              if (payway == 'paybalance') {
                wx.removeStorageSync("optional")
                wx.removeStorageSync("mailId")
                wx.removeStorageSync("addresseeId")
                wx.showToast({
                  image: '../../../image/voucher.png',
                  title: res.data.data,
                })
                if (that.options.transmitId == 15626199190) {//确定是店铺入口后，做的操作
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 2
                    })
                  }, 1500)
                } else {
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../my',
                    })
                  }, 1500)
                }
              } else {//判断微信支付
                if (res.data.succeeded == true) {
                  var timeStamp = res.data.data.timeStamp;
                  var nonceStr = res.data.data.nonceStr;
                  var parcel = res.data.data.package;
                  var paySign = res.data.data.paySign;
                  var signType = res.data.data.signType;
                  if (res.data.succeeded == true) {
                    //调用微信支付
                    wx.requestPayment({
                      'timeStamp': timeStamp,
                      'nonceStr': nonceStr,
                      'package': parcel,
                      'signType': signType,
                      'paySign': paySign,
                      'success': function (res) {
                        console.log(res)
                        wx.removeStorageSync("optional")
                        wx.removeStorageSync("mailId")
                        wx.removeStorageSync("addresseeId")
                        wx.showToast({
                          image: '../../../image/wx.png',
                          title: '微信支付成功',
                        })
                        if (that.options.transmitId == 15626199190) {//确定是店铺入口后，做的操作
                          setTimeout(function () {
                            wx.navigateBack({
                              delta: 2
                            })
                          }, 1500)
                        } else {
                          setTimeout(function () {
                            wx.switchTab({
                              url: '../my',
                            })
                          }, 1500)
                        }
                      },
                      'fail': function (res) {
                        wx.showLoading({
                          title: '支付失败',
                        })
                        setTimeout(function () {
                          wx.hideLoading()
                        }, 1500)
                      }
                    })
                  }
                } else {
                  wx.showLoading({
                    title: '读取失败',
                  })
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 2000)
                }
              }
            } else if (res.data.error.code == 401) {
              appUtil.appUtils.setShowMessage();
            } else if (res.data.error.descript == "钱包余额不足") {//判断抵扣券支付失败
              that.setData({
                marked: true
              })
            } else if ((res.data.error.descript == "非法支付类型")) {
              wx.showToast({
                icon: "loading",
                title: '请选择支付方式',
              })
            }
          }
        })
      }
    } else {
      wx.showToast({
        icon: "loading",
        title: '请选择支付方式',
      })
    }
  },

  //倒计时
  countdown: function () {
    var that = this;
    var assignTime = that.data.assignTime;
    var int = setInterval(function () {
      if (assignTime >= 1000) {
        //获取指定倒计时的毫秒   
        assignTime -= 1000;
        var minute = parseInt((assignTime % (1000 * 60 * 60)) / (1000 * 60));
        var second = parseInt(assignTime % (1000 * 60)) / 1000;
        if (minute < 10) {
          minute = "0" + minute;
        }
        if (second < 10) {
          second = "0" + second;
        }
        that.setData({
          clock: minute,
          moment: ':' + second,
          assignTime: assignTime
        })
      } else {
        clearInterval(int)
        wx.showToast({
          image: '../../../image/time.png',
          title: '官人时间到咯',
        })
        setTimeout(function () {
          wx.navigateBack({
          })
        }, 1500)
      }
    }, 1000)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取订单id
    var id = options.id;
    //支付金额
    var totalPrice = options.totalPrice;
    this.setData({
      orderId: id,
      totalPrices: totalPrice
    })
    this.voucher()//抵扣券金额
  },

  //获取抵扣券金额
  voucher: function () {
    var that = this;
    //调用抵扣券接口
    wx.request({
      url: appUtil.ajaxUrls().setPayState, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'Authorization': appUtil.appUtils.getTokenData(),
        'content-type': 'application/json',// 默认值
        'api': 'web',
      },
      success: function (res) {
        console.log('-----------')
       console.log(res.data)
        var payBalance = res.data.data.payBalance;
        var defaultPay = res.data.data.defaultPay;
        if (res.data.succeeded == true){
          that.setData({
            payBalance: payBalance
          })
          //判断抵扣券是否为默认状态
          if (defaultPay == 1) {
            that.setData({
              payway: "paybalance"
            })
          }
        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        } 
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.countdown()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})