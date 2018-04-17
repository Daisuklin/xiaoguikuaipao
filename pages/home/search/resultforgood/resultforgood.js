var appUtil = require('../../../../utils/appUtil.js');
Page({
  data: {
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
    activeIndex: -1,
    fixStyle: true,

    isPackageMall: false,//包邮
    isFirstOrder: false,//首单优惠
    istejia: false,//特价
    isMansong: false,//买满就减
    distance_sort: true,//综合排序其实就是距离
    "goods_salenum": false,
    "goods_price": false,
    lowerTmp: 0,
    heighterTmp: 0,

    distanceList: [],
    salesList: [],
    filterList: [],
    priceList:[],

  },
  searchTap:function(){
    this.clearMyParam();
    this.setData({distanceList: [],salesList: [],filterList: [],priceList: [],goodsList:[]});
    this.getByDistanceGood();
  },
  setKeyWord:function(e){
    var value = e.detail.value;
    this.setData({ keyword:value});
  },
  onReachBottom: function () {
    var activeIndex = this.data.activeIndex;
   
    if (activeIndex == 0 || activeIndex == -1) {
      var allOrderHiddenIndex = this.data.allOrderHiddenIndex;
      if (activeIndex == -1 && allOrderHiddenIndex==-1){
        this.getByDistanceGood();
      } else if (activeIndex == -1 && allOrderHiddenIndex==2){
        this.getByPriceGood();
      }
      
    } else if (activeIndex == 1) {
      this.getBySalesGood();
    } else if (activeIndex == 2) {
      this.getByDistanceGood();
    } else if (activeIndex == 3) {
      this.getByFilterGood();
    }
  },

  setPrice:function(e){
    console.log(e);
    var value = e.detail.value;
    var flag = e.currentTarget.dataset.my;
    if (flag=="lower"){
      this.setData({lowerTmp:value});
    }else{
      this.setData({ heighterTmp: value });
    }
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
    this.setData({ activeIndex: -1, discountHiddenIndex: -1});
    this.getByFilterGood();
  },
  getByDistanceGood: function () {
    wx.showLoading({
      title: '加载中',
    })
    var distanceIndex = wx.getStorageSync("distanceIndex");
    console.info("拿到的分页数",distanceIndex);
    if (distanceIndex == '') {
      distanceIndex = 1;
      wx.setStorageSync("distanceIndex", distanceIndex);
      console.info("设置完", wx.getStorageSync("distanceIndex"));
    } else {
      distanceIndex = 1 + parseInt(distanceIndex);
      wx.setStorageSync("distanceIndex", distanceIndex);
    }
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSearchGood,
      data: {
        "isPackageMall": that.data.isPackageMall,//包邮
        "isFirstOrder": that.data.isFirstOrder,//首单优惠
        "istejia": that.data.istejia,//特价
        "isMansong": that.data.isMansong,//买满就减
        "goods_salenum": that.data.goods_salenum,
        "goods_price": that.data.goods_price,
        "goods_name": that.data.keyword,
        "gc_id": that.data.classId,
        "distance_sort": that.data.distance_sort,//综合排序其实就是距离
         priceEnd: 0,
         priceStare: 0,
        "pageIndex": distanceIndex,
        "areaCode": that.data.areaCode,//"440114"
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("按距离返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var goodsList = that.data.distanceList;
          for (var i in list) {
            goodsList.push(list[i]);
          }
          that.setData({ goodsList: goodsList });
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按距离返回" + appUtil.ajaxUrls().getSearchGood);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getBySalesGood: function () {
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
      url: appUtil.ajaxUrls().getSearchGood,
      data: {
        "isPackageMall": that.data.isPackageMall,//包邮
        "isFirstOrder": that.data.isFirstOrder,//首单优惠
        "istejia": that.data.istejia,//特价
        "isMansong": that.data.isMansong,//买满就减
        "goods_salenum": that.data.goods_salenum,
        "goods_price": that.data.goods_price,
        "goods_name": that.data.keyword,
        "gc_id": that.data.classId,
        "distance_sort": that.data.distance_sort,//综合排序其实就是距离
        priceEnd: 0,
        priceStare: 0,
        "pageIndex": salesIndex,
        "areaCode": that.data.areaCode,//"440114"
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("按距离返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var goodsList = that.data.salesList;
          for (var i in list) {
            goodsList.push(list[i]);
          }
          that.setData({ goodsList: goodsList});
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按距离返回" + appUtil.ajaxUrls().getSearchGood);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getByPriceGood: function () {
    wx.showLoading({
      title: '加载中',
    })
    var priceIndex= wx.getStorageSync("priceIndex");
    if (priceIndex == '') {
      priceIndex = 1;
      wx.setStorageSync("priceIndex", priceIndex);
    } else {
      priceIndex = 1 + parseInt(priceIndex);
      wx.setStorageSync("priceIndex", priceIndex);
    }
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSearchGood,
      data: {
        "isPackageMall": that.data.isPackageMall,//包邮
        "isFirstOrder": that.data.isFirstOrder,//首单优惠
        "istejia": that.data.istejia,//特价
        "isMansong": that.data.isMansong,//买满就减
        "goods_salenum": that.data.goods_salenum,
        "goods_price": that.data.goods_price,
        "goods_name": that.data.keyword,
        "gc_id": that.data.classId,
        "distance_sort": that.data.distance_sort,//综合排序其实就是距离
        priceEnd: 0,
        priceStare: 0,
        "pageIndex": priceIndex,
        "areaCode": that.data.areaCode,//"440114"
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("按距离返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var goodsList = that.data.priceList;
          for (var i in list) {
            goodsList.push(list[i]);
          }
          that.setData({ goodsList: goodsList });
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按距离返回" + appUtil.ajaxUrls().getSearchGood);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  getByFilterGood: function () {
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
      url: appUtil.ajaxUrls().getSearchGood,
      data: {
        "isPackageMall": that.data.isPackageMall,//包邮
        "isFirstOrder": that.data.isFirstOrder,//首单优惠
        "istejia": that.data.istejia,//特价
        "isMansong": that.data.isMansong,//买满就减
        "goods_salenum": that.data.goods_salenum,
        "goods_price": that.data.goods_price,
        "goods_name": that.data.keyword,
        "gc_id": that.data.classId,
        "distance_sort": that.data.distance_sort,//综合排序其实就是距离
        priceEnd: that.data.heighterTmp,
        priceStare: that.data.lowerTmp,
        "pageIndex": filterIndex,
        "areaCode": that.data.areaCode,//"440114"
        "longitude": that.data.longitude,//113.226013 ,
        "latitude": that.data.latitude,//23.388246,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("按距离返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var list = res.data.data;
          var goodsList = that.data.filterList;
          for (var i in list) {
            goodsList.push(list[i]);
          }
          that.setData({goodsList: goodsList,lowerTmp: 0,heighterTmp: 0});
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("按距离返回" + appUtil.ajaxUrls().getSearchGood);
        console.log(res);
        wx.hideLoading();
        that.setData({ lowerTmp: 0, heighterTmp: 0 });
        wx.stopPullDownRefresh();
      }
    })
  },
  onLoad: function (options) {
    this.clearMyParam();
    var that = this;
    if (options.classId == undefined) {
      this.setData({ classId: 0 });
    } else {
      this.setData({ classId: options.classId });
    }
    var latitude = wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude");
    var areaCode = wx.getStorageSync("areaCode");
    //var keyword = "美食";
    this.setData({ keyword: '', longitude: longitude, latitude: latitude, areaCode: areaCode });
    this.getByDistanceGood();
  },
  clearMyParam: function () {
    wx.removeStorageSync("distanceIndex");
    wx.removeStorageSync("salesIndex");
    wx.removeStorageSync("filterIndex");
    wx.removeStorageSync("priceIndex");
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
      this.setData({ activeIndex: -1, allOrderHidden: true });
    } else if (e.currentTarget.id == 1) {
      this.setData({
        activeIndex: e.currentTarget.id,
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        distance_sort: false,//综合排序其实就是距离
        goods_salenum: true,
        goods_price: false,
      });
      if (this.data.salesList.length == 0) {
        this.getBySalesGood();
      } else {
        var goodsList = this.data.salesList;
        this.setData({ goodsList: goodsList });
      }
    } else if (e.currentTarget.id == 2) {
      this.setData({
        activeIndex: e.currentTarget.id,
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        distance_sort: true,//综合排序其实就是距离
        goods_salenum: false,
        goods_price: false,
      });
      if (this.data.distanceList.length == 0) {
        this.getByDistanceGood();
      } else {
        var goodsList = this.data.distanceList;
        this.setData({ goodsList: goodsList });
      }
    } else if (e.currentTarget.id == 3 && this.data.activeIndex == 3) {
      this.setData({ activeIndex: -1 });
    } else {
      this.setData({ activeIndex: e.currentTarget.id, });
    }
  },
  //设置综合排序里面的选择
  setallOrderHiddenIndex: function (e) {
    var id = e.currentTarget.id;
    this.setData({ allOrderHiddenIndex: id });
    if (id == 0) {
      this.setData({
        activeIndex: 2,
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        distance_sort: true,//综合排序其实就是距离
        goods_salenum: false,
        goods_price: false,
      });
      if (this.data.distanceList.length == 0) {
        this.getByDistanceGood();
      } else {
        var goodsList = this.data.distanceList;
        this.setData({ goodsList: goodsList });
      }
    } else if (id == 1) {
      this.setData({
        activeIndex: 1,
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        distance_sort: false,//综合排序其实就是距离
        goods_salenum: true,
        goods_price: false,
      });
      if (this.data.salesList.length == 0) {
        this.getBySalesGood();
      } else {
        var goodsList = this.data.salesList;
        this.setData({ goodsList: goodsList });
      }
    } else if (id == 2) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        distance_sort: false,//综合排序其实就是距离
        goods_salenum: false,
        goods_price: true,
      });
      if (this.data.priceList.length == 0) {
        this.getByPriceGood();
      } else {
        var goodsList = this.data.priceList;
        this.setData({ goodsList: goodsList });
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

  setFilterParam: function (id) {
    if (id == 0) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia:true,//特价
        isMansong: false,//买满就减
        distance_sort:false,//综合排序其实就是距离
        "goods_salenum": false,
        "goods_price": false,
      });
    } else if (id == 1) {
      this.setData({
        isPackageMall: true,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        distance_sort: false,//综合排序其实就是距离
        "goods_salenum": false,
        "goods_price": false,
      });
    } else if (id == 2) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: true,//首单优惠
        istejia: false,//特价
        isMansong: false,//买满就减
        distance_sort: false,//综合排序其实就是距离
        "goods_salenum": false,
        "goods_price": false,
      });
    } else if (id == 3) {
      this.setData({
        isPackageMall: false,//包邮
        isFirstOrder: false,//首单优惠
        istejia: false,//特价
        isMansong: true,//买满就减
        distance_sort: false,//综合排序其实就是距离
        "goods_salenum": false,
        "goods_price": false,
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
    this.clearMyParam();
  },
  onUnload: function () {
    this.clearMyParam();
  },
  
})