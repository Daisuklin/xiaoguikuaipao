var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    latitude: wx.getStorageSync("latitude"),
    longitude: wx.getStorageSync("longitude"),
    areaCode: wx.getStorageSync("areaCode"),
    isStoreType: false,
    goodsList: [],
    stores: [],
    hotIndex: 1,
 
    goodIndex:1,
  },
  checkProduct: function (e) {
    var goodId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/goodsdetail?goodId=' + goodId,
    })
  },
  transDataFromServer: function (data) {
    var stores = this.data.stores;
    for (var i in data) {

      stores.push(data[i]);
      data[i].commendGood.forEach(function (good) {
        good.goods_price = Number(good.goods_price).toFixed(2);
        good.disCountMoney = Number((good.price_discount / 100) * Number(good.goods_price)).toFixed(2)
      })
    }

    this.setData({ stores: stores });
  },
  getFruitStores: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var storeFruitIndex = wx.getStorageSync("storeFruitIndex");
    if (storeFruitIndex == '') {
      storeFruitIndex = 1;
      wx.setStorageSync("storeFruitIndex", storeFruitIndex);
    } else {
      storeFruitIndex = storeFruitIndex + 1;
      wx.setStorageSync("storeFruitIndex", storeFruitIndex);
    }
    wx.request({
      url: appUtil.ajaxUrls().getFruitStores,
      data: {
        "longitude": that.data.longitude,
        "latitude": that.data.latitude,
        "areaCode": that.data.areaCode,
        "pageIndex": storeFruitIndex,
        "themeId": that.data.themeId,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log(storeFruitIndex + "初始化水果主题数据返回" + appUtil.ajaxUrls().getFruitStores);
        console.log(res)
        if (res.data.message.type == "success") {
          that.transDataFromServer(res.data.data);
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
  getHotStores: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var hotIndex = this.data.hotIndex;
    wx.request({
      url: appUtil.ajaxUrls().getPopularStores,
      data: {
        "pageIndex": hotIndex,
        "labelId": that.data.labelId,
        "longitude": that.data.longitude,
        "latitude": that.data.latitude,
        "areaCode": that.data.areaCode,
        "type": 2,//0:综合排序;1:销量最高;2:距离最近
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.info(that.data.activeIndex + "请求店铺数据返回", res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.message.type == "success") {
          that.transDataFromServer(res.data.data.storeList);
          that.setData({ hotIndex: hotIndex+1});
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      complete: function (res) {

      }
    })
  },
  getGoodList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().getThemeGoodList + "/" + that.data.themeId + "/"+that.data.goodIndex,
      //url:"https://api.xiaoguikuaipao.com/api/v1/selectShopncStoreByThemeIdActicity",
      data: {
        // "pageIndex": 1,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("商品列表数据返回" + appUtil.ajaxUrls().getThemeGoodList + "/" + that.data.themeId);
        console.log(res)
        if (res.data.message.type == "success") {
          var goodIndex = that.data.goodIndex + 1;
          var goods = res.data.data;
          var goodsList = that.data.goodsList;
          for (var i = 0; i < goods.length; i = i + 2) {
            var ojb = {
              left: goods[i],
              right: goods[i + 1]
            }
            goodsList.push(ojb);
          }
          that.setData({ goodsList: goodsList, goodIndex: goodIndex});
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
  onShow: function () {

  },
  onReachBottom: function () {
    if (!this.data.isStoreType){
      this.getGoodList();
    }else{
      if (this.data.isStoreType2 == "1") {
        this.getFruitStores();
      } else if (this.data.isStoreType2 == "2") {
        this.getHotStores();
      } 
    }
  },
  onLoad: function (options) {
    var banner = options.banner;
    var latitude = wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude");
    var areaCode = wx.getStorageSync("areaCode");
    this.setData({ areaCode: areaCode, longitude: longitude, latitude: latitude });
    // var themeId = 144;
    // var isStoreType = 0;
    var themeId = options.themeId;
    var isStoreType = options.isStoreType;
    this.setData({ banner: banner, themeId: themeId, isStoreType2: isStoreType });
    wx.removeStorageSync("storeFruitIndex");
    if (options.themeName!=undefined){
      wx.setNavigationBarTitle({
        title: options.themeName,
      })
    }

    if (isStoreType == '1') {
      console.log("得到水果店铺列表");
      this.setData({ isStoreType: true });
      this.getFruitStores();
    } else if (isStoreType == '2') {//热门店铺页面
      this.setData({ isStoreType: true, labelId: options.labelId});
      this.getHotStores();
    } else {
      console.log("得到商品列表");
      this.setData({ isStoreType: false });
      this.getGoodList();
    }
  },

  onReady: function () {

  },
  checkStore: function (e) {
    wx.showToast({
      title: '加载中',
      icon: "loading",
      mask: true
    })
    var jumpType = e.currentTarget.dataset.jumptype;
    var storeId = e.currentTarget.id;
    console.log(jumpType);
    if (jumpType == 2) {
      wx.navigateTo({
        url: '/pages/store/index?storeId=' + storeId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/store/glspecial/glspecial?storeId=' + storeId,
      })
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },

})
