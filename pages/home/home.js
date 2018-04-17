
var app = getApp();
var amapFile = require('../../utils/amap-wx.js');
var appUtil = require('../../utils/appUtil.js');
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    icon: {
      ms: "../../image/index/ms.png",
      cs: "../../image/index/cs.png",
      mz: "../../image/index/mz.png",
      bh: "../../image/index/bh.png",
      fs: "../../image/index/fs.png",
      my: "../../image/index/my.png",
      jd: "../../image/index/jd.png",
      hc: "../../image/index/hc.png",
      jj: "../../image/index/jj.png",
      fl: "../../image/index/fl.png",
    },
    
    homeData: {},
    dot: false,
    lazyLoad:true
  },
  checkProduct: function (e) {
    if (!appUtil.lrhMethods.checkPageState()){
      return ;
    }
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/goodsdetail?goodId=' + id,
    })
  },
  checkStore: function (e) {
    if (!appUtil.lrhMethods.checkPageState()) {
      return;
    }
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
  checkTheme: function (e) {
    console.log(e.currentTarget.dataset.theme.themeType);
    var theme = e.currentTarget.dataset.theme;
    var banner = e.currentTarget.id;
    var themeType = theme.themeType;
    if (themeType == 1 || themeType == 2) {//跳web
      wx.navigateTo({
        url: './themepage/themepage?banner=' + banner + '&themeId=' + theme.themeId + '&isStoreType=0',
      })
    } else if (themeType == 3) {//跳店铺
      wx.navigateTo({
        url: './themepage/themepage?banner=' + banner + '&themeId=' + theme.themeId + '&isStoreType=1',
      })

    }

  },
  checkGoodClass: function (e) {
    console.log("查看分类");
    console.log(e);
    var classId = e.currentTarget.id;
    var catName = e.currentTarget.dataset.catname;
    if (classId == 0) {
      wx.navigateTo({ 
        url: './moreclass/moreclass',
      })
      return;
    }
    wx.navigateTo({
      url: './secondclass/secondclass?classId=' + classId + '&catName=' + catName,
    })
  },
  toSearch: function () {
    wx.navigateTo({
      url: './search/search',
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  setGoodsClassList: function (homeData) {
    var listLen = homeData.goodsClassList.length;
    var listNoSplice = homeData.goodsClassList;
    //listNoSplice.push(homeData.goodsClassBtn);
    wx.setStorageSync("allClass", listNoSplice);
    var listHaveSplice = homeData.goodsClassList.splice(0, listLen - 2);
    homeData.goodsClassList = listHaveSplice;
    homeData.goodsClassList.push(homeData.goodsClassBtn);
    var goodsClassList = homeData.goodsClassList;
    var labLen = goodsClassList.length;
    var arrsSize = Math.ceil(labLen / 5);
    console.log("数组大小：" + arrsSize);
    var arrs = [];//二位数组，存放标签，里面每个一位数组大小为5
    if (arrsSize != 0) {
      for (var i = 0; i < goodsClassList.length; i = i + 5) {
        var arr = [];//一行标签
        for (var j = 0; j < 5; j++) {//一行标签放五个标签
          arr.push(goodsClassList[i + j]);
        }
        arrs.push(arr);
      }
    }
    this.setData({ arrs: arrs });
  },
  setThemeList: function (homeData) {
    this.setData({ themeList: homeData.themeList });
  },
  setStoreList: function (homeData) {
    this.setData({ storeList: homeData.storeList });
  },
  transDataFromServer: function (homeData) {
    //this.setData({ homeData: homeData });
    this.setData({ activityList: homeData.activityList });
    this.setGoodsClassList(homeData);

    this.setThemeList(homeData);

    this.setStoreList(homeData);
  },
  checkImg: function (e) {
    console.log(e);
    var url = e.target.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  },
  initData: function () {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getHomeData,
      data: {
        "pageIndex": 1,
        "longitude": that.data.longitude,
        "latitude": that.data.latitude,
        "areaCode": that.data.areaCode,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("初始化数据返回");
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

  onLoad: function (options) {
    
    // wx.setTabBarBadge({
    //   index: 1,
    //   text: '1'
    // })
    //判断版本是否审核通过
    // appUtil.controllerUtil.isPassCode(function (data) {
    //   console.info("isPassCode:" + data.data.data);
    //   if (data.data.succeeded) {
    //     wx.reLaunch({
    //       url: data.data.data
    //     })
    //   }
    // }, function (data) { },
    //   function (data) { })
    wx.showLoading({
      title: '加载中',
    })
    //高德地图key
    var myAmapFun = new amapFile.AMapWX({
      key: 'd0063cd5d8e04b14dfe98eae69dc9617'
    });
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        console.log("获取的位置信息1");
        console.log(data);
        // var areaCode = "440114";
        // var latitude = "23.12911";
        // var longitude = "113.264385";
        var areaCode = data[0].regeocodeData.addressComponent.adcode;
        var latitude = data["0"].latitude;
        var longitude = data["0"].longitude;
        var addrName = data["0"].desc;
        wx.setStorageSync("latitude", latitude);
        wx.setStorageSync("longitude", longitude);
        wx.setStorageSync("areaCode", areaCode);
        var pois = data["0"].regeocodeData.pois;
        for (var i in pois) {
          pois[i].adcode = areaCode;
        }
        wx.setStorageSync("poi", pois);

        that.setData({ areaCode: areaCode, addrName: addrName, longitude: longitude, latitude: latitude });
        //成功回调
        that.initData();
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
  onReady: function () {

  },
  onShowInitData: function () {
    
    wx.removeStorageSync("storeIndex");
    wx.removeStorageSync("nowCheckStroreId");
    wx.removeStorageSync("storageGoods");
    wx.removeStorageSync("newCheckStoreData");
    wx.removeStorageSync("newCheckStoreCat");
    this.setData({ storeList: [], themeList: [] });
  },
  chooseAddr: function () {
    // console.info("11111")
    // wx.chooseLocation({
    //   success: function (res) {
    //     console.log(res);
    //   },
    // })
    wx.setStorageSync("changeAddFlag", true);
    wx.navigateTo({
      url: '/pages/home/chooseAddr/chooseAddr',
    })
  },
  onShow: function () {
    appUtil.lrhMethods.initPageState();
    //判断版本是否审核通过
    // appUtil.controllerUtil.isPassCode(function (data) {
    //   console.info("isPassCode:",data);
    //   if (data.data.succeeded) {
    //     wx.reLaunch({
    //       url: data.data.data
    //     })
    //   }
    // }, function (data) { },
    //   function (data) { })
    var addr = wx.getStorageSync("addrLRH");
    var changeAddFlag = wx.getStorageSync("changeAddFlag");
    if (addr != "" && changeAddFlag != "") {
      wx.removeStorageSync("changeAddFlag");
      this.onShowInitData();
      // var latitude = "23.12911";
      // var longitude = "113.264385";
      var locs = addr.location.split(",");
      wx.setStorageSync("longitude", locs[0]);
      wx.setStorageSync("latitude", locs[1]);
      wx.setStorageSync("areaCode", addr.adcode);
      this.setData({ addrName: addr.name, longitude: locs[0], latitude: locs[1], areaCode: addr.adcode });
      this.initData();
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPageScroll: function (res) {
    // console.log("滚动参数");
    // console.log(res);
  },
  onPullDownRefresh: function () {
    
    this.initData();
  },
  addStoreList: function (homeData) {
    var storeList = this.data.storeList;
    if (homeData.storeList.length == 0) {
      wx.showToast({
        title: '没有更多啦',
        icon: "loading",
        duration: 1000,
      })
      return;
    }
    for (var i = 0; i < homeData.storeList.length; i++) {
      var storeListTmp = homeData.storeList[i];
      storeList.push(storeListTmp);
    }
    this.setData({ storeList: storeList });
  },
  getMoreStore: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var storeIndex = wx.getStorageSync("storeIndex");
    if (storeIndex == '') {
      storeIndex = 2;
      wx.setStorageSync("storeIndex", storeIndex);
    } else {
      storeIndex = storeIndex + 1;
      wx.setStorageSync("storeIndex", storeIndex);
    }
    wx.request({
      url: appUtil.ajaxUrls().getHomeData,
      //url: app.globalData.requestUrl + 'selectShopncStoreByCommendVersion2', //仅为示例，并非真实的接口地址
      data: {
        "pageIndex": storeIndex,
        "longitude": that.data.longitude,
        "latitude": that.data.latitude,
        "areaCode": that.data.areaCode,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("下拉请求店铺数据返回" + storeIndex);
        console.log(res);
        console.log(res.data.data)
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.message.type == "success") {
          that.addStoreList(res.data.data);
        }
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
  onReachBottom: function () {

    this.getMoreStore();
  },
  // onShareAppMessage:function(){
  //   return {
  //     title: '小龟快跑',
  //     path: '/pages/home/home'
  //   }
  // }
})