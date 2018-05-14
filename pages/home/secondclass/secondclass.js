var appUtil = require('../../../utils/appUtil.js');
var app = getApp();
Page({
  data: {
    fixStyle: false,
    imgs:[],
    storeList:[]
  },
  //查看二级分类
  checkSecondClass:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/home/search/imgstoresresult/imgstoresresult?classId=' + id,
    })
  },
  //查看商品详情
  checkProduct: function (e) {
    if (!appUtil.lrhMethods.checkPageState()) {
      return;
    }
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/goodsdetail?goodId=' + id,
    })
  },
  //查看店铺详情
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
  //查询分类里面的产品
  checkClassGoods:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/home/search/resultforgood/resultforgood?classId='+id,
    })
  },
  //处理从服务器返回的数据
  transDataFromServer: function (data, secondClassIndex){
    console.log(secondClassIndex + "标记--------" + isNaN(secondClassIndex));

    console.log(data);
    if (secondClassIndex==1){
      var imgs = [data.labelList[0], data.labelList[1], data.labelList[2], data.labelList[3], data.labelList[4]];
      this.setData({
        imgs: imgs, activityList: data.activityList, goodsClassList: data.goodsClassList,
        themeList: data.themeList, more: data.goodsClassBtn, storeList: data.storeList
      });
    }else{
      var storeList = this.data.storeList;
      for (var i in data.storeList){
        storeList.push(data.storeList[i]);
      }
      this.setData({ storeList: storeList});
    }
    wx.hideLoading();
  },
  //获取类里面的内容
  getClassContent: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    var secondClassIndex = wx.getStorageSync("secondClassIndex");
    console.log("拿到的index:" + secondClassIndex);
    if (secondClassIndex == '') {
      secondClassIndex = 1;
      console.log("执行1");
      wx.setStorageSync("secondClassIndex", secondClassIndex);
    } else {
      secondClassIndex = 1 + parseInt(secondClassIndex);
      wx.setStorageSync("secondClassIndex", secondClassIndex);
      console.log("执行2");
    }

    var latitude = wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude");
    var areaCode = wx.getStorageSync("areaCode");
    wx.request({
      url: appUtil.ajaxUrls().getClassContent, //
      data: {
        "longitude": longitude,
        "latitude": latitude,
        "pageIndex": secondClassIndex,
        "areaCode": areaCode,
        "gcId": that.data.classId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到类型内容" + secondClassIndex);
        console.log(res)
        if (res.data.message.type == "success") {
          that.transDataFromServer(res.data.data, secondClassIndex);
        }
        
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  //点击更多
  moreClass: function () {
    var classId = this.data.classId;
    wx.navigateTo({
      url: '../moreclass/moreclass?classId=' + classId,
    })
  },

  onLoad: function (options) {
    var classId = options.classId;
    var catName = options.catName;
    wx.setNavigationBarTitle({
      title: catName,
    })
    //var classId = "3603";
    this.setData({ classId: classId});
    app.clearMySelfStorage();
    this.getClassContent();
  },
  onReady: function () {

  },
  onShow: function () {
    appUtil.lrhMethods.initPageState();
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    this.getClassContent();
  },
  onPageScroll: function (res) {
    // console.log("滚动参数");
    // console.log(res);
    if (res.scrollTop > 175) {
      this.setData({ fixStyle: true });
    } else {
      this.setData({ fixStyle: false });
    }

  },
})