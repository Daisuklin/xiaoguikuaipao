// pages/login/bindPhone/bindPhone.js

var appUtil = require("../../../utils/appUtil.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {


    phone:null,
    sendBtntext:"获取验证码",
    validateCode:"",
    time:60,
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
  
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

    console.info("onShow")

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    console.info("onHide")

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

  ,sendMessage:function(e){
    var thisPage=this;
    if (thisPage.data.phone == null || thisPage.data.phone == ""){
      wx.showToast({
        title:"电话号码为空！",
        icon:"loading"
      })
      return false;
    }
  
    appUtil.controllerUtil.sendValidate({
      mobile: this.data.phone,
      type:"bind"
    },function(data){
      thisPage.changeValidateMessage(thisPage.data.time)
    })
  },
  changeValidateMessage:function(time){
    var thisPage=this;
    thisPage.setData({
      disabled:true
    })
    thisPage.data.time = time;
    if(time!=0){
      thisPage.data.time = thisPage.data.time-1;
      console.info("倒计时(" + thisPage.data.time + ")")
     // thisPage.data.sendBtntext = "倒计时(" + thisPage.data.time +")";
      thisPage.setData({
        sendBtntext: "倒计时(" + thisPage.data.time + ")"
      })
      setTimeout(function(){
        thisPage.changeValidateMessage(thisPage.data.time)
      }, 1000);
     
    }else{
      thisPage.setData({
        disabled: false,
        sendBtntext: "获取验证码",
        time: 60,
      })
      
    }
  },
  sumbitValidate:function(e){
   
    wx.showToast({
      title: '提交中',
      icon:"loading",
      mask:true 
    })
    var validateCode=this.data.validateCode;
    var phone = this.data.phone;
    var userInfo = appUtil.appUtils.getStorageUser();
  
    appUtil.controllerUtil.bindMobile(
      {
        "avatar": userInfo.avvatarUrl,//头像
        "client": "web",
        "code": validateCode, //
        "mobile": phone,
        "name": userInfo.nickName,//昵称
        "openId": appUtil.appUtils.getOpenIdData(),
        //"sex": userInfo.avvatarUrl, // 'male', 'female
        "sourceWechat": "wxapp",
        "unionId": appUtil.appUtils.getUnionIdData() 
      }
     , function (data) {
          if (data.succeeded==true){
            //登陆    
            appUtil.controllerUtil.login(
              {
                "lngLat":{
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
                    //下面的取消按钮
                    appUtil.appUtils.setTokenData(data.data.data.commonData.token);

                    //平台用户信息
                    appUtil.appUtils.setBlackUser(data.data.data);
                    wx.navigateBack();
                  } else {
                    wx.showToast({
                      title: data.data.data.errorMesg,
                    })
                  }
                 
                }
              }
            )
          }else{
            wx.showToast({
              title:"绑定失败！",
            })
          }
      }, function (e) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误！',
        })
        console.info(e);
      }, function (e) {
        wx.hideLoading();
        wx.hideToast();
      })
  }
  ,setInputPhon:function(e){
    this.setData({
      phone: e.detail.value
    })
  }
  , setInputValidateCode:function(e){
    this.setData({
      validateCode: e.detail.value
    })
  }

})