var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    tab: [{
      id: 0,
      tabname: "综合",
    }, {
      id: 1,
      tabname: "销量",
    }, {
      id: 2,
      tabname: "新品",
    }, {
      id: 3,
      tabname: "价格",
    }],
    selectIndex: 0,
    changed: true,
    keyword: '',
    special_id: '',
    goods: [],
    goodsLen: 0,
    flg: 0,// 2.销量 3.价格降序 4.价格升序 5.新品


    connect:false,//店铺首页关联商品进来的
  },
 
  checkProduct: function (e) {
    var goodId = e.currentTarget.id;
    console.log(goodId);
    wx.redirectTo({
      url: '../../detail/goodsdetail?goodId=' + goodId,
    })
  },
  storeSearch: function () {
    var storeId = this.data.storeId;
    wx.redirectTo({
      url: '../search/search?storeId=' + storeId,
    })
  },
  changeShowProduct: function () {
    var changed = this.data.changed;
    this.setData({ changed: !changed });
  },
  chooseTar: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    var idNum = parseInt(id);
    //flg: 0,// 2.销量 3.价格降序 4.价格升序 5.新品
    this.setData({ selectIndex: idNum });

    if (this.data.connect) {

    } else {
      wx.setStorageSync("seachGoodsIndex", '');
      if (idNum == 0) {
        this.setData({ flg: 0 });
      } else if (idNum == 1) {
        this.setData({ flg: 2 });
      } else if (idNum == 2) {
        this.setData({ flg: 5 });
      } else if (idNum == 3) {
        this.setData({ flg: 3 });
      }
      this.setData({ goods: [] });
      this.getStoreGoods();
    }

  },
  onLoad: function (options) {
    wx.removeStorageSync("seachGoodsIndex");
    var goodsStr = options.goods;
    var special_id = options.special_id;
    //var keyword = "毛";//options.keyword;
    var keyword = options.keyword;

    this.setData({ storeId: options.storeId});
    if (special_id != undefined) {
      this.setData({ special_id: special_id });
    }
    if (goodsStr != undefined) {
      var goods = JSON.parse(goodsStr);
      this.setData({ goods: goods, connect:true});
    }
    if (keyword != undefined) {
      this.setData({ keyword: keyword });
    }
    if (options.storeId!=undefined){
      this.setData({ storeId: options.storeId });
      this.getStoreGoods();
    }
    
  },









  //设置商品的收藏状态
  setGoodCollect: function (e) {
    console.log("设置商品收藏状态");
    var id = e.currentTarget.id;
    var goods = this.data.goods;
    for (var i in goods) {
      if (goods[i].goods_id == id) {
        goods[i].collect = !goods[i].collect;
        //goods[i].isTapCollected = false;
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
      } else {
        goods[i].isTapCollected = false;
      }

    }
    this.setData({ goods: goods });
  },
  //收藏商品
  collectGood: function (goodId, isFavorites) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var memberId = appUtil.lrhMethods.getMemberIdUser();
    var that = this;
    var storeId = this.data.storeId;
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
























  getStoreGoods: function () {
    var that = this;
    var keyword = this.data.keyword
    wx.showLoading({
      title: '玩命加载中',
    })
    var seachGoodsIndex = wx.getStorageSync("seachGoodsIndex");
    console.log("拿到的index:" + seachGoodsIndex);
    if (seachGoodsIndex == '') {
      seachGoodsIndex = 1;
      console.log("执行1");
      wx.setStorageSync("seachGoodsIndex", seachGoodsIndex);
    } else {
      seachGoodsIndex = 1 + parseInt(seachGoodsIndex);
      wx.setStorageSync("seachGoodsIndex", seachGoodsIndex);
      console.log("执行2");
    }
    var flg = this.data.flg;
    var special_id = this.data.special_id;
    wx.request({
      url: appUtil.ajaxUrls().getStoreGoods, //
      data: {
        store_id: that.data.storeId,
        flg: flg,// 2.销量 3.价格降序 4.价格升序 5.新品
        page_size: 8,
        curr_page: seachGoodsIndex,
        // goods_stcids: '',
        goods_name: keyword,
        //special_id: special_id
        goods_stcids: special_id
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log(special_id + "--" + flg + "得到搜索列表商品返回" + keyword + seachGoodsIndex);
        console.log(res)
        if (res.data.message.type == "success") {
          var goods = that.data.goods;
          that.setData({ goodsLen: res.data.data.total });
          for (var i = 0; i < res.data.data.data.length; i++) {
            console.log(res.data.data.data[i].goods_id);
            res.data.data.data[i].isTapCollected = false;
            goods.push(res.data.data.data[i]);
          }
          that.setData({ goods: goods });
          wx.hideLoading();
        }
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
    console.log("触发了");
    if (!this.data.connect){
      this.getStoreGoods();
    }
    
  },
})