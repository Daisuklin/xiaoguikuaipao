// pages/my/wallet/receiptcode/receiptcode.js
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取商家二维码数据
  getcodeData: function (options) {
    let that = this;

    let getuserMessage = walletUtil.appUtils.getUserData();
    let courierData = getuserMessage.courierData;
    let getUserStoreData = walletUtil.appUtils.getUserData().mallData;//获取用户店铺信息
    let types = 'user';
    // let profileId = 'f68c5359850c4e17bf181cad607719c6';
    let profileId = courierData.profileId;//获取user的profileId
    // https://dev-logistics.xiaoguikuaipao.com/onePay/qrcode/employee/f68c5359850c4e17bf181cad607719c6
    let url = walletUtil.logisticsUrl + '/onePay/qrcode/' + types + '/' + profileId
    console.info(url)
    that.setData({
      imgurl: url
    })
  },
  // 保存收款二维码
  getSaveCodeimg:function(){
    let that = this;
    var imgSrc = that.data.imgurl;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    })
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log("downloadFile",res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log("saveImageToPhotosAlbum",data);
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // icon 图标
    console.info("图标", iconsUtils.getIcons().walletIcons);
    this.setData({ icons: iconsUtils.getIcons().walletIcons });
    this.getcodeData(options);
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