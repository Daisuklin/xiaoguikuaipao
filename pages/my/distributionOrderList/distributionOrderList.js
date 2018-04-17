var appUtil = require('../../../utils/appUtil.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLastPage: false,
    showLoading: true,
    hiddenLoading: false,
    pageInfo: {
      type: "all",
      pageIndex: 1
    },
    orderList: {}
  },
  getOrderItem:function(){
    var _orderItem={
      shopName: null,//店铺名称
      orderId: null,//寄件号
      orderTypeStr: null,//寄件类型  eleme urgent meituan
      createdAt: null,//创建时间
      fromAddress: null,//寄件发货地址
      toAddress: null,//寄件收货地址
      itemType: null,//寄件号
      itemState: null,//完成类型
      itemSN: null,//寄件号
      isMySendOrder: 0 //0:寄件 1：收件 2：送件
    }
    return _orderItem;
  },
  discolor: function (e) {
    wx.showToast({
      icon: "loading", title: "加载中...", mask: true,
    })
    console.info(JSON.stringify(e))
    this.setData({
      isLastPage: false,
      pageInfo: {
        type: e.currentTarget.dataset.type,
        pageIndex: 1
      },
      orderList: {}
    })
    this.loadList()
  },
  loadList: function () {
    var that = this;
    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })

    appUtil.controllerUtil.DistributionOrderList(this.data.pageInfo, function (res) {
      if ("undefined" != typeof (res.data.error) && null != res.data.error && res.data.error.descript == '用户token异常') {
        wx.showModal({
          title: "登录异常",
          content: res.data.error.descript + "请重新登录!",
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/newLogin/newLogin',
              })
            }

          }
        })
        return;
      }
      var list = res.data;
      var userInfo = wx.getStorageSync("blackUserInfo");
      var thisOrderList = ("undefined" == typeof (list.data) || null == list.data) ? new Array() : list.data;
      var orderList=new Array();
      for (var i = 0; (thisOrderList != null && i < thisOrderList.length); i++) {
        var orderItem = new Object();
        orderItem = that.getOrderItem();
        orderItem.orderId = thisOrderList[i].id;
        console.info(thisOrderList[i].type)
        orderItem.shopName = thisOrderList[i].shopInfo!=null?thisOrderList[i].shopInfo.shopName:"";
        orderItem.orderTypeStr = thisOrderList[i].type;
        orderItem.createdAt = util.formatTime(new Date(thisOrderList[i].createdAt));
        orderItem.fromAddress = thisOrderList[i].sendAddressDetail.addr;
        orderItem.toAddress = thisOrderList[i].receiveAddressDetail.addr;
        orderItem.itemType = thisOrderList[i].type;

        thisOrderList[i].status.forEach(function (statu) {
          if (thisOrderList[i].state == statu.state) {
            orderItem.itemState= statu.name;
          }
        })
        if (thisOrderList[i].sendUserId == userInfo.userData.id) {
          orderItem.isMySendOrder = 0; 
        } else if (thisOrderList[i].acceptUserId == userInfo.userData.id){
          orderItem.isMySendOrder = 2; 
        }else{
          orderItem.isMySendOrder = 1; 
        }
       
        if (thisOrderList[i].type=="meituan"){
          orderItem.itemSN = thisOrderList[i].extInfo.daySeq;
          
        } else if (thisOrderList[i].type == "eleme"){
          orderItem.itemSN = thisOrderList[i].extInfo.daySn;
        }else{
          orderItem.itemSN = thisOrderList[i].shopInfo != null ?thisOrderList[i].shopInfo.daySeq:"";
        }
        orderList.push(orderItem)
      }
      that.setData({
        orderList: orderList,
        hiddenLoading: !that.data.hiddenLoading
      });
      wx.stopPullDownRefresh();
      wx.hideToast();
    }, function (e) {
      wx.stopPullDownRefresh();
      var toastText = '获取数据失败' + JSON.stringify(e);
      that.setData({
        hiddenLoading: !that.data.hiddenLoading
      });
      wx.showToast({
        title: toastText,
        icon: "loading",
        duration: 2000
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      mask: true, icon: "loading", title: "加载中..."
    })
    var thisPage = this;
    this.loadList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var thisPage=this;
    thisPage.data.pageInfo.pageIndex = 1
    this.loadList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: "loading",
      mask: true,
    })
    var thisPage = this;
    thisPage.data.isLastPage = false;
    thisPage.data.pageInfo.pageIndex = 1
    thisPage.loadList();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var thisPage = this;
    setTimeout(function () {
      if (thisPage.data.isLastPage != true) {
        wx.showToast({
          title: '加载中...',
          icon: "loading",
          mask: true,
        })
        thisPage.data.isLastPage = true;

        thisPage.data.pageInfo.pageIndex = thisPage.data.pageInfo.pageIndex + 1
        thisPage.loadListFun(function (res) {
          var list = res.data;
          var orderList = ("undefined" == list.data || null == list.data) ? [] : list.data;
          thisPage.addNextPageOrderToOrderList(orderList)
        })
      }
    }, 500)
  },
  loadListFun: function (callBack) {
    var thisPage = this;
    // console.info("thisPage.data.pageInfo" + JSON.stringify(thisPage.data.pageInfo))  
    appUtil.controllerUtil.DistributionOrderList(thisPage.data.pageInfo, function (res) {
      callBack(res)
    })

  }
  ,
  addNextPageOrderToOrderList: function (nextPageOrderPage) {
    var that = this;
    var orderList = this.data.orderList;
    nextPageOrderPage.forEach(function (t) {
      that.data.isLastPage = false;
      var orderItem = new Object();
      orderItem = that.getOrderItem();
      orderItem.orderId = t.id;
      console.info(t.type)
      orderItem.orderTypeStr = t.type;
      orderItem.createdAt = util.formatTime(new Date(t.createdAt));
      orderItem.fromAddress = t.sendAddressDetail.addr;
      orderItem.toAddress = t.receiveAddressDetail.addr;
      orderItem.itemType = t.type;

      t.status.forEach(function (statu) {
        if (t.state == statu.state) {
          orderItem.itemState = statu.name;
        }
      })
      if (t.type == "meituan") {
        orderItem.itemSN = t.extInfo.daySeq;
      } else if (t.type == "eleme") {
        orderItem.itemSN = t.extInfo.daySn;
      } else {
        orderItem.itemSN = null;
      }
      orderList.push(orderItem)
    });

    this.setData({
      orderList: orderList
    })
    setTimeout(function () {
      wx.hideToast();
    }, 2000);

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toOrderList: function () {
    wx.redirectTo({
      url: "/pages/my/orderList/orderList",
    })
  }
  ,
  toDistributionOrderDetail: function (e) {
   
    wx.navigateTo({
      url: "/pages/my/distributionOrderDetail/distributionOrderDetail?id=" + e.currentTarget.id,
    })
  }
  , toIndex: function () {
    wx.switchTab({
      url: "/pages/home2/home2",
    })
  }
})