var appUtil = require('../../utils/appUtil.js');
var app = getApp();
Page({
  data: {
    tab: [{
      id: 0,
      tabname: "店铺首页",
    }, {
      id: 1,
      tabname: "全部商品",
    }, {
      id: 2,
      tabname: "新品上架",
    }, {
      id: 3,
      tabname: "动态生活",
    }],
    selectIndex: 0,
    store_show_type: 2,
    pictures: ['https://p0.meituan.net/movie/ea4ac75173a8273f3956e514a4c78018253143.jpeg',
      'https://p0.meituan.net/movie/5d4fa35c6d1215b5689257307c461dd2541448.jpeg',
      'https://p0.meituan.net/movie/0c49f98a93881b65b58c349eed219dba290900.jpg',
      'https://p0.meituan.net/movie/ea4ac75173a8273f3956e514a4c78018253143.jpeg',
      'https://p0.meituan.net/movie/5d4fa35c6d1215b5689257307c461dd2541448.jpeg',
      'https://p0.meituan.net/movie/0c49f98a93881b65b58c349eed219dba290900.jpg'
    ],//原来动态生活图片测试数据，以后可以删

    focusonFlag: false,

    allgoods: [],//全部商品
    newGoods: [],//新品上架
    actLifes: [],//动态生活

    specialList: [],
    goodsList: [],
    fixStyle: false,
    allGoodPullHidden: false,//标记是否加载完
    newGoodsHidden: false,//标记是否加载完

    allGoodsLen: 0,
    newGoodsLen: 0,

    stars: [],
    haveCheckProduct: false,
    isPrompt: false,
    defaultUrl: 'api.xiaoguikuaipao.com',//关键url字段

    indicatorDots: false,
    autoplay: false,
    circular: true,
    duration: 200,
    shareChoiceHidden:true,
  },
  toShare:function(){
    console.log("点击了");
    this.setData({ shareChoiceHidden:false});
  },
  shareChoice:function(){
    this.setData({ shareChoiceHidden: true });
  },
  setRaise: function (e) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    console.log(e);
    var id = e.currentTarget.id;
    var actLifes = this.data.actLifes;
    for (var i in actLifes) {
      if (actLifes[i].geval_id == id) {
        if (actLifes[i].thumbUp == 0) {
          actLifes[i].thumbUp = 1
        } else {
          actLifes[i].thumbUp = 0
        }
        break;
      }
    }
    this.setData({ actLifes: actLifes });
    var that = this;
    var storeId = this.data.storeId;
    var memberId = this.data.memberId;
    wx.request({
      url: appUtil.ajaxUrls().setRaise, //
      //url:'http://112.74.28.99:8080/api/v1/shopMc/updateThumbUp',
      data: {
        geval_id: parseInt(id),
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'shopMcAuthorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("点赞返回");
        console.log(res)
        if (res.data.message.type == "success") {

        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
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
  //设置商品的收藏状态
  setGoodCollectNewGood: function (e) {
    console.log("设置商品收藏状态");
    var id = e.currentTarget.id;
    var newGoods = this.data.newGoods;
    for (var i in newGoods) {
      if (newGoods[i].goods_id == id) {
        newGoods[i].collect = !newGoods[i].collect;
        //newGoods[i].isTapCollected = false;
        this.collectGood(newGoods[i].goods_id, newGoods[i].collect);
        break;
      }

    }
    this.setData({ newGoods: newGoods });
  },
  //取消灰蒙层
  cancelMaskNewGood: function (e) {
    console.log("取消灰蒙");

    var id = e.currentTarget.id;
    var newGoods = this.data.newGoods;
    for (var i in newGoods) {
      if (newGoods[i].goods_id == id) {
        newGoods[i].isTapCollected = false;
        break;
      }

    }
    this.setData({ newGoods: newGoods });
  },
  //查看商品是否收藏，一级弹出蒙层
  checkCellectGoodNewGood: function (e) {

    var id = e.currentTarget.id;
    var newGoods = this.data.newGoods;
    for (var i in newGoods) {
      if (newGoods[i].goods_id == id) {
        newGoods[i].isTapCollected = true;
      } else {
        newGoods[i].isTapCollected = false;
      }

    }
    this.setData({ newGoods: newGoods });
  },
  //设置商品的收藏状态
  setGoodCollect: function (e) {
    console.log("设置商品收藏状态");
    var id = e.currentTarget.id;
    var allgoods = this.data.allgoods;
    for (var i in allgoods) {
      if (allgoods[i].goods_id == id) {
        allgoods[i].collect = !allgoods[i].collect;
        //allgoods[i].isTapCollected = false;
        this.collectGood(allgoods[i].goods_id, allgoods[i].collect);
        break;
      }
    }
    this.setData({ allgoods: allgoods });
  },
  //取消灰蒙层
  cancelMask: function (e) {
    console.log("取消灰蒙");

    var id = e.currentTarget.id;
    var allgoods = this.data.allgoods;
    for (var i in allgoods) {
      if (allgoods[i].goods_id == id) {
        allgoods[i].isTapCollected = false;
        break;
      }

    }
    this.setData({ allgoods: allgoods });
  },
  //查看商品是否收藏，一级弹出蒙层
  checkCellectGood: function (e) {

    var id = e.currentTarget.id;
    var allgoods = this.data.allgoods;
    for (var i in allgoods) {
      if (allgoods[i].goods_id == id) {
        allgoods[i].isTapCollected = true;
      } else {
        allgoods[i].isTapCollected = false;
      }

    }
    this.setData({ allgoods: allgoods });
  },
  //收藏商品
  collectGood: function (goodId, isFavorites) {
    var that = this;
    var storeId = this.data.storeId;
    var memberId = this.data.memberId;
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
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

        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
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


  //关注或者取消关注店铺
  focusStore: function (e) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var that = this;
    console.log(e);
    var flag = e.currentTarget.dataset.my;
    flag = !flag;
    this.setData({ focusonFlag: flag });
    var liveMemberId = this.data.liveMemberId;
    wx.request({
      url: appUtil.ajaxUrls().focusStore, //
      data: {
        memberId: that.data.memberId,
        liveMemberId: liveMemberId,//店铺memberId
        focusonState: flag,//关注或者取消
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("关注店铺返回");
        console.log(res)
        if (res.data.message.type == "success") {

        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
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


  checkActLife: function (e) {
    //getSingleActLife
    console.log("查看专题");
    var id = e.currentTarget.id;
    var storeData = this.data.storeData;
    var storeInfo = {
      store_name: storeData.store_name,
      store_avatar: storeData.store_avatar,
      storeId: storeData.store_id,
      store_show_type: storeData.store_show_type
    }
    wx.navigateTo({
      url: '/pages/store/actlife/actlife?storeInfo=' + JSON.stringify(storeInfo) + '&geval_id=' + id,
    })
  },
  checkStoreInfo: function () {
    var storeData = this.data.storeData;
    wx.navigateTo({
      url: '/pages/store/storeinfo/storeinfo?storeData=' + JSON.stringify(storeData),
    })
  },

  skip: function (e) {
    console.log("我的数据");
    console.log(e.currentTarget.dataset);
    var obj = e.currentTarget.dataset.my;
    var jump_type = obj.shopncStoreSpecial.jump_type;
    var storeId = this.data.storeId;
    if (jump_type == 2) {
      if (obj.shopncGoodsAndUrlInfo.length <= 1) {//跳转商品详情
        var goodId = obj.shopncGoodsAndUrlInfo[0].goods_id;
        // wx.navigateTo({
        //   url: '../detail/goodsdetail?goodId=' + goodId,
        // })
        if (getCurrentPages().length > 6) {
          wx.redirectTo({
            url: '../detail/goodsdetail?goodId=' + goodId,
          })
        } else {
          wx.navigateTo({
            url: '../detail/goodsdetail?goodId=' + goodId,
          })
        }
      } else {//跳转列表
        var goods = obj.shopncGoodsAndUrlInfo;
        wx.navigateTo({
          url: './goodlist/goodlist?goods=' + JSON.stringify(goods)
        })
      }
    } else if (jump_type == 1) {
      //TODO 跳转商品图文详情
      var special_id = obj.shopncStoreSpecial.special_id;
      //this.checkTheme(special_id);
      var storeData = this.data.storeData;
      var storeInfo = {
        store_name: storeData.store_name,
        store_avatar: storeData.store_avatar,
        storeId: storeData.store_id,
        theme: 1,
        store_show_type: storeData.store_show_type
      }
      wx.navigateTo({
        url: '/pages/store/actlife/actlife?storeInfo=' + JSON.stringify(storeInfo) + '&special_id=' + special_id,
      })
    }

  },


  checkProduct: function (e) {
    var goodId = e.currentTarget.id;
    if (this.data.haveCheckProduct) {
      return;
    }
    this.setData({ haveCheckProduct: true });
    // wx.navigateTo({
    //   url: '../detail/goodsdetail?goodId=' + goodId,
    // })
    if (getCurrentPages().length > 6) {
      wx.redirectTo({
        url: '../detail/goodsdetail?goodId=' + goodId,
      })
    } else {
      wx.navigateTo({
        url: '../detail/goodsdetail?goodId=' + goodId,
      })
    }
  },
  //跳转购物车
  checkCard: function () {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var storeId = this.data.storeId;
    wx.navigateTo({
      url: './cart/cart?storeId=' + storeId,
    })
  },
  //跳转搜索
  storeSearch: function () {
    var storeId = this.data.storeId;
    wx.navigateTo({
      url: './search/search?storeId=' + storeId,
    })
  },

  havaScan: function () {
    var memberId = appUtil.lrhMethods.getMemberIdUser();
    if (memberId == null) {
      return;
    }
    var storeId = this.data.storeId;
    wx.navigateTo({
      url: "/pages/store/hslist/hslist?storeId=" + storeId,
    })
  },

  onShow: function () {
    this.setData({ haveCheckProduct: false });
  },
  my: function () {
    wx.navigateTo({
      url: './my/my',
    })
  },

  //获取动态生活
  getActLife: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    console.log("执行了1");
    var getActLifeIndex = wx.getStorageSync("getActLifeIndex");
    console.log("拿到的index:" + getActLifeIndex);
    if (getActLifeIndex == '') {
      getActLifeIndex = 1;
      console.log("执行1");
      wx.setStorageSync("getActLifeIndex", getActLifeIndex);
    } else {
      getActLifeIndex = 1 + parseInt(getActLifeIndex);
      wx.setStorageSync("getActLifeIndex", getActLifeIndex);
      console.log("执行2");
    }
    var storeId = this.data.storeId;
    wx.request({
      url: appUtil.ajaxUrls().getActLife, //
      data: {
        storeId: storeId,
        pageIndex: getActLifeIndex,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到动态生活返回" + getActLifeIndex);
        console.log(res)
        if (res.data.message.type == "success") {
          var actLifes = that.data.actLifes;
          if (res.data.data.length == 0) {
            that.setData({ actLifesHidden: true });
          }
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].geval_image != null && res.data.data[i].geval_image != "") {
              res.data.data[i].geval_image = res.data.data[i].geval_image.split(",");
            }

            actLifes.push(res.data.data[i]);
          }
          that.setData({ actLifes: actLifes });
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
  //得到全部商品
  getAllGoods: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    var allgoodsIndex = wx.getStorageSync("allgoodsIndex");
    console.log("拿到的index:" + allgoodsIndex);
    if (allgoodsIndex == '') {
      allgoodsIndex = 1;
      console.log("执行1");
      wx.setStorageSync("allgoodsIndex", allgoodsIndex);
    } else {
      allgoodsIndex = 1 + parseInt(allgoodsIndex);
      wx.setStorageSync("allgoodsIndex", allgoodsIndex);
      console.log("执行2");
    }
    var storeId = this.data.storeId;
    wx.request({
      url: appUtil.ajaxUrls().getStoreGoods, //
      data: {
        store_id: storeId,
        flg: 0,// 2.销量 3.价格降序 4.价格升序 5.新品
        page_size: 8,
        curr_page: allgoodsIndex,
        // goods_stcids: '',
        // goods_name: '',
        // special_id: ''
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到全部商品返回" + allgoodsIndex);
        console.log(res)
        if (res.data.message.type == "success") {
          var allgoods = that.data.allgoods;
          that.setData({ allGoodsLen: res.data.data.total });
          for (var i = 0; i < res.data.data.data.length; i++) {
            console.log(res.data.data.data[i].goods_id);
            res.data.data.data[i].isTapCollected = false;
            allgoods.push(res.data.data.data[i]);
          }
          that.setData({ allgoods: allgoods });
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
  //获取新品上架
  getNewGoods: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    var newGoodsIndex = wx.getStorageSync("newGoodsIndex");
    console.log("拿到的index:" + newGoodsIndex);
    if (newGoodsIndex == '') {
      newGoodsIndex = 1;
      wx.setStorageSync("newGoodsIndex", newGoodsIndex);
    } else {
      newGoodsIndex = 1 + parseInt(newGoodsIndex);
      wx.setStorageSync("newGoodsIndex", newGoodsIndex);
    }
    var storeId = this.data.storeId;
    wx.request({
      url: appUtil.ajaxUrls().getStoreGoods, //
      data: {
        store_id: storeId,
        flg: 5,// 2.销量 3.价格降序 4.价格升序 5.新品
        page_size: 8,
        curr_page: newGoodsIndex,
        // goods_stcids: '',
        // goods_name: '',
        // special_id: ''
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到新品返回" + appUtil.ajaxUrls().getStoreGoods);
        console.log(res)
        if (res.data.message.type == "success") {
          var newGoods = that.data.newGoods;
          that.setData({ newGoodsLen: res.data.data.total });
          for (var i = 0; i < res.data.data.data.length; i++) {
            res.data.data.data[i].isTapCollected = false;
            newGoods.push(res.data.data.data[i]);
          }
          that.setData({ newGoods: newGoods });
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
  //处理店铺基本信息的处理逻辑，设置到data
  transBaseDataFromServer: function (data) {
    wx.setNavigationBarTitle({
      title: data.store_name,
    })
    this.setData({ storeData: data })

  },
  //初始店铺基本信息数据
  initDataGetBaseInfo: function () {
    var that = this;
    var storeId = this.data.storeId;
    var memberId = this.data.memberId;


    wx.request({
      //selectShopncStoreInfoByStoreId
      url: appUtil.ajaxUrls().getStoreBaseInfo + "/" + storeId + "/" + memberId, //
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("初始化店铺基本数据返回");
        console.log(res)
        if (res.data.message.type == "success") {
          that.setData({
            store_show_type: res.data.data.store_show_type,
            focusonFlag: res.data.data.focusonFlag,
            liveMemberId: res.data.data.member_id
          });
          var stars = [];
          for (var i = 0; i < res.data.data.store_credit; i++) {
            stars.push("star");
          }
          that.setData({ stars: stars });
          that.transBaseDataFromServer(res.data.data);
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回" + appUtil.ajaxUrls().getStoreBaseInfo);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  //处理子导航店铺首页数据的处理逻辑，设置到data
  transDataFromServer: function (info) {
    console.log("加入数据");
    console.log(info);
    if (info.specialList.length == 0 && info.goodsList.length == 0) {
      console.log("执行了11-14");
      wx.showToast({
        title: '没有更多数据啦',
        duration: 1000,
        icon: "loading"
      })
      return;
    }
    for (var i = 0; i < info.specialList.length; i++) {
      info.specialList[i].shopncGoodsAndUrlInfo = info.specialList[i].shopncGoodsAndUrlInfo.splice(0, 3);
    }
    var specialListTmp = this.data.specialList;
    var goodsListTmp = this.data.goodsList;
    for (var i = 0; i < info.specialList.length; i++) {
      specialListTmp.push(info.specialList[i]);
    }
    for (var i = 0; i < info.goodsList.length; i++) {
      goodsListTmp.push(info.goodsList[i]);
    }
    this.setData({ specialList: specialListTmp, goodsList: goodsListTmp });
  },
  //初始子导航店铺首页数据
  initHomeData: function () {
    var that = this;
    var storeId = this.data.storeId;
    var memberId = this.data.memberId;
    wx.showLoading({
      title: '玩命加载中',
    })
    var homeDataIndex = wx.getStorageSync("homeDataIndex");
    console.log("拿到的index:" + homeDataIndex);
    if (homeDataIndex == '') {
      homeDataIndex = 1;
    } else {
      homeDataIndex = 1 + parseInt(homeDataIndex);
    }
    wx.request({
      url: appUtil.ajaxUrls().newStoreInfo, //
      data: {
        "storeId": storeId,
        "memberId": memberId,
        "pageIndex": homeDataIndex
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log(homeDataIndex + "初始化新版店铺数据返回" + appUtil.ajaxUrls().newStoreInfo);
        console.log(res)
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.message.type == "success") {
          wx.setStorageSync("homeDataIndex", homeDataIndex);
          that.transDataFromServer(res.data.data);
        }

      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  toDeYou: function (num) {
    var storeId = this.data.storeId;
    //var storeId = 4887;
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSpecByTXM,
      data: {
        "store_id": storeId,
        "barcode": num
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("根据条形码获取商品key返回");
        console.log(res);
        if (res.data.message.type == "success" && res.data.data != null) {
          var goodsId = res.data.data.goods_id;
          // var barcodeKey = res.data.data.goods_barcode;
          var barcodeKey = "";
          if (res.data.data.goods_specValue != null && res.data.data.goods_specValue != "") {
            var goodSpecObj = JSON.parse(res.data.data.goods_specValue);
            for (var key in goodSpecObj) {
              if ("" + num == "" + goodSpecObj[key].barcode) {
                barcodeKey = key;
                break;
              }
            }
          }
          wx.redirectTo({
            url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + goodsId + '&barcodeKey=' + barcodeKey,
          })
        } else if (res.data.message.type == "error") {
          that.setData({ isPrompt: !that.data.isPrompt, promptTit: '无该商品信息' })
          setTimeout(function () {
            that.setData({ isPrompt: !that.data.isPrompt })
          }, 2000)
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.stopPullDownRefresh();
      }
    })
  },
  //点击扫码购物
  scan: function () {
    if (this.data.storeData.speediness == 0) {
      var that = this;
      this.setData({ isPrompt: !that.data.isPrompt, promptTit: '该店暂不支持扫码购物' })
      setTimeout(function () {
        that.setData({ isPrompt: !that.data.isPrompt })
      }, 2000)
      return;
    }
    var that = this;
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        // console.log("扫码链接" + res.result)
        // console.log("截取链接" + res.result.substring(8, 30))
        var result = res.result;
        if (result.indexOf("/") == -1) {
          console.log("条形码");
          var num = res.result;
          that.toDeYou(num);
        } else {
          var resUrl = res.result.substring(8, 30);//截取相关url关键字段
          var urls = res.result;
          if (resUrl == that.data.defaultUrl) {
            //是正确的商品码
            if (urls != undefined) {
              urls = decodeURIComponent(urls);//对二维码进来的链接进行转码
              var strIndex = urls.lastIndexOf("/");//获取转码之后的goodsid
              var value = urls.substring(strIndex + 1, urls.length);
              console.log("数值：" + value);
              wx.showLoading({
                title: '加载中',
                mask: true,
                success: function () {
                  wx.redirectTo({//关闭当前页面，跳转到应用内的某个页面
                    url: '/pages/detail/goodsdetail?q=' + 'https://dev-api.xiaoguikuaipao.com/goods/' + value,
                  })
                }
              })
            }
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
          } else {
            that.setData({ isPrompt: !that.data.isPrompt, promptTit: '无该商品信息' })
            setTimeout(function () {
              that.setData({ isPrompt: !that.data.isPrompt })
            }, 2000)

          }
        }


      }
    })
  },
  changeIndex: function (e) {
    var id = e.detail.current;
    var idNum = parseInt(id);
    console.log(id);
    this.setData({ selectIndex: idNum });
    if (id == 1) {
      var allgoodsIndex = wx.getStorageSync("allgoodsIndex");
      if (allgoodsIndex == '') {
        this.getAllGoods();
      }
    } else if (id == 2) {
      var newGoodsIndex = wx.getStorageSync("newGoodsIndex");
      if (newGoodsIndex == '') {
        this.getNewGoods();
      }
    } else if (id == 3) {
      var getActLifeIndex = wx.getStorageSync("getActLifeIndex");
      if (getActLifeIndex == '') {
        this.getActLife();
      }
    }
  },
  //点击中部导航栏
  chooseTar: function (e) {
    wx.pageScrollTo({
      scrollTop: 450,
      duration: 300
    })
    var id = e.currentTarget.id;
    var idNum = parseInt(id);
    console.log(id);
    this.setData({ selectIndex: idNum });
    if (id == 1) {
      var allgoodsIndex = wx.getStorageSync("allgoodsIndex");
      if (allgoodsIndex == '') {
        this.getAllGoods();
      }
    } else if (id == 2) {
      var newGoodsIndex = wx.getStorageSync("newGoodsIndex");
      if (newGoodsIndex == '') {
        this.getNewGoods();
      }
    } else if (id == 3) {
      var getActLifeIndex = wx.getStorageSync("getActLifeIndex");
      if (getActLifeIndex == '') {
        this.getActLife();
      }
    }
  },
  //滑动调用加载对应数据的函数
  slideAndInvokeFunction: function (selectIndex) {
    if (selectIndex == 1) {
      var allgoodsIndex = wx.getStorageSync("allgoodsIndex");
      if (allgoodsIndex == '') {
        this.getAllGoods();
      }
    } else if (selectIndex == 2) {
      var newGoodsIndex = wx.getStorageSync("newGoodsIndex");
      if (newGoodsIndex == '') {
        this.getNewGoods();
      }
    } else if (selectIndex == 3) {
      var getActLifeIndex = wx.getStorageSync("getActLifeIndex");
      if (getActLifeIndex == '') {
        this.getActLife();
      }
    }
  },
  //触摸结束
  touchend: function (e) {
    // console.log("触摸结束");
    // console.log(e);
    var locEnd = e.changedTouches[0];
    this.setData({ locEnd: locEnd });

    var locStart = this.data.locStart;
    var distance = locEnd.pageX - locStart.pageX;
    var distanceY = locEnd.clientY - locStart.clientY;
    var selectIndex = this.data.selectIndex;
    // console.log("y距离：" + distanceY);
    // console.log("x距离：" + distance);
    if (distanceY < -50) {//如果是往上大滑动，不做处理
      return;
    }
    if (this.data.fixStyle && Math.abs(distanceY) > 100) {//数值越大月灵敏
      return;
    }
    if (Math.abs(distance) < 50) {//解决点击底部导航栏时候的误差触碰误差
      return;
    }
    if (distance > 0) {//向右滑
      console.log("向右");
      if (selectIndex == 0) {
        this.setData({ selectIndex: 3 });
        this.slideAndInvokeFunction(3);
        return;
      }
      selectIndex = selectIndex - 1;

      this.setData({ selectIndex: selectIndex });
      this.slideAndInvokeFunction(selectIndex);
    } else {//向左滑动
      console.log("向左");
      if (selectIndex == 3) {
        this.setData({ selectIndex: 0 });
        this.slideAndInvokeFunction(0);
        return;
      }
      selectIndex = selectIndex + 1;
      this.setData({ selectIndex: selectIndex });
      this.slideAndInvokeFunction(selectIndex);
    }
  },
  //触摸开始
  touchstart: function (e) {
    // console.log("触摸开始");
    // console.log(e);
    var locStart = e.changedTouches[0];
    this.setData({ locStart: locStart });
  },
  //点击底部导航栏
  bindtapBar: function (e) {
    var id = e.currentTarget.id;
    var storeId = this.data.storeId;
    if (id == 0) {
      if (this.data.store_show_type == 1) {
        wx.redirectTo({
          url: '/pages/store/glspecial/glspecial?storeId=' + storeId,
        })
      } else {
        wx.navigateTo({
          url: './category/category?storeId=' + storeId,
        })
      }

    }
  },
  getTimeStamp: function () {
    var dateTmp = new Date();
    var year = dateTmp.getFullYear();
    var mon = dateTmp.getMonth();
    var day = dateTmp.getDate();
    var endTime = "" + year + "-" + mon + "-" + day + " 21:00:00";
    var date = new Date();
    date.setFullYear(endTime.substring(0, 4));
    date.setMonth(endTime.substring(5, 7) - 1);
    date.setDate(endTime.substring(8, 10));
    date.setHours(endTime.substring(11, 13));
    date.setMinutes(endTime.substring(14, 16));
    date.setSeconds(endTime.substring(17, 19));
    console.log(Date.parse(date) / 1000);
  },
  getPages: function () {
    var pages = getCurrentPages();
    console.log("页面路由");
    console.log(pages);
  },
  onLoad: function (options) {
    //this.getPages();

    //options.storeId = 5031;
    //options.storeId = 5969;
    if (options.q != undefined) {
      var memberId = appUtil.lrhMethods.getMemberId();
      console.log("memberId:" + memberId);
      if (memberId == null) {
        memberId = 0;
      }
      var q = decodeURIComponent(options.q);//对二维码进来的链接进行转码
      var strIndex = q.lastIndexOf("/");//获取转码之后的goodsid
      var storeId = q.substring(strIndex + 1, q.length);
      this.setData({ storeId: storeId, memberId: memberId });
    } else {
      var storeId = options.storeId;
      //var storeId = 2334;
      var memberId = appUtil.lrhMethods.getMemberId();
      console.log("memberId:" + memberId);
      if (memberId == null) {
        memberId = 0;
      }
      this.setData({ storeId: storeId, memberId: memberId });
    }
    app.clearMySelfStorage();
    this.initHomeData();
    this.initDataGetBaseInfo();
  },
  onShareAppMessage: function () {
    var store_name = this.data.storeData.store_name;
    var storeId = this.data.storeId;
    return {
      title: '' + store_name,
      path: 'pages/store/index?storeId=' + storeId
    }
  },
  onReady: function () { },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    this.checkIsCollected();
  },

  //监听页面滚动函数
  onPageScroll: function (res) {
    // console.log("滚动参数");
    // console.log(res);
    var calValue = 225;
    if (res.scrollTop < 300) {
      this.setData({ fixStyle: false });
      return;
    }
    if (res.scrollTop > calValue) {
      this.setData({ fixStyle: true });
    } else {
      this.setData({ fixStyle: false });
    }
  },
  getMoreData: function () {
    var selectIndex = this.data.selectIndex;
    if (selectIndex == 0) {
      this.initHomeData();
    } else if (selectIndex == 1) {
      this.getAllGoods();
    } else if (selectIndex == 2) {
      this.getNewGoods();
    }
  },
  onReachBottom: function () {
    var selectIndex = this.data.selectIndex;
    if (selectIndex == 0) {
      this.initHomeData();
    } else if (selectIndex == 1) {
      this.getAllGoods();
    } else if (selectIndex == 2) {
      this.getNewGoods();
    }
  },
})