
var appUtil = require("../../utils/appUtil.js")

Page({
  data: {
    icon: {
      post: '../../image/post.png',
      order: '../../image/order.png',
      accept: '../../image/accept.png',
      pellet: '../../image/pellet.png',
      store: '../../image/store.png',
      collect: '../../image/fav.png',
      contact: '../../image/contact.png',
      message: '../../image/message.png',
      deduction: '../../image/voucher.png'
    },
    avatarUrl: '../../image/head.png',
    nickName: '登录/注册',
    userInfo: '',
    isSeller:true
  },

  //封装登录态提示语和点击确定时的操作
  packaging: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.getUserInfo({
            success: function (res) {
              wx.showLoading({
                title: '登录中',
              })
              //得到微信返回用户信息
              if (res.userInfo) {
                //缓存微信用户
                appUtil.appUtils.setStorageUser(res.userInfo);
                //缓存微信用户encryptedData
                appUtil.appUtils.setEncryptedData(res.encryptedData)

                //解码encryptedData
                appUtil.controllerUtil.getDemodifier({
                  "encryptedData": res.encryptedData,
                  "iv": res.iv,
                  "sessionKey": appUtil.appUtils.getSessionkeyData()
                }, function (data) {
                  if ("undefined" == typeof (data.data.unionId)) {
                    wx.hideLoading();
                    console.log('获取用户unionId失败！');
                    wx.showToast({
                      title: '登录失败！错误码2001！',
                    })
                    return false;
                  }

                  appUtil.appUtils.setUnionIdData(data.data.unionId);

                  //登陆    
                  appUtil.controllerUtil.login(
                    {
                      "lngLat": {
                        "latitude": wx.getStorageSync("latitude") == '' ? 0 : wx.getStorageSync("latitude"),
                        "longitude": wx.getStorageSync("longitude") == '' ? 0 : wx.getStorageSync("latitude"),
                      },
                      "openId": appUtil.appUtils.getOpenIdData(),
                      "type": "wechat",
                      "client": "web",
                      "sourceWechat": "wxapp",
                      unionId: appUtil.appUtils.getUnionIdData(),
                    }, function (data) {
                      wx.hideLoading();
                      //判断是否已经绑定过电话号码的用户
                      if (data.data.succeeded == false && data.data.error.code == 1000) {

                        //未绑定
                        //平台用户信息
                        appUtil.appUtils.setBlackUser(data.data.data);
                        wx.navigateTo({
                          url: '/pages/login/bindPhone/bindPhone'
                        })
                      } else {
                        wx.hideLoading();
                        if (data.data.succeeded == true) {
                          that.setData({
                            avatarUrl: res.userInfo.avatarUrl,
                            nickName: res.userInfo.nickName,
                          })
                          //下面的取消按钮
                          appUtil.appUtils.setTokenData(data.data.data.commonData.token);

                          //平台用户信息
                          appUtil.appUtils.setBlackUser(data.data.data);
                        } else {
                          wx.showToast({
                            title: data.data.data.errorMesg,
                          })
                        }
                      }
                    }
                  )
                }, function (res) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '请检查完咯状态！',
                  })
                  console.info(res);
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //点击地址功能跳转地址列表
  site() {
    //获取用户的token值
    var token = appUtil.appUtils.getTokenData();
    if (token == 0) {
      this.packaging()
    } else {
      wx.navigateTo({
        url: 'site/site?transmitId= ' + '14718597075',//判断来自平台级的地址总列表入口
      })
    }
  },

  //拨打客服
  tucao: function () {
    wx.makePhoneCall({
      phoneNumber: '400-660-9727',
    })
  },

  //点击订单功能跳转订单列表
  orderList() {
    //获取用户的token值
    var token = appUtil.appUtils.getTokenData();
    if (token == 0) {
      this.packaging()
    } else {
      wx.navigateTo({
        url: 'orderList/orderList',
      })
    }
  },

  // 点击收藏功能跳转订单列表
  collect() {
    //获取用户的token值 
    var token = appUtil.appUtils.getTokenData();
    if (token == 0) {
      this.packaging()
    } else {
      wx.navigateTo({
        url: 'collectList/collectList?transmitId= ' + '14718597075',//判断来自平台级的入口
      })
    }
  },
  /**
    * 生命周期函数--监听页面加载
    */
  checkIsSeller: function () {
    var blackUserInfo = wx.getStorageSync('blackUserInfo');
    if ('undefined' != typeof (wx.getStorageSync("blackUserInfo")) && wx.getStorageSync("blackUserInfo") != null && 'undefined' != typeof (wx.getStorageSync("blackUserInfo").isSeller) && null != wx.getStorageSync("blackUserInfo").isSeller){
      this.setData({ isSeller: wx.getStorageSync("blackUserInfo").isSeller});
    }
  },
  onLoad: function (options) {

    if (appUtil.appUtils.getTokenData()) {
      var user = appUtil.appUtils.getStorageUser()
      this.setData({
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
      })
    }
  },
  onReady: function () {

  },

  //点击寄件功能跳转配送寄件
  mail: function () {
    //获取用户的token值
    var token = appUtil.appUtils.getTokenData();
    if (token == 0) {
      this.packaging()
    } else {
      // wx.showLoading({
      //   title: '该功能暂停使用',
      // })
      // setTimeout(function () {
      //   wx.hideLoading();
      // }, 1500)
      //更新新功能（暂停寄件）
      wx.navigateTo({
        url: 'mail/mail?transmitId=1',//判断是平台级的入口
      })
      wx.setStorageSync('assignment', '0753')
    }
  },

  //点击抵扣券的跳转
  deduction: function () {
    //获取用户的token值
    var token = appUtil.appUtils.getTokenData();
    if (token == 0) {
      this.packaging()
    } else {
      wx.navigateTo({
        url: '/pages/coupon/coupon',
      })
    }
  },

  onShow: function () {
    if (appUtil.appUtils.getTokenData() == null || appUtil.appUtils.getTokenData() == "") {
      this.setData({ avatarUrl: '../../image/head.png', });
      this.setData({ nickName: '登录/注册' })
    }
    this.onLoad()
    wx.login({
      success: res => {
        console.info(res);
        if (res.code) {
          //发起网络请求
          console.info("code:res.code" + res.code)
          appUtil.controllerUtil.getUserOpenIdController({ code: res.code }, function (res) {
            console.info(JSON.stringify(res))
            appUtil.appUtils.setSessionkeyData(res.data.data.session_key);
            appUtil.appUtils.setOpenIdData(res.data.data.openid);
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        console.info(JSON.stringify(res));
      }
    })
    this.checkIsSeller();
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  /**
   * 用户点击授权登陆
   */
  getUserInfo: function (e) {
    wx.showLoading({
      title: '登录中',
    })
    var that = this;
    //得到微信返回用户信息
    if (e.detail.userInfo) {
      //缓存微信用户
      appUtil.appUtils.setStorageUser(e.detail.userInfo);
      //缓存微信用户encryptedData
      appUtil.appUtils.setEncryptedData(e.detail.encryptedData)

      //解码encryptedData
      appUtil.controllerUtil.getDemodifier({
        "encryptedData": e.detail.encryptedData,
        "iv": e.detail.iv,
        "sessionKey": appUtil.appUtils.getSessionkeyData()
      }, function (data) {
        if ("undefined" == typeof (data.data.unionId)) {
          wx.hideLoading();
          console.log('获取用户unionId失败！');
          wx.showToast({
            title: '登录失败！错误码2001！',
          })
          return false;
        }

        appUtil.appUtils.setUnionIdData(data.data.unionId);

        //登陆    
        appUtil.controllerUtil.login(
          {
            "lngLat": {
              "latitude": wx.getStorageSync("latitude") == '' ? 0 : wx.getStorageSync("latitude"),
              "longitude": wx.getStorageSync("longitude") == '' ? 0 : wx.getStorageSync("latitude"),
            },
            "openId": appUtil.appUtils.getOpenIdData(),
            "type": "wechat",
            "client": "web",
            "sourceWechat": "wxapp",
            unionId: appUtil.appUtils.getUnionIdData(),
          }, function (data) {
            wx.hideLoading();
            //判断是否已经绑定过电话号码的用户
            if (data.data.succeeded == false && data.data.error.code == 1000) {

              //未绑定
              //平台用户信息
              appUtil.appUtils.setBlackUser(data.data.data);
              wx.navigateTo({
                url: '/pages/login/bindPhone/bindPhone'
              })
            } else {
              wx.hideLoading();
              if (data.data.succeeded == true) {
                that.setData({
                  avatarUrl: e.detail.userInfo.avatarUrl,
                  nickName: e.detail.userInfo.nickName,
                })
                //下面的取消按钮
                appUtil.appUtils.setTokenData(data.data.data.commonData.token);

                //平台用户信息
                appUtil.appUtils.setBlackUser(data.data.data);
              } else {
                wx.showToast({
                  title: data.data.data.errorMesg,
                })
              }
            }
          }
        )
      }, function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '请检查完咯状态！',
        })
        console.info(res);
      })
    }
  },

  quit: function () {
    wx.showLoading({
      title: '退出登录中',
    })
    wx.removeStorageSync("unionid");
    wx.removeStorageSync("token");
    wx.removeStorageSync("blackUserInfo");
    wx.removeStorageSync("encryptedData");
    wx.removeStorageSync("userInfo");
    wx.removeStorageSync("optional")
    wx.removeStorageSync("mailId")
    wx.removeStorageSync("addresseeId")
    this.setData({ avatarUrl: '../../image/head.png' });
    this.setData({ nickName: '登录/注册' })
    wx.hideLoading();
  },
  onReachBottom: function () {

  },
})