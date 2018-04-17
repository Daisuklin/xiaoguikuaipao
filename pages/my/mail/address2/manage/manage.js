// pages/my/mail/address2/manage/manage.js
var app = getApp();
var appUtil = require('../../../../../utils/appUtil.js');
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
    var id = e.currentTarget.id;
    wx.navigateTo({
     url: '../address2?addressId=' + id,
    })
  },

  //删除地址
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
            data:{
              "addressId":id,
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
    if (appUtil.appUtils.getMemberIdData().userData.defaultAddress != null) {
      var id = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
      wx.setStorageSync("disputeNo", id)
      var num = parseInt(id);
      console.log(num)
      var tmpId = this.data.tmpId;
      console.log(this.data.tmpId)
      if (tmpId == num) {
        num = -1;
      }
      that.setData({ isChecked: id })
    }
  },



//收货人列表
  manageList: function () {
    var that = this;
    //获取缓存中的判断
    var disputeNo = appUtil.appUtils.getdisputeNoData();

    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })
    var url = appUtil.ajaxUrls().consigneeUrl;
    that.setData({
      url: url
    });
    wx.showLoading({
      title: '正在更新收货地址',
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
        console.log(res.data.succeeded)
        if (res.data.succeeded == true){
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
          if (disputeNo == 0) {
            that.setData({
              isChecked: 0
            })
          }
          if (appUtil.appUtils.getMemberIdData().userData.defaultAddress != null) {
            that.defaultState()
          }
        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        }else{
          wx.showToast({
            icon: "loading",
            title: '数据获取失败',
          })
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
  site(e) {
    console.log(e)
    var id = e.currentTarget.id;
    wx.setStorageSync("disputeNo", id)
    console.log(id)
    var num = parseInt(id);
    console.log(num)
    var tmpId = this.data.tmpId;
    console.log(this.data.tmpId)
    if (tmpId == num) {
      num = -1;
    }
    this.setData({ isChecked: id })

     //修改默认地址id
    //this.setDefaultAdressId(id);
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
  management() {
    wx.navigateTo({
      url: '../address2?addId= 1',
    })
  },
  jump(e) {
    var mailId = e.currentTarget.id;
    //保存至本地缓存
    wx.setStorageSync('addresseeId', mailId);
    var length = getCurrentPages().length;
    if (this.options.transmitId == 15626199190) {//来自店铺的入口
      if (length <= 7) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.navigateBack({
          delta: 2
        })
      }
    }else{
      if (length == 3) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.navigateBack({
          delta: 2
        })
      }
    }
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