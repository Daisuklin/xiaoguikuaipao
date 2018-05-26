var iconsUtils = require("../../../image/icons.js");
var walletUtil = require("../../../utils/walletUtil.js");
var appUtil = require("../../../utils/appUtil.js");
Page({
  data: {
    // shops:[
    //   { name: "店铺1", shopId: 1, isClick: false },
    //   { name: "店铺2", shopId: 2, isClick: false },
    //   { name: "店铺3", shopId: 3, isClick: false },
    //   { name: "店铺4", shopId: 4, isClick: false },
    //   { name: "店铺5", shopId: 5, isClick: false },
    //   { name: "店铺6", shopId: 6, isClick: false },
    //   { name: "店铺7", shopId: 7, isClick: false },
    //   { name: "店铺8", shopId: 8, isClick: false },
    // ],
    scrollTo:0,
    showShopList:false,
    onePayFlag: 0,//onePayFlag=200,为商家/店员，403不是店员，0是默认值
    isTotalBook:true
  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  // 收账本首页数据
  getwalletData: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    walletUtil.controllerUtil.getwallet({},
      function (sucData) {
        console.info("sucData", sucData)
        if (sucData.data.succeeded) {
          // 成功
          if (sucData.data.data.itemList.length==1){
            walletUtil.appUtils.setShopIdData(sucData.data.data.itemList[0].id)
          }
          that.setData({
            detailsData: sucData.data.data,
            shops: sucData.data.data.itemList,//分店列表
            onePayFlag: 200
          })
          //that.initShopSelectItem("", sucData.data.data.itemList);//分店列表
          wx.hideLoading();
        } else {
          // 失败
          if (sucData.data.error.code == 401 || sucData.data.message.descript == '后台信息更新，请重新登录') {
            // 未登录,重新登录
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          } else if (sucData.data.error.code == 403 || sucData.data.message.descript == '无权限访问') {
            // code=403为非店员
            that.setData({
              onePayFlag: 403
            })
          } else {
            console.info("error", sucData.data.message.descript)
          }
          wx.hideLoading();
        }
      }, function (failData) { }, function (comData) { })
  },

  initShopSelectItem:function(shopId,shops){
    if (shops.length > 1 && shopId==""){
      shops.forEach(function(obj){
        obj.isClick=false;
        newShop.push(obj)
      })
      this.setData({
        shops:newShop
      })
    } else if (shops.length > 1 && shopId != ""){
      var newShop = [];
      shops.forEach(function (obj) {
        if (obj.shopId != shopId){
          obj.isClick = false;
        }else{
          obj.isClick = true;
        }
        newShop.push(obj)
      })
      this.setData({
        shops: newShop
      })
    }
  },
  // 弹出分店列表
  btn_select:function(){
    let that = this;
    if (that.data.shops.length <= 1){
      that.getPromptPark("暂无分店")
      return
    }
    this.setData({
      showShopList: !this.data.showShopList
    });
  },
  changeShopId:function(e){
    // this.initShopSelectItem(e.currentTarget.dataset.id,this.data.shops)
    // this.setData({
    //   showShopList: !this.data.showShopList
    // });
    walletUtil.appUtils.setShopIdData(e.currentTarget.dataset.id)
    this.setData({
      showShopList: !this.data.showShopList
    });
    this.getwalletData()
  },
  scrollFun:function(e){
    this.setData({
      scrollTo: e.detail.scrollTop
    });
  },
  // 收款记录
  gotorecordReceipts: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/recordReceipts/recordReceipts',
    })
  },
  // 收入统计
  gotoincomestatistics: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/incomestatistics/incomestatistics',
    })
  },
  // 分店管理
  gotomultipleshops: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/multipleShop/list/list',
    })
  },
  // 跳转到店铺收款码
  gotoReceiptcode: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/receiptcode/receiptcode',
    })
  },
  // 跳转到龟米奖励
  gotoRedpacketcode:function(){
    wx.navigateTo({
      url: '/pages/my/wallet/reward/reward',
    })
  },
  // 添加店员收款通知
  gotoaddAssistant: function () {
    wx.navigateTo({
      url: '/pages/my/wallet/addAssistant/addAssistant',
    })
  },
  // 回到首页
  getbackhomes: function () {
    let that = this;
    wx.switchTab({
      url: '/pages/home2/home2'
    })
  },
  onLoad: function (options) {
    //----判断是否从个人中心过来的 isfromuser=1是 isfromuser!=1否 -----
    if (options.isfromuser == 1) {
      // 是来自个人中心的
      this.setData({
        isfromuser: 1
      })
    } else {
      // 非来自个人中心
      this.setData({
        isfromuser: 0
      })
    }
    //----判断是否从个人中心过来的 end-----
    console.info(walletUtil.appUtils.getUserData())
    let getUserStoreData = walletUtil.appUtils.getUserData().userData;//获取用户店铺信息
    let commonData = walletUtil.appUtils.getUserData().commonData;
    // let onePayFlag = commonData.onePayFlag;//判断是否店员
    console.info("commonData", commonData)
    this.setData({
      baseIcons: iconsUtils.getIcons().baseIcons,
      icons: iconsUtils.getIcons().walletIcons,// console.info("图标", iconsUtils.getIcons().walletIcons);
      getUserStoreData: getUserStoreData,
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.getwalletData();
    //请求店铺列表；
    console.info(this.data.shops)
    // this.initShopSelectItem("",this.data.shops);
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    // 下拉刷新
    wx.stopPullDownRefresh();
    this.getwalletData();
  },
  onReachBottom: function () {

  },
})