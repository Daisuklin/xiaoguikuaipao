// pages/my/collectList/collectList.js
var app = getApp();
var appUtil = require('../../../utils/appUtil.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    subscript: false,
    subscript1: true,
    isChecked: true,
    isChecked1: true,
    trade: false,
    appear: true,
    trade: false,
    trade1: true,
    judge: true,
  },
  store() {
    this.setData({ subscript: false, })
    this.setData({ subscript1: true, })
    this.setData({ isChecked: true, })
    this.setData({ isChecked1: true, })
    this.setData({ appear: true, })
    this.setData({ trade: false, })
    this.setData({ trade1: true, })
  },
  merchant() {
    this.setData({ subscript1: false, })
    this.setData({ isChecked1: false, })
    this.setData({ subscript: true, })
    this.setData({ isChecked: false, })
    this.setData({ appear: false, })
    this.setData({ trade: true, })
    this.setData({ trade1: false, })
  },
  exchange(e) {
    console.log(e)
    var id = e.currentTarget.id;
    console.log(id)
    var num = parseInt(id);
    console.log(num)
    this.setData({ exchange: id })
  },

  eliminate() {
    this.setData({
      exchange: '',
      exchange2: '',
      judge: ''
    })
  },
  exchange2(e) {
    console.log(e)
    var id = e.currentTarget.id;
    console.log(id)
    var num = parseInt(id);
    console.log(num)
    this.setData({ exchange2: id, })
    this.setData({ judge: id, })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //商品列表(支持下拉操作)
  commodityList() {
    var that = this;
    wx.showLoading({
      title: '获取数据中',
    })
    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })
    wx.request({
      url: appUtil.ajaxUrls().commodityUrl, //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        'member_id': appUtil.appUtils.getMemberIdData().memberData.member_id,
        'pageIndex': 1,
        'longitude': 0,
        'latitude': 0,
      },
      header: {
        'content-type': 'application/json',// 默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.succeeded == true) {
          var list = res.data;
          var commodityList = list.data;
          that.setData({
            allGoodsLen: res.data.data.length,
            commodityList: commodityList,
            hiddenLoading: !that.data.hiddenLoading
          });
          console.log(res.data)
          that.emptyData()
        }
      },
      fail: function (e) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        var toastText = '获取数据失败' + JSON.stringify(e);
        that.setData({
          hiddenLoading: !that.data.hiddenLoading
        });
      },
      complete: function () {
        // complete 
      }
    })
  },

  //商品列表(支持上拉加载操作)
  commodityListUp() {
    var that = this;
    wx.showLoading({
      title: '获取数据中',
    })
    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })
    var commodityIndex = wx.getStorageSync("commodityIndex");
    if (commodityIndex == '') {
      commodityIndex = 2;
      wx.setStorageSync("commodityIndex", commodityIndex);
    } else {
      commodityIndex = parseInt(commodityIndex) + 1;
      wx.setStorageSync("commodityIndex", commodityIndex);
    }
    wx.request({
      url: appUtil.ajaxUrls().commodityUrl, //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        'member_id': appUtil.appUtils.getMemberIdData().memberData.member_id,
        'pageIndex': commodityIndex,
        'longitude': 0,
        'latitude': 0,
      },
      header: {
        'content-type': 'application/json',// 默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log("得到商品加载的页数" + commodityIndex);
        wx.hideLoading();
        var list = res.data;
        var commodityList = list.data;
        if (res.data.message.type == "success") {
          var commodityList = that.data.commodityList;
          for (var i = 0; i < res.data.data.length; i++) {
            commodityList.push(res.data.data[i]);
          }
          that.setData({
            allGoodsLen: res.data.data.length,
            commodityList: commodityList
          })
        }
      },
      fail: function (e) {
        wx.hideLoading();
        var toastText = '获取数据失败' + JSON.stringify(e);
        that.setData({
          hiddenLoading: !that.data.hiddenLoading
        });
      },
      complete: function () {
        // complete 
      }
    })
  },


  //点击跳转对应的商品
  checkGoods(e) {//去店铺
    console.log(e)
    var id = e.currentTarget.id;
    console.log(id)
    if (this.data.exchange2 == id) {
      this.setData({
        exchange2: !id,
        judge: !id
      })
    } else {
      wx.navigateTo({//保留当前页
        url: '/pages/detail/goodsdetail?goodId=' + id,//商品详情
      })
    }
  },
  //取消收藏商品
  exchange3(e) {
    var id = e.currentTarget.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消该收藏',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          var commodityList = that.data.commodityList;
          var index = -1;
          for (var i in commodityList) {
            var Id = commodityList[i].goods_id;
            var store_id = commodityList[i].store_id;
            if (Id == id) {
              index = i;
              break;
            }
          }
          commodityList.splice(index, 1);
          that.setData({ commodityList: commodityList });
          wx.request({
            url: appUtil.ajaxUrls().cancelUrl,
            method: 'POST',
            data: {
              "memberId": appUtil.appUtils.getMemberIdData().memberData.member_id,
              "store_id": store_id,
              "goodsId": Id,
              //  appUtil.appUtils.getMemberIdData().memberData.member_id
            },
            header: {
              "Content-Type": "application/json",//默认值
              'api': 'web',
              'Authorization': appUtil.appUtils.getTokenData(),
            },
            success: function (res) {
              console.log(res)
              if (res.data.succeeded == true) {
              } else if (res.data.error.code == 401) {
                appUtil.appUtils.setShowMessage();
              }
            }
          })
          console.log('删除成功')
        }
      }
    })
  },

  // 店铺列表(支持下拉操作)
  storeList() {
    var that = this;
    wx.showLoading({
      title: '获取数据中',
    })
    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })
    wx.request({
      url: appUtil.ajaxUrls().storeUrl, //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        "pageIndex": 1,
        "memberId": appUtil.appUtils.getMemberIdData().memberData.member_id,
      },
      header: {
        'content-type': 'application/json',// 默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log("我是你老豆啊，亲")
        console.log(res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.succeeded == true) {
          var list = res.data;
          var storeList = list.data;
          that.setData({
            allStoreLen: res.data.data.length,
            storeList: storeList,
            hiddenLoading: !that.data.hiddenLoading
          });
          console.log(storeList)
          that.emptyData()
        }
      },
      fail: function (e) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        var toastText = '获取数据失败' + JSON.stringify(e);
        that.setData({
          hiddenLoading: !that.data.hiddenLoading
        });
      },
      complete: function () {
        // complete 
      }
    })
  },

  // 店铺列表(支持上拉加载操作)
  storeListUp() {
    var that = this;
    wx.showLoading({
      title: '获取数据中',
    })
    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })
    var storeIndex = wx.getStorageSync("storeIndex");
    if (storeIndex == '') {
      storeIndex = 2;
      wx.setStorageSync("storeIndex", storeIndex);
    } else {
      storeIndex = parseInt(storeIndex) + 1;
      wx.setStorageSync("storeIndex", storeIndex);
    }
    wx.request({
      url: appUtil.ajaxUrls().storeUrl, //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        "pageIndex": storeIndex,
        "memberId": appUtil.appUtils.getMemberIdData().memberData.member_id,
      },
      header: {
        'content-type': 'application/json',// 默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log("得到店铺加载的页数" + storeIndex);
        wx.hideLoading();
        var list = res.data;
        var storeList = list.data;
        if (res.data.message.type == "success") {
          var storeList = that.data.storeList;
          that.setData({});
          for (var i = 0; i < res.data.data.length; i++) {
            storeList.push(res.data.data[i]);
          }
          that.setData({
            allStoreLen: res.data.data.length,
            storeList: storeList
          })
        }
      },
      fail: function (e) {
        wx.hideLoading();
        var toastText = '获取数据失败' + JSON.stringify(e);
        that.setData({
          hiddenLoading: !that.data.hiddenLoading
        });
      },
      complete: function () {
        // complete 
      }
    })
  },

  //点击跳转对应的店铺
  checkStore(e) {//去店铺
    console.log(e)
    var id = e.currentTarget.id;
    var that = this;
    if (that.data.exchange == id) {
      that.setData({
        exchange: !id
      })
    } else {
      var showType = e.currentTarget.dataset.shoptype;
      var transmitId = that.options.transmitId;
      console.log(transmitId)
      console.log(showType)
      if (transmitId == 15626199190) {//得到来自店铺级的入口，做的操作
        if (showType == 2) {
          if (getCurrentPages().length <= 7) {
            wx.navigateTo({//跳转
              url: '/pages/store/index?isAgin=0&storeId=' + id,//商超类型上下
            })
          } else {
            wx.reLaunch({//保留当前页
              url: '/pages/store/index?isAgin=0&storeId=' + id,//商超类型上下
            })

          }
        } else {
          if (getCurrentPages().length <= 7) {
            wx.navigateTo({//跳转
              url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + id,//美食等类型左右
            })
          } else {
            wx.reLaunch({//保留当前页
              url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + id,//美食等类型左右
            })
          }

        }
      } else {
        if (showType == 2) {
          if (getCurrentPages().length <= 2) {
            wx.navigateTo({//跳转
              url: '/pages/store/index?isAgin=0&storeId=' + id,//商超类型上下
            })
          } else {
            wx.reLaunch({//保留当前页
              url: '/pages/store/index?isAgin=0&storeId=' + id,//商超类型上下
            })

          }
        } else {
          if (getCurrentPages().length <= 2) {
            wx.navigateTo({//跳转
              url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + id,//美食等类型左右
            })
          } else {
            wx.reLaunch({//保留当前页
              url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + id,//美食等类型左右
            })
          }
        }
      }
    }
  },
  //取消收藏店铺
  vanish(e) {
    var id = e.currentTarget.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消该收藏',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          var storeList = that.data.storeList;
          var index = -1;
          for (var i in storeList) {
            var Id = storeList[i].store_id;
            var member_id = storeList[i].member_id;
            if (Id == id) {
              index = i;
              break;
            }
          }
          storeList.splice(index, 1);
          that.setData({ storeList: storeList });
          wx.request({
            url: appUtil.ajaxUrls().deleteUrl,
            method: 'POST',
            data: {
              "memberId": appUtil.appUtils.getMemberIdData().memberData.member_id,
              "focusonState": false,
              "liveMemberId": member_id,
            },
            header: {
              "Content-Type": "application/json",//默认值
              'api': 'web',
              'Authorization': appUtil.appUtils.getTokenData(),
            },
            success: function (res) {
              console.log(res)
              if (res.data.succeeded == true) {
              } else if (res.data.error.code == 401) {
                appUtil.appUtils.setShowMessage();
              }
            }
          })
          console.log('删除成功')
        }
      }
    })
  },

  //必须清的数据
  emptyData: function () {
    wx.removeStorageSync("commodityIndex");
    wx.removeStorageSync("storeIndex");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.emptyData()
    this.commodityList()
    this.storeList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    this.storeList()
    this.commodityList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触发了");
    if (this.data.allStoreLen == 12) {
      this.storeListUp()//店铺上拉操作
    } else {
      wx.showToast({
        icon: "loading",
        title: '没有更多啦',
      })
    }
    if (this.data.allGoodsLen == 12) {
      this.commodityListUp()//商品上拉操作
    } else {
      wx.showToast({
        icon: "loading",
        title: '没有更多啦',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})