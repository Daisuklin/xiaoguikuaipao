var appUtil = require('../../../../utils/appUtil.js');
Page({
  data: {
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    allOrderHidden: true,

    allOrderHiddenIndex: -1,//综合排序里面的子选项选择
    discountHiddenIndex: -1,//优惠活动子选项的选择

    discounts: ["天天特价", "全场包邮", "首单优惠", "买满就减"],
    tab: [{
      id: 0,
      tabname: "综合排序",
    }, {
      id: 1,
      tabname: "销量最高",
    }, {
      id: 2,
      tabname: "距离最近",
    }, {
      id: 3,
      tabname: "筛选",
    }],
    fixStyle: true,

    isPackageMall: false,//包邮
    isFirstOrder: false,//首单优惠
    istejia: false,//特价
    isMansong: false,//买满就减
    store_sales: false,//销量
    distance_sort: true,//综合排序其实就是距离

    allOrderList: [],
    distanceList: [],
    salesList: [],
    filterList: []
  },
  searchTap: function () {
    this.clearMyParam();
    this.setData({ distanceList: [], salesList: [], filterList: []});
    this.getBydistance();
  },
  setKeyWord: function (e) {
    var value = e.detail.value;
    this.setData({ keyword: value });
  },
  checkStore: function (e) {
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
  onLoad: function (options) {
    var that = this;
    this.clearMyParam();
    var keyword = options.keyword;
    if(options.classId==undefined){
      this.setData({classId:0});
    }else{
      this.setData({ classId: options.classId});
    }
    var latitude = wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude");
    var areaCode = wx.getStorageSync("areaCode");
    //var keyword = "美食";
    this.setData({ 
      keyword: keyword, longitude: longitude, latitude: latitude, areaCode: areaCode,
      distanceList: [],
      salesList: [],
      filterList: [] });
    this.getByAllOrder();
  },
  clearMyParam:function(){
    wx.removeStorageSync("distanceIndex");
    wx.removeStorageSync("salesIndex");
    wx.removeStorageSync("filterIndex");
    wx.removeStorageSync("allOrderIndex");
  },
  checkProduct: function (e) {
    var id = e.currentTarget.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/detail/goodsdetail?goodId=' + id,
    })
  },
  chooseTar: function (e) {
    console.log(e.currentTarget.id);
    if (e.currentTarget.id == 0 && this.data.activeIndex == 0) {//当重复点击时候
      this.setData({ activeIndex:0, allOrderHidden: true });
    } else if (e.currentTarget.id == 1) {
      this.setData({
        activeIndex: e.currentTarget.id,
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        store_sales: true,//销量
        distance_sort: false,//综合排序其实就是距离
      });
      if (this.data.salesList.length == 0) {
        this.getBySales();
      } else {
        var storeList = this.data.salesList;
        this.setData({ storeList: storeList });
      }
    } else if (e.currentTarget.id == 2) {
      this.setData({
        activeIndex: e.currentTarget.id,
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        store_sales: false,//销量
        distance_sort: true,//综合排序其实就是距离
      });
      if (this.data.distanceList.length == 0) {
        this.getBydistance();
      } else {
        var storeList = this.data.distanceList;
        this.setData({ storeList: storeList });
      }
    } else if (e.currentTarget.id == 3 && this.data.activeIndex == 3) {
      this.setData({ activeIndex: -1 });
    } else {
      this.setData({ activeIndex: e.currentTarget.id, });
    }
  },
  getByAllOrder:function(){
    wx.showLoading({
      title: '加载中',
    })
    var allOrderIndex = wx.getStorageSync("allOrderIndex");
    if (allOrderIndex == '') {
      allOrderIndex = 1;
      wx.setStorageSync("allOrderIndex", allOrderIndex);
    } else {
      allOrderIndex = 1 + parseInt(allOrderIndex);
      wx.setStorageSync("allOrderIndex", allOrderIndex);
    }
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSearchList,
      data: {
        "sc_id": that.data.classId,
        "keyWord": that.data.keyword,
        "packageMall": that.data.isPackageMall,//包邮
        "firstOrder": that.data.isFirstOrder,//首单优惠
        "tejia": that.data.istejia,//特价
        "mansong": that.data.isMansong,//买满就减
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
        "pageIndex": allOrderIndex,
        "areaCode": that.data.areaCode,//"440114"
        "sequence": 0,//0综合排序，1销量排序，2距离排序
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("按距离返回" + allOrderIndex);
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var storeList = that.data.allOrderList;
          for (var i in list) {
            storeList.push(list[i]);
          }
          that.setData({ storeList: storeList });
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按距离返回" + appUtil.ajaxUrls().getSearchList);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getBydistance: function () {
    wx.showLoading({
      title: '加载中',
    })
    var distanceIndex = wx.getStorageSync("distanceIndex");
    if (distanceIndex == '') {
      distanceIndex = 1;
      wx.setStorageSync("distanceIndex", distanceIndex);
    } else {
      distanceIndex = 1 + parseInt(distanceIndex);
      wx.setStorageSync("distanceIndex", distanceIndex);
    }
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSearchList,
      data: {
        "sc_id": that.data.classId,
        "keyWord": that.data.keyword,
        "packageMall": that.data.isPackageMall,//包邮
        "firstOrder": that.data.isFirstOrder,//首单优惠
        "tejia": that.data.istejia,//特价
        "mansong": that.data.isMansong,//买满就减
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
        "pageIndex": distanceIndex,
        "areaCode": that.data.areaCode,//"440114"
        "sequence": 2,//0综合排序，1销量排序，2距离排序
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("按距离返回" + distanceIndex);
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var storeList = that.data.distanceList;
          for (var i in list) {
            storeList.push(list[i]);
          }
          that.setData({ storeList: storeList });
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按距离返回" + appUtil.ajaxUrls().getSearchList);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getBySales: function () {
    wx.showLoading({
      title: '加载中',
    })
    var salesIndex = wx.getStorageSync("salesIndex");
    if (salesIndex == '') {
      salesIndex = 1;
      wx.setStorageSync("salesIndex", salesIndex);
    } else {
      salesIndex = 1 + parseInt(salesIndex);
      wx.setStorageSync("salesIndex", salesIndex);
    }
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSearchList,
      data: {
        "sc_id": that.data.classId,
        "keyWord": that.data.keyword,
        "packageMall": that.data.isPackageMall,//包邮
        "firstOrder": that.data.isFirstOrder,//首单优惠
        "tejia": that.data.istejia,//特价
        "mansong": that.data.isMansong,//买满就减
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
        "pageIndex": salesIndex,
        "areaCode": that.data.areaCode,//"440114"
        "sequence": 1,//0综合排序，1销量排序，2距离排序
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("按销量返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var storeList = that.data.salesList;
          for (var i in list) {
            storeList.push(list[i]);
          }
          that.setData({ storeList: storeList });
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按销量返回" + appUtil.ajaxUrls().getSearchList);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getByFiter: function () {
    wx.showLoading({
      title: '加载中',
    })
    var filterIndex = wx.getStorageSync("filterIndex");
    if (filterIndex == '') {
      filterIndex = 1;
      wx.setStorageSync("filterIndex", filterIndex);
    } else {
      filterIndex = 1 + parseInt(filterIndex);
      wx.setStorageSync("filterIndex", filterIndex);
    }
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSearchList,
      data: {
        "sc_id": that.data.classId,
        "keyWord": that.data.keyword,
        "packageMall": that.data.isPackageMall,//包邮
        "firstOrder": that.data.isFirstOrder,//首单优惠
        "tejia": that.data.istejia,//特价
        "mansong": that.data.isMansong,//买满就减
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
        "pageIndex": filterIndex,
        "areaCode": that.data.areaCode,//"440114"
        "sequence": 0,//0综合排序，1销量排序，2距离排序
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("筛选返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var storeList = that.data.filterList;
          for (var i in list) {
            storeList.push(list[i]);
          }
          that.setData({ storeList: storeList });
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按销量返回" + appUtil.ajaxUrls().getSearchList);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  //设置综合排序里面的选择
  setallOrderHiddenIndex: function (e) {
    var id = e.currentTarget.id;
    this.setData({ allOrderHiddenIndex: id });
    if (id == 0) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        store_sales: false,//销量
        distance_sort: true,//综合排序其实就是距离
      });
      if (this.data.distanceList.length == 0) {
        this.getBydistance();
      } else {
        var storeList = this.data.distanceList;
        this.setData({ storeList: storeList });
      }
    } else if (id == 1) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        store_sales: true,//销量
        distance_sort: false,//综合排序其实就是距离
      });
      if (this.data.salesList.length == 0) {
        this.getBySales();
      } else {
        var storeList = this.data.salesList;
        this.setData({ storeList: storeList });
      }
    } else if (id == 2) {
      if (this.data.distanceList.length == 0) {
        this.getBydistance();
      } else {
        var storeList = this.data.distanceList;
        this.setData({ storeList: storeList });
      }
    }
  },
  //筛选里面的东西
  chooseDiscount: function (e) {
    //console.log(e);
    var id = e.currentTarget.id;
    this.setData({ discountHiddenIndex: id, filterList: [] });
    this.setFilterParam(id);
  },
  finishFilter: function () {
    if (this.data.discountHiddenIndex == -1) {
      wx.showToast({
        title: '请选择筛选条件',
        icon: "loading",
        duration: 1000,
      })
      return;
    }
    this.setData({ activeIndex: -1, discountHiddenIndex: -1 });
    wx.setStorageSync("filterIndex", '');
    this.getByFiter();
  },
  setFilterParam: function (id) {
    if (id == 0) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: true,//特价
        isMansong: false,//买满就减
        store_sales: false,//销量
        distance_sort: false,//综合排序其实就是距离
      });
    } else if (id == 1) {
      this.setData({
        isPackageMall: true,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        store_sales: false,//销量
        distance_sort: false,//综合排序其实就是距离
      });
    } else if (id == 2) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: true,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        store_sales: false,//销量
        distance_sort: false,//综合排序其实就是距离
      });
    } else if (id == 3) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: true,//买满就减
        store_sales: false,//销量
        distance_sort: false,//综合排序其实就是距离
      });
    }
  },
  clearChoices: function () {
    this.setData({ discountHiddenIndex: -1 });
  },

  onReady: function () {

  },
  onShow: function () {
    //this.clearMyParam();
  },
  onHide: function () {
    // this.clearMyParam();
  },
  onUnload: function () {
    // this.clearMyParam();
  },
  onReachBottom: function () {
    var activeIndex = this.data.activeIndex;
    if (activeIndex == 0 || activeIndex == -1) {
      this.getBydistance();
    } else if (activeIndex == 1) {
      this.getBySales();
    } else if (activeIndex == 2) {
      this.getBydistance();
    } else if (activeIndex == 3) {
      this.getByFiter();
    }
  },
})