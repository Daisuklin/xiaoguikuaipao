// pages/my/site/site.js
var app = getApp();
var appUtil = require('../../../utils/appUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: false,
    defaultManageList: null,
  },


  //编辑地址
  compile(e) {
    var value = this.options.transmitId;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: 'address3/address3?addressId=' + id + '&&transmitId=' + value,
    })
  },

  //判断来自确认订单的入口，做跳转操作以及返回id
  goNavigateBack: function (e) {
    console.log(e)
    var a = this.options.transmitId;
    var items = e.currentTarget.dataset.items;
    // console.log(a)
    if (a == 15626199190) {//来自确认订单的入口，做跳转处理
      var defaltId = items.id;
      wx.setStorageSync("defaltId", defaltId);//将id储存到本地
      wx.setStorageSync("addressVal", items);//将id储存到本地
      wx.navigateBack();//返回上一级
    } else {//来自总地址列表的入口
    }
  },

  //删除处理
  cancel(e) {
    var id = e.currentTarget.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除该地址',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          var manageList = that.data.manageList;
          var index = -1;
          for (var i in manageList) {
            if (manageList[i].id == id) {
              index = i;
              break;
            }
          }
          manageList.splice(index, 1);
          that.setData({ manageList: manageList });
          wx.request({
            url: appUtil.ajaxUrls().removeUrl + "/" + id,
            method: 'DELETE',
            bata: {
              "addressId": id,
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

  //监听默认地址状态(封装的函数)
  getDefaultAdressId: function () {//获取默认地址id
    var blackUserInfo = wx.getStorageSync("blackUserInfo");
    return blackUserInfo.userData.defaultAddress
  },
  setDefaultAdressId: function (defaultId) {//传你要改的默认的id进来，就可以改掉默认的ID
    var blackUserInfo = wx.getStorageSync("blackUserInfo");
    console.log(blackUserInfo.userData.defaultAddress);//
    blackUserInfo.userData.defaultAddress = defaultId;
    wx.setStorageSync("blackUserInfo", blackUserInfo);
  },


  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {

  },

  //第一次进入的默认态封装
  defaultState: function () {
    var that = this;
    console.log(appUtil.appUtils.getmakeJudgData());;
    //获取用户的defaultAddress
    console.log(appUtil.appUtils.getMemberIdData().userData.defaultAddress);
    var id = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
    wx.setStorageSync("dispute", id)
    var num = parseInt(id);
    console.log(num)
    var tmpId = this.data.tmpId;
    console.log(this.data.tmpId)
    if (tmpId == num) {
      num = -1;
    }
    that.setData({ isChecked: id })
  },

  //列表渲染
  manageList: function () {
    var that = this;
    //获取缓存中的判断
    var dispute = appUtil.appUtils.getdisputeData();
    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })
    var url = appUtil.ajaxUrls().alwaysUrl;
    that.setData({
      url: url
    });
    wx.showLoading({
      title: '正在更新地址总列表',
    })
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json",//默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.succeeded == true){

        } else if (res.data.error.code == 401) {
          that.setData({
            manageList: [],
            defaultManageList: [],
            hiddenLoading: !that.data.hiddenLoading
          });
          wx.hideLoading();
          wx.showModal({
            title: '登陆异常',
            content: '请重新登陆！',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/newLogin/newLogin',
                })
              } else if (res.cancel) {
                wx.removeStorageSync("unionid");
                wx.removeStorageSync("token");
                wx.removeStorageSync("blackUserInfo");
                wx.removeStorageSync("encryptedData");
                wx.removeStorageSync("userInfo");
                wx.removeStorageSync("optional")
                wx.removeStorageSync("mailId")
                wx.removeStorageSync("addresseeId")
                wx.navigateBack({

                })
                return false;
              }
            }
          })
          return false;
        }
        var list = res.data;
        var manageList = list.data;
        console.log(manageList)
        wx.hideLoading()
        for (var i = 0; i < manageList.length; i++) {
          manageList[i].check = false;
        }
        that.setData({
          manageList: manageList,
          defaultManageList: manageList,
          hiddenLoading: !that.data.hiddenLoading
        });
        if (dispute == 0) {
          that.setData({
            isChecked: 0
          })
        }
        if (appUtil.appUtils.getMemberIdData().userData.defaultAddress != null) {
          that.defaultState()
        }
      },
      fail: function (e) {
        var toastText = '获取数据失败' + JSON.stringify(e);
        that.setData({
          hiddenLoading: !that.data.hiddenLoading
        });
        wx.showToast({
          title: toastText,
          icon: '',
          duration: 2000
        })
      },
      complete: function () {
        // complete 
      }
    });
  },

  //点击勾选默认地址
  site(e) {
    console.log(e)
    var id = e.currentTarget.id;
    console.log(id)
    var num = parseInt(id);
    console.log(num)
    var tmpId = this.data.tmpId;
    console.log(this.data.tmpId)
    if (tmpId == num) {
      num = -1;
    }
    this.setData({ isChecked: id })

    // //修改默认地址id
    this.setDefaultAdressId(id);
    this.information()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  SearchView: function (res) {
    var thisPage = this;
    this.setData({
      manageList: this.data.defaultManageList
    })
    var cursor = res.detail.cursor
    if (cursor == 0) {
      this.setData({ icon: false })
    } else {
      this.setData({ icon: true })
    }
    //搜索引擎
    var manageList = this.data.manageList;
    console.info(JSON.stringify(manageList))
    var newArray = new Array();
    manageList.forEach(function (message) {
      if (message.addr.indexOf(res.detail.value) >= 0 || message.contactNumber.indexOf(res.detail.value) >= 0 || message.contactName.indexOf(res.detail.value) >= 0) {
        newArray.push(message);
      }
      thisPage.setData({
        manageList: newArray
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.manageList();
    this.defaultState();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  //设置默认地址
  information() {
    var id = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().defaultUrl + '/' + id,
      method: 'POST',
      data: {
        "addressId": id,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.succeeded == true) {
        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        }
      }
    })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.manageList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  //新增地址跳转
  management() {
    var value = this.options.transmitId;
    wx.redirectTo({
      url: 'address3/address3?transmitId=' + value,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})