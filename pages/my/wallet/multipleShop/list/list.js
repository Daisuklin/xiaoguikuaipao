// pages/my/wallet/multipleShop/list/list.js
var iconsUtils = require("../../../../../image/icons.js");
var walletUtil = require("../../../../../utils/walletUtil.js");
var appUtil = require("../../../../../utils/appUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClick: false,
  },
  // 获取分店列表数据
  getbranchShopList: function () {
    let that = this;
    walletUtil.controllerUtil.getbranchShopList({},
      function (sucData) {
        if (sucData.data.succeeded) {
          let data = sucData.data.data;
          console.info("data", data)
          that.setData({
            list: data
          })
        } else {
          console.info("sucData", sucData.data)
        }
      }, function (failData) {

      }, function (comDate) {

      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getbranchShopList();
    this.setData({
      isClick: false,
      baseIcons: iconsUtils.getIcons().baseIcons,
      baseImages: iconsUtils.getIcons().baseImages
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 删除分店
  delAction: function (e) {
    this.setData({
      isClick: true
    })
    var thisPage = this;
    wx.showModal({
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          walletUtil.controllerUtil.getdelectStore(e.currentTarget.id, {},
            function (sucData) {
              console.info("删除sucData", sucData.data)
              if (sucData.data.succeeded) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                thisPage.getbranchShopList();
                if (thisPage.data.list.length<=1){
                  // 当只有总店铺时
                  walletUtil.appUtils.setShopIdData(thisPage.data.list[0].id);
                }else{
                  walletUtil.appUtils.setShopIdData('');
                }
              } else {
                console.info(sucData.data)
              }
              thisPage.setData({
                isClick: false
              })
            }, function (failData) { }, function (comData) { })
        } else if (res.cancel) {
          console.log('用户点击取消')
          thisPage.setData({
            isClick: false
          })
        }
      }
    })

  },
  // 新增分店
  gotoEdit: function (e) {
    this.setData({
      isClick: true
    })
    console.info(e.currentTarget.id)
    wx.showToast({
      icon: "loading",
      title: '加载中...',
      duration: 3000,
      mask: true,
      success: function () {
        wx.navigateTo({
          url: '/pages/my/wallet/multipleShop/edit/edit?indexs=1'
        })
      }
    })
  },
  // 编辑分店
  gotoUpdate: function (e) {
    this.setData({
      isClick: true
    })
    console.info(e.currentTarget.id)
    wx.showToast({
      icon: "loading",
      title: '加载中...',
      duration: 3000,
      mask: true,
      success: function () {
        wx.navigateTo({
          url: '/pages/my/wallet/multipleShop/edit/edit?indexs=2' + '&profileId=' + e.currentTarget.id,
        })
      }
    })
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