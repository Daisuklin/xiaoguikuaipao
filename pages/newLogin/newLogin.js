var appUtil = require("../../utils/appUtil.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:false,
    loginIng:false
  },
  userSetFunction:function(){
    wx.login({
      success: res => {
        if (res.code) {
            //发起网络请求
            appUtil.controllerUtil.getUserOpenIdController({ code: res.code }, function (res) {
              appUtil.appUtils.setSessionkeyData(res.data.data.session_key);
              appUtil.appUtils.setOpenIdData(res.data.data.openid);
            })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    var thisPage=this;
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ loginIng: false});
    this.userSetFunction();
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
  
  },
  userSetting:function(){
    
   
  }
  ,userLogin:function(){
    var thisPage = this;
    wx.showLoading({
      title: '登录中',
      mask:true,
    })
    thisPage.setData({
      loginIng:true
    })
   
   // thisPage.userSetFunction()
    wx.getSetting({
      success: (res) => {
        //授权判断
        if (!res.authSetting['scope.userInfo']) {
          wx.hideLoading();
          wx.openSetting({
            
          })
          //未授权激活授权
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              wx.getUserInfo({
                success: (res) => {
                  thisPage.getUserInfo(res);
                }})
          }})
        } else {
          //已授权
          wx.getUserInfo({
            success: (res) => {
              thisPage.getUserInfo(res);
            }
          })
        }

      }
    })
  }, 
  refuseLogin: function () {
    console.info("refuseLogin")
    wx.navigateBack();
  },
  getUserInfo: function (e) {
    var thisPage = this;
    //得到微信返回用户信息
    if (e.userInfo) {
      //缓存微信用户
      console.info("e.userInfo："+JSON.stringify(e.userInfo))
      appUtil.appUtils.setStorageUser(e.userInfo);
      //缓存微信用户encryptedData
      appUtil.appUtils.setEncryptedData(e.encryptedData)

      //解码encryptedData
      appUtil.controllerUtil.getDemodifier({
        "encryptedData": e.encryptedData,
        "iv": e.iv,
        "sessionKey": appUtil.appUtils.getSessionkeyData()
      }, function (data) {
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
            client: "web",
            "sourceWechat": "wxapp",
            unionId: appUtil.appUtils.getUnionIdData(),
          }
          , function (data) {
            console.info(JSON.stringify(data.data));
            if (data.data.succeeded == false && data.data.error.code == 1000) {
              //判断是否已经绑定过电话号码的用户
              appUtil.appUtils.setBlackUser(data.data.data);
              appUtil.controllerUtil.getUserTokenController({
                unionId: appUtil.appUtils.getUnionIdData(),
                isStore: 1
              }, function (res) {
               // appUtil.appUtils.setTokenData(res.data.data.member.member_token);
                wx.redirectTo({
                  url: '/pages/login/bindPhone/bindPhone'
                })
              })
            } else {
              if (data.data.succeeded == false) {
                thisPage.setData({
                  loginIng: false
                })
                wx.hideLoading();
                wx.showToast({
                  title: '登录失败！',
                  icon: "loading"
                })
              } else {
                
                wx.hideLoading();
                appUtil.appUtils.setTokenData(data.data.data.commonData.token);
                appUtil.appUtils.setBlackUser(data.data.data);
                wx.navigateBack();
              }

            }
          },function (e) {
            wx.hideLoading();
            wx.showToast({
              title: '请检查网络状态！',
            })
            console.info(e);
          }, function (e) {
            wx.hideLoading();
            wx.hideToast();
          } 
        )
      })
    }else{
      
    }
  }
})