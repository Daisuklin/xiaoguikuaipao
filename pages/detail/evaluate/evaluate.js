// pages/detail/evaluate/evaluate.js
var appUtil = require("../../../utils/appUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    avatarUrl: null,
    icon: {//本地图片
      dissatisfied: "../../../image/detail/dissatisfied.png",
      satisfied: "../../../image/detail/satisfied.png",
      geval_member: "../../../image/detail/geval_member.png"
    },
  },
  previewImg: function (e) {//评论区展示图
    var that = this,
      //获取当前图片的下表
      index = e.currentTarget.dataset.index,
      //数据源
      pictures = this.data.pictures[index];
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
  },
  getSelectShopncEvaluate: function (options) {//获取评论接口
    var that = this;
    const goodId = options.goodId
    console.log(goodId)
    wx.request({
      url: appUtil.ajaxUrls().selectShopncEvaluate,
      data: {
        goodsId: goodId,
        // goodsId: 84722,
        pageIndex: 1
      },
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
      },
      method: 'post',
      dataType: '',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.message.type == 'success') {
          var shopncEva = res.data.data;
          var pictures = [];
          for (var i = 0; i < shopncEva.length; i++) {//截取年月日
            var strTmp = "" + shopncEva[i].geval_addtime;
            console.log(isNaN(strTmp) + "----" + strTmp);
            shopncEva[i].geval_addtime = strTmp.substring(0, 10);
          }
          for (var i = 0; i < shopncEva.length; i++) {//处理评论区图片
            var strImg = "" + shopncEva[i].geval_image_arr;
            pictures[i] = shopncEva[i].geval_image_arr;
          }
          that.setData({
            shopncEvaluate: shopncEva,
            pictures: pictures
          })


        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSelectShopncEvaluate(options);
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