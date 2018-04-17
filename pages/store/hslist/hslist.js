var appUtil = require('../../../utils/appUtil.js');
var app = getApp();
Page({
  data: {
    goods: [],
    goodsLen: 0,
  },
  //设置商品的收藏状态
  setGoodCollect: function (e) {
    console.log("设置商品收藏状态");
    var id = e.currentTarget.id;
    var goods = this.data.goods;
    for (var i in goods) {
      if (goods[i].goods_id == id) {
        goods[i].collect = !goods[i].collect;
        this.collectGood(goods[i].goods_id, goods[i].collect);
        break;
      }

    }
    this.setData({ goods: goods });
  },
  //取消灰蒙层
  cancelMask: function (e) {
    console.log("取消灰蒙");

    var id = e.currentTarget.id;
    var goods = this.data.goods;
    for (var i in goods) {
      if (goods[i].goods_id == id) {
        goods[i].isTapCollected = false;
        break;
      }

    }
    this.setData({ goods: goods });
  },
  //查看商品是否收藏，一级弹出蒙层
  checkCellectGood: function (e) {

    var id = e.currentTarget.id;
    var goods = this.data.goods;
    for (var i in goods) {
      if (goods[i].goods_id == id) {
        goods[i].isTapCollected = true;
        break;
      }

    }
    this.setData({ goods: goods });
  },
  //收藏商品
  collectGood: function (goodId, isFavorites) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var that = this;
    var storeId = this.data.storeId;
    var memberId = this.data.memberId;
    wx.request({
      url: appUtil.ajaxUrls().collectGood, //
      data: {
        store_id: storeId,
        memberId: memberId,
        isFavorites: isFavorites,
        goodsId: goodId,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("收藏商品返回");
        console.log(res)
        if (res.data.message.type == "success") {

        }
        wx.hideLoading();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },


  //查看商品
  checkProduct: function (e) {
    var id = e.currentTarget.id;
    wx.redirectTo({
      url: '/pages/detail/goodsdetail?goodId=' + id,
    })
  },
  onLoad: function (options) {
    wx.removeStorageSync("scanGoodsIndex");
    var storeId = options.storeId;
    var memberId = appUtil.lrhMethods.getMemberIdUser();
    this.setData({ storeId: storeId, memberId: memberId });
    if (memberId != null) {
      this.getScanGoods();
    }


  },
  getScanGoods: function () {

    var that = this;
    var scanGoodsIndex = wx.getStorageSync("scanGoodsIndex");
    if (scanGoodsIndex == '') {
      scanGoodsIndex = 1;
    } else {
      scanGoodsIndex = 1 + parseInt(scanGoodsIndex);
    }
    wx.request({
      url: appUtil.ajaxUrls().getScanGoods, //
      data: {
        memberId: that.data.memberId,
        storeId: that.data.storeId,
        pageIndex: scanGoodsIndex,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到已扫商品返回" + scanGoodsIndex);
        console.log(res)

        if (res.data.message.type == "success") {
          wx.setStorageSync("scanGoodsIndex", scanGoodsIndex);
          var goods = that.data.goods;
          that.setData({ goodsLen: res.data.data.total });
          for (var i = 0; i < res.data.data.data.length; i++) {
            console.log(res.data.data.data[i].goods_id);
            res.data.data.data[i].isTapCollected = false;
            goods.push(res.data.data.data[i]);
          }
          that.setData({ goods: goods });
        }
        wx.hideLoading();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },

  onReady: function () {

  },
  onShow: function () {
    app.clearMySelfStorage();

  },
  onHide: function () {
    wx.removeStorageSync("seachGoodsIndex");
  },
  onUnload: function () {
    wx.removeStorageSync("seachGoodsIndex");
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    this.getScanGoods();
  },
})