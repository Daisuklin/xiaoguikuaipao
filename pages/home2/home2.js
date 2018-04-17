var app = getApp();
var amapFile = require('../../utils/amap-wx.js');
var appUtil = require('../../utils/appUtil.js');
Page({
  data: {
    positionFlag: false,
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
    activeIndex: 0,

    addrName: "",
    activityList: [],
    arrs: [],

    v1: 0,//标记页面滚动值
    goods: [1, 2, 3, 4],
    fixStyle: false,
    zk: "../../image/home2/zk.png",
    sx: "../../image/home2/sx.png",
    shop: "../../image/home2/shop.png",

    xsHidden: false,
    goodsLen0: 0,
    goodsLen1: 0,
    goodsLen2: 0,
    allOrderList: [],
    salesList: [],
    distanceList: [],
    hotIndex: 1,
    salesIndex: 1,
    disIndex: 1,
    labelStores: [],
    labelId: 0,

    icon: {
      hotstore: '../../image/index/hotstore.png'
    },
    isInServerArea: true
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '400-660-9727',
    })
  },
  toSearch: function () {
    wx.navigateTo({
      url: '../home/search/search',
    })
  },
  chooseAddr: function () {
    wx.setStorageSync("changeAddFlag", true);
    wx.navigateTo({
      url: '/pages/home/chooseAddr/chooseAddr',
    })
  },
  checkBanner: function (e) {
    console.log(e);
    var themeType = e.currentTarget.dataset.my.themeType;
    var tagerId = e.currentTarget.dataset.my.tagerId;
    var themeId = e.currentTarget.dataset.my.themeId;
    var banner = e.currentTarget.dataset.my.themeLoge;
    if (themeType == 2) {//跳web商品列表
      wx.navigateTo({
        url: '../home/themepage/themepage?banner=' + banner + '&themeId=' + themeId + '&isStoreType=0',
      })
    } else if (themeType == 3) {//跳web店铺列表
      wx.navigateTo({
        url: '../home/themepage/themepage?banner=' + banner + '&themeId=' + themeId + '&isStoreType=1',
      })
    } else if (themeType == 5) {//商品详情
      wx.navigateTo({
        url: '../detail/goodsdetail?goodId=' + tagerId,
      })
    } else if (themeType == 6) {//店铺详情
      wx.navigateTo({
        url: '/pages/store/index?storeId=' + tagerId,
      })
    }
  },
  checkProduct: function (e) {
    if (!appUtil.lrhMethods.checkPageState()) {
      return;
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
  checkGoodClass: function (e) {
    console.log("查看分类");
    console.log(e);
    var classId = e.currentTarget.id;
    var catName = e.currentTarget.dataset.catname;
    if (classId == 0) {
      wx.navigateTo({
        url: '../home/moreclass/moreclass',
      })
      return;
    }
    wx.navigateTo({
      url: '../home/secondclass/secondclass?classId=' + classId + '&catName=' + catName,
    })
  },
  tapMask: function () {
    this.setData({ fixStyle: false, xsHidden: false });
    this.setAnimation2();
  },
  chooseTar: function (e) {
    console.log(e.currentTarget.id);
    if (e.currentTarget.id == 0) {//当重复点击时候
      var goodsLen = this.data.goodsLen0;
      // , stores: []
      this.setData({ activeIndex: e.currentTarget.id, xsHidden: false, goodsLen: goodsLen });
      if (this.data.allOrderList.length == 0) {
        this.setData({ haveRequest: false });
        this.getStores(this.data.hotIndex);
      } else {
        var stores = this.data.allOrderList;
        var goodsLen = this.data.goodsLen0;
        if (goodsLen > stores) {
          this.setData({ haveRequest: true });
        }
        this.setData({ stores: stores });
      }
    } else if (e.currentTarget.id == 1) {
      var goodsLen = this.data.goodsLen1;
      // , stores: []
      this.setData({ activeIndex: e.currentTarget.id, xsHidden: false, goodsLen: goodsLen });
      if (this.data.salesList.length == 0) {
        this.setData({ haveRequest: false });
        this.getStores(this.data.salesIndex);
        var that = this;
      } else {
        var stores = this.data.salesList;
        var goodsLen = this.data.goodsLen1;
        if (goodsLen > stores) {
          this.setData({ haveRequest: true });
        }
        this.setData({ stores: stores });
      }
    } else if (e.currentTarget.id == 2) {
      var goodsLen = this.data.goodsLen2;
      // , stores: []
      this.setData({ activeIndex: e.currentTarget.id, xsHidden: false, goodsLen: goodsLen });
      if (this.data.distanceList.length == 0) {
        this.setData({ haveRequest: false });
        this.getStores(this.data.disIndex);
      } else {
        var stores = this.data.distanceList;
        var goodsLen = this.data.goodsLen2;
        if (goodsLen > stores) {
          this.setData({ haveRequest: true });
        }
        this.setData({ stores: stores });
      }
    } else if (e.currentTarget.id == 3) {
      this.setData({ xsHidden: true, fixStyle: true });
      var that = this;
      setTimeout(function () {
        that.setAnimation1();
      }, 100);
    }
  },
  setAnimation1: function () {
    var duration = 500

    var item1 = wx.createAnimation({
      duration: duration,
      transformOrigin: '0 0 0'
    })

    item1.translateY(0).step()

    this.setData({
      item1: item1
    })
  },
  setAnimation2: function () {
    var duration = 500

    var item1 = wx.createAnimation({
      duration: duration,
      transformOrigin: '0 0 0'
    })

    item1.translateY(-300).step()

    this.setData({
      item1: item1,
    })
  },
  //继续往已有的店铺列表添加下拉请求回来的店铺数据
  setStores: function (id, stores, index, goodsLen) {
    console.log(id + "**********" + index);
    console.log(stores);
    this.setData({ goodsLen: goodsLen });
    if (id == 0) {
      var allOrderList = this.data.allOrderList;
      for (var i in stores) {
        allOrderList.push(stores[i]);
      }
      this.setData({
        stores: allOrderList, allOrderList: allOrderList,
        hotIndex: index + 1, goodsLen0: goodsLen
      });
    } else if (id == 1) {
      var salesList = this.data.salesList;
      for (var i in stores) {
        salesList.push(stores[i]);
      }
      this.setData({
        stores: salesList, salesList: salesList,
        salesIndex: index + 1, goodsLen1: goodsLen
      });
    } else if (id == 2) {
      var distanceList = this.data.distanceList;
      for (var i in stores) {
        distanceList.push(stores[i]);
      }
      this.setData({
        stores: distanceList, distanceList: distanceList,
        disIndex: index + 1, goodsLen2: goodsLen
      });
    }
  },
  onReachBottom: function () {
    if (this.data.activeIndex == 0 && this.data.haveRequest) {
      this.getStores(this.data.hotIndex);
    } else if (this.data.activeIndex == 1 && this.data.haveRequest) {
      this.getStores(this.data.salesIndex);
    } else if (this.data.activeIndex == 2 && this.data.haveRequest) {
      this.getStores(this.data.disIndex);
    }
  },
  //获取热门店铺
  getStores: function (index) {
    var that = this;
    var hotIndex = this.data.hotIndex;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().getPopularStores,
      data: {
        "pageIndex": index,
        "labelId": that.data.labelId,
        "longitude": that.data.longitude,
        "latitude": that.data.latitude,
        "areaCode": that.data.areaCode,
        "type": that.data.activeIndex,//0:综合排序;1:销量最高;2:距离最近
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
          console.log("总个数：" + res.data.data.totalPage);
          that.setData({ haveRequest: true });
          var stores = [];
          if (that.data.activeIndex == 1) {
            stores = res.data.data.storeList;
          } else {
            stores = res.data.data.storeList;
          }
          if (hotIndex == 1 && that.data.activeIndex == 0) {
            that.setLabelStores(res.data.data.labelStores);
          }
          that.setStores(that.data.activeIndex, stores, index, res.data.data.totalPage);
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
  //设置分类标签
  setLabelStores: function (labelStores) {
    console.log("设置分类标签");
    var labLen = labelStores.length;
    var arrsSize = Math.ceil(labLen / 6);
    console.log("数组大小：" + arrsSize);
    var arrs = [];//二位数组，存放标签，里面每个一位数组大小为6
    if (arrsSize != 0) {
      for (var i = 0; i < labelStores.length; i = i + 6) {
        var arr = [];//一行标签
        for (var j = 0; j < 6; j++) {//一行标签放6个标签
          arr.push(labelStores[i + j]);
        }
        arrs.push(arr);
      }
    }
    console.info("标签", arrs);
    this.setData({ labelStores: arrs });
  },
  chooseLabel: function (e) {
    console.log(e);
    var name = e.currentTarget.dataset.my;
    if (name == "热门") {
      name = "筛选";
    }
    var tab = this.data.tab;
    tab[3].tabname = name;
    console.log(tab);
    var labelId = e.currentTarget.id;
    this.setData({ labelId: labelId });
    this.setData({
      stores: [], xsHidden: false, fixStyle: false, tab: tab,
      allOrderList: [],
      salesList: [],
      distanceList: [],
      hotIndex: 1,
      salesIndex: 1,
      disIndex: 1,
      haveRequest: false
    });
    if (this.data.activeIndex == 0) {
      this.getStores(this.data.hotIndex);
    } else if (this.data.activeIndex == 1) {
      this.getStores(this.data.salesIndex);
    } else if (this.data.activeIndex == 2) {
      this.getStores(this.data.disIndex);
    }

  },
  onPullDownRefresh: function () {
    this.onShowInitData();
    this.initData(this.data.areaCode);

    wx.stopPullDownRefresh();
    this.setData({ positionFlag: false });//相对在父盒子里面
  },
  onShowInitData: function () {
    this.setData({
      goodsLen0: 0,
      goodsLen1: 0,
      goodsLen2: 0,
      allOrderList: [],
      salesList: [],
      distanceList: [],
      hotIndex: 1,
      salesIndex: 1,
      disIndex: 1,
      labelStores: [],
      labelId: 0,
      isInServerArea: true,
      stores: []
    });
  },
  onShow: function () {
    appUtil.lrhMethods.initPageState();

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
      this.initData(addr.adcode);
    }
    this.ifNotLocation();
  },

  initData: function (areaCode) {
    this.getFrontPageInterface(areaCode);//调用新首页接口

  },
  onPageScroll: function (e) {
    //console.log(e);
    var value = e.scrollTop;
    if (value < 0) {
      value = 0;
    }
    var vOld = this.data.v1;
    this.setData({ v1: value });
    if (vOld - value < 0) {//往上滑动
      //console.log("往上滑动" + (vOld - value));
      this.setData({ positionFlag: true });//固定在顶部
    } else if (vOld - value > 0 && value < 30) {//往下面拉
      this.setData({ positionFlag: false });//相对在父盒子里面
    }
  },
  ifNotLocation: function () {
    var latitude = wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude");
    if (latitude == "" && longitude == "") {
      var myAmapFun = new amapFile.AMapWX({
        key: 'd0063cd5d8e04b14dfe98eae69dc9617'
      });
      var that = this;
      myAmapFun.getRegeo({//获取的位置信息
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
          that.initData(areaCode);
        },
        fail: function (info) {
          //失败回调
          console.log(info)
        }
      })
    }
  },
  // ---------------------------------ldy--------------------------------------
  onLoad: function (options) {
    //高德地图key
    var myAmapFun = new amapFile.AMapWX({
      key: 'd0063cd5d8e04b14dfe98eae69dc9617'
    });
    var that = this;
    myAmapFun.getRegeo({//获取的位置信息
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
        that.initData(areaCode);
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
  // 获取新版首页接口数据
  getFrontPageInterface: function (areaCode) {
    var that = this;
    var memberId = (appUtil.appUtils.getMemberIdData() == 'undefined' || appUtil.appUtils.getMemberIdData() == null || appUtil.appUtils.getMemberIdData() == "") ? 0 : appUtil.appUtils.getMemberIdData().memberData.member_id;
    appUtil.controllerUtil.getFrontPageInterface({
      areaCode: areaCode,
      memberId: memberId,
      "longitude": that.data.longitude,
      "latitude": that.data.latitude,
    }, function (frontPagedata) {
      if (frontPagedata.data.succeeded == true) {
        console.info("isOpen", frontPagedata.data.data.isOpen)
        if (frontPagedata.data.data.isOpen == true) {
          // -------------------------正常开放区域
          //调用接口正常
          var homeData = frontPagedata.data.data;
          console.info("homeData", homeData)
          that.setGoodsClassList(homeData); //分类图
          that.handlingEventsActivityData(homeData.template);//处理活动页第二模板的数据
          that.setData({
            recommendationToEveryDay: homeData.recommendationToEveryDay,//每日推荐
            popularStore: homeData.popularStore,//品牌好店
            popularStoreLengthOld: homeData.popularStore.length,//品牌好店
            // template: homeData.template,//模板（活动页）
            activityList: homeData.banner
          })
          that.getStores(that.data.hotIndex);
          wx.hideLoading();
        } else {
          // 非正常开放区域（即该区域无合作商家）
          that.setData({
            recommendationToEveryDay: '',
            popularStore: '',
            popularStoreLengthOld: '',
            template: '',
            isInServerArea: false
          })
        }
      } else {
        //调用接口失败
        console.log("error", frontPagedata.data.message.descript)
      }

    })
  },
  // 处理分类数据
  setGoodsClassList: function (homeData) {
    var classify = homeData.classify;
    var listNoSplice = homeData.classify2;
    console.info("没有截取的分类", listNoSplice);
    wx.setStorageSync("allClass", listNoSplice);

    var labLen = classify.length;
    if (labLen > 10) {
      var classifyfenlei = null;
      for (var i in classify) {
        if (classify[i].gc_name == "分类") {
          classifyfenlei = classify[i];
          break;
        }
      }
      classify = classify.splice(0, 9);
      classify.push(classifyfenlei);
    }

    var arrsSize = Math.ceil(labLen / 5);
    // console.log("数组大小：" + arrsSize);
    var arrs = [];//二位数组，存放标签，里面每个一位数组大小为5
    if (arrsSize != 0) {
      for (var i = 0; i < classify.length; i = i + 5) {
        var arr = [];//一行标签
        for (var j = 0; j < 5; j++) {//一行标签放五个标签
          arr.push(classify[i + j]);
        }
        arrs.push(arr);
      }
    }
    this.setData({ arrs: arrs });
  },
  // 每日推荐点击事件跳转到店铺
  bindrecomemenddation: function (e) {
    var that = this;
    var storeId = e.currentTarget.id;//获取点击店铺的id
    var showType = e.currentTarget.dataset.showtype;
    console.info("e", showType)
    if (showType == 2) {
      wx.navigateTo({//保留当前页
        url: '/pages/store/index?isAgin=0&storeId=' + storeId,//商超类型上下
      })
    } else {
      wx.navigateTo({//保留当前页
        url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + storeId,//美食等类型左右
      })
    }
  },
  // 活动页---左侧大图
  bindActivepagepictrue: function (e) {
    var that = this;
    var tagerId = e.currentTarget.id;
    var actionType = e.currentTarget.dataset.actiontype;
    var showType = e.currentTarget.dataset.showtype;//判斷店鋪類型
    var catName = e.currentTarget.dataset.labelname;
    var showbanner = e.currentTarget.dataset.showbanner;//banner图
    var templatename = e.currentTarget.dataset.templatename;//主题标题
    if (showbanner == null) {
      showbanner = "";
    }
    if (templatename == null || templatename == '') {
      templatename = '';
    }
    console.info("左侧e", e, "tagerId", tagerId, "actionType", actionType, "showType", showType, "showbanner", showbanner, "templatename", templatename)
    // actionType 0不是店铺，1跳转到店铺详情，2跳转到店铺标签分类列表
    if (actionType == 1) {
      // 1跳转到店铺详情
      if (showType == 2) {
        wx.navigateTo({
          url: '/pages/store/index?isAgin=0&storeId=' + tagerId,//商超类型上下
        })
      } else {
        wx.navigateTo({
          url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + tagerId,//美食等类型左右
        })
      }
    } else if (actionType == 2) {
      // 2跳转到店铺标签分类列表
      if (catName != '') {
        // 分类名不为空
        // wx.navigateTo({
        //   url: '/pages/home/secondclass/secondclass?classId=' + tagerId + '&catName=' + catName,
        // })
        wx.navigateTo({
          url: '/pages/home/themepage/themepage?banner=' + showbanner + '&labelId=' + tagerId + '&isStoreType=2' + '&themeName=' + templatename,
        })
      }
    } else {
      console.info("error", actionType)
    }
  },
  // 活动页---右侧小图
  bindActivepageimg: function (e) {
    console.log(e.currentTarget.dataset.themeobj);
    var theme = e.currentTarget.dataset.themeobj;
    var banner = theme.show_banner;
    var themeType = theme.themeType;
    var themeId = theme.themeId;//themeType=0、1、2、3、4 时调用
    var tagerId = theme.tagerId;//themeType=5 、6 时调用
    var theme_name = theme.themeName;//主题标题名称
    var showType = theme.store_show_type;//当store_show_type不存在时有可能是null有可能是0
    if (showType == null || showType == 0 || showType == '') {
      showType = 0
    }
    // themeType=5跳商品详情，themeType=6跳店铺详情
    switch (themeType) {
      case 0:
        // 测试数据
        break;
      case 1:
        // 跳web列表
        // wx.navigateTo({
        //   url: '/pages/home/themepage/themepage?banner=' + banner + '&themeId=' + themeId + '&isStoreType=0',
        // })
        break;
      case 2:
        // 跳商品列表
        wx.navigateTo({
          url: '/pages/home/themepage/themepage?banner=' + banner + '&themeId=' + themeId + '&isStoreType=0' + '&themeName=' + theme_name,
        })
        break;
      case 3:
        // 跳店铺列表
        wx.navigateTo({
          url: '/pages/home/themepage/themepage?banner=' + banner + '&themeId=' + themeId + '&isStoreType=1' + '&themeName=' + theme_name,
        })
        console.info("themeType", themeType)
        break;
      case 4:
        // 点击无反应
        break;
      case 5:
        // 跳商品详情
        wx.navigateTo({
          url: '/pages/detail/goodsdetail?goodId=' + tagerId,
        })
        break;
      case 6:
        // 跳店铺详情
        if (showType == 2) {
          wx.navigateTo({
            url: '/pages/store/index?isAgin=0&storeId=' + tagerId,//商超类型上下
          })
        } else {
          wx.navigateTo({
            url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + tagerId,//美食等类型左右
          })
        }
        break;
    }
  },
  // 跳转到品牌店铺
  bindHotStore: function (e) {
    var that = this;
    var hotStoreId = e.currentTarget.id;
    var showType = e.currentTarget.dataset.showtype;
    // 1跳转到店铺详情
    if (showType == 2) {
      wx.navigateTo({
        url: '/pages/store/index?isAgin=0&storeId=' + hotStoreId,//商超类型上下
      })
    } else {
      wx.navigateTo({
        url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + hotStoreId,//美食等类型左右
      })
    }
  },
  // 处理活动页第二模板的数据（如果数据量是奇数，就去掉最后一个）
  handlingEventsActivityData: function (template) {
    var that = this;
    var templateData = template;
    for (var child in templateData) {
      if (templateData[child].templateType == 'item_02') {
        // 选择第二模板数据
        var temChild = templateData[child];
        var takeOver = (parseInt(temChild.themeActivity.length)) % 2;
        if (takeOver != 0) {
          //第二模板数据为奇数
          var themeActivityOld = templateData[child].themeActivity;
          var themeActivityNew = [];
          console.info("themeActivityOld", themeActivityOld)
          for (var activity = 0; activity < themeActivityOld.length - 1; activity++) {
            // 去掉最后一个之后重新赋值
            themeActivityNew.push(themeActivityOld[activity]);
          }
          console.info("themeActivityNew", themeActivityNew)
          templateData[child].themeActivity = themeActivityNew;
        }
      }
    }
    that.setData({
      template: templateData,//模板（活动页）
    })
    console.info("templateData----", templateData)
  },
  // 滚动到右边，会触发 scrolltolower 事件
  bindscrolltolower: function (e) {
    var that = this;
    var popularStoreOld = that.data.popularStore;
    var popularStoreLength = parseInt(popularStoreOld.length);
    var popularStoreLengthOld = parseInt(e.currentTarget.dataset.popularlength);//原始品牌好店的长度
    var popularStoreNew = [];
    var popularStoreBackupsBeforeArr = [];//备份前
    var popularStoreBackupsAfterArr = [];//备份后
    // if (popularStoreLength == popularStoreLengthOld) {
    //   // 第一次调用该方法
    //   for (var fri in popularStoreOld) {
    //     popularStoreBackupsBeforeArr.push(popularStoreOld[fri]);
    //   }
    //   popularStoreBackupsBeforeArr[popularStoreLengthOld] = popularStoreOld[0];//将第一个数据复制到最后面
    //   var popularStoreNew = popularStoreBackupsBeforeArr;
    // } else {
    //   // 已经调用过一次之后
    //   for (var index = 0; index < popularStoreLengthOld; index++) {
    //     popularStoreBackupsAfterArr.push(popularStoreOld[index + 1])
    //   }
    //   popularStoreBackupsAfterArr[popularStoreLengthOld] = popularStoreOld[1];
    //   var popularStoreNew = popularStoreBackupsAfterArr;
    // }
    // console.info("popularStoreNew:", popularStoreNew)
    // _-----------------------------------------------------------------
    // console.info(popularStoreLength, popularStoreLengthOld,"popularStoreBackupsBeforeArr", popularStoreBackupsBeforeArr, "popularStoreBackupsAfterArr", popularStoreBackupsAfterArr)
    // if (popularStoreLength > (popularStoreLengthOld * 2)) {
    //   var num = popularStoreLength - (popularStoreLengthOld * 2);
    //   console.info("popularStoreLength", popularStoreLength, "popularStoreLengthOld", popularStoreLengthOld, "num", num)
    // }

    // for (var po = 0; po < popularStoreLength + 1; po++) {
    //   if (po < popularStoreLength) {
    //     popularStoreNew.push(popularStoreOld[po]);
    //   } else {
    //     popularStoreNew[po] = popularStoreOld[po - popularStoreLengthOld];
    //     // popularStoreNew.push(popularStoreOld[po - popularStoreLengthOld]);
    //   }
    // }
    // console.info("滚动到右边，会触发 scrolltolower 事件", popularStoreLength, "popularStoreLengthOld", popularStoreLengthOld)
    // console.info("popularStoreNew", popularStoreNew)
    // that.setData({
    //   popularStore: popularStoreNew
    // })
  },
  // 滚动到左边，会触发 scrolltoupper 事件
  bindscrolltoupper: function (e) {
    var that = this;
    console.info("滚动到左边，会触发 scrolltoupper 事件")
    // var popularStoreOld = that.data.popularStore;
    // var popularStoreLength = popularStoreOld.length;
    // var popularStoreLengthOld = e.currentTarget.dataset.popularlength;//原始品牌好店的长度
    // var popularStoreNew = [];
  },
})