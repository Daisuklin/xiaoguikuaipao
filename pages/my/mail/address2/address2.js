// pages/my/mail/address2/address2.js
var app = getApp();
var appUtil = require('../../../../utils/appUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    city: "",
    addr: "",
    latitude: '',
    ongitude: '',
    city1: '',
    save: false,
    saveButton: true,
    forbidden: false,
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
    var addressId = options.addressId;
    console.log(addressId)
    if (addressId == null) {
      this.setData({
        save: false
      })
    } else {
      this.setData({
        save: true,
        saveButton: false
      })
      this.addressList();
    }
  },
  //显示原地址
  addressList() {
    var id = this.options.addressId;
    var disputeNo = appUtil.appUtils.getdisputeNoData();
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().locationUrl + '/' + id,
      method: 'GET',
      data: {
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
          var list = res.data;
          var addressList = list.data;
          console.log(addressList)
          that.setData({
            city: addressList.addr,
            city1: addressList.roomNo,
            name: addressList.contactName,
            phone: addressList.contactNumber,
            longitude: addressList.longitude,
            latitude: addressList.latitude,
            addressList: addressList,
          })
          if (disputeNo == id) {
            that.setData({
              selectivity: true,
              verdict: true
            })
          }
          wx.hideLoading()
        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        }else{
          wx.hideLoading()
          wx.showToast({
            icon: "loading",
            title: '数据加载有误',
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          icon: "loading",
          title: '系统繁忙',
        })
      }
    })
  },

  setName: function (e) {
    console.log(e);
    var name = e.detail.value;
    this.setData({ name: name });
  },
  location(e) {
    console.log(e)
    var city = e.detail.value;
    this.setData({ city: city });
  },
  setPhone: function (e) {
    console.log(e);
    var phone = e.detail.value;
    this.setData({ phone: phone });
  },
  setCity: function (e) {
    console.log(e);
    var city = e.detail.value;
    this.setData({ city: city });
  },
  textAddr: function (e) {
    console.log(e);
    var city1 = e.detail.value;
    this.setData({ city1: city1 });
  },
  location: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success  
        var name = res.name;
        var address = res.address;
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          city: address,
          latitude: latitude,
          longitude: longitude,
        })
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  switch2Change: function (e) {
    console.log(e)
    // console.log('switch2 发生 change 事件，携带值为', e.detail.value);
    var verdict = e.detail.value;
    this.setData({ verdict: verdict });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //修改原地址
  saveButton(e) {
    var id = this.options.addressId;
    var that = this;
    //判断获取的姓名、手机和地址不能为空
    var contactName = that.data.name;
    var contactNumber = that.data.phone;
    var city = that.data.city;
    //手机号码正则表达
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    if (contactName == 0 || contactNumber == 0 || city == 0) {
      wx.showModal({
        title: '提示',
        content: '信息不能为空',
      })
    } else if (!myreg.test(contactNumber)) {
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 1000,
        mask: true,
      });
    } else {
      wx.showLoading({
        title: '修改地址中',
      })
      wx.request({
        url: appUtil.ajaxUrls().modificationUrl + '/' + id,
        method: 'PUT',
        header: {
          "Content-Type": "application/json",//默认值
          'api': 'web',
          'Authorization': appUtil.appUtils.getTokenData(),
        },
        data: {
          "addressId": id,
          "contactName": that.data.name,
          "contactNumber": that.data.phone,
          "city": that.data.city,
          "addr": that.data.city,
          "roomNo": that.data.city1,
          "default": that.data.verdict,
          "loc": [that.data.longitude, that.data.latitude],
        },
        success: function (res) {
          console.log(res)
          if (res.data.succeeded == true) {
            var verdict = that.data.verdict;
            var through = res.data;
            var id = through.data.id;
            console.log(id)
            if (verdict == true) {
              wx.setStorageSync('disputeNo', id)
            } else {
              wx.removeStorageSync('disputeNo')
            }
            wx.hideLoading()
            wx.navigateBack({
            })
          } else if (res.data.error.code == 401) {
            appUtil.appUtils.setShowMessage();
          }  else {
            wx.showToast({
              icon: "loading",
              title: '数据加载有误',
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            icon: "loading",
            title: '系统繁忙',
          })
        }
      })
    }
  },

  //保存新地址
  save: function () {
    var that = this;
    //获取姓名
    var b = that.data.name;
    console.log(b)
    //获取手机号码
    var a = that.data.phone;
    //手机号码正则表达
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    //获取地址
    var c = that.data.city;

    if (b == null || b == 0) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true,
      });
    } else if (a == null || a == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true,
      });
    } else if (!myreg.test(a)) {
      wx.showToast({
        title: '请正确填写手机号码',
        icon: 'loading',
        duration: 1000,
        mask: true,
      });
    } else if (c == 0) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true,
      });
    } else {
      wx.showLoading({
        title: '保存地址中',
      })
      that.setData({
        forbidden: true,
      })
      wx.request({
        url: appUtil.ajaxUrls().addressesUrl, //这里填写你的接口路径
        method: "POST",
        header: { //这里写你借口返回的数据是什么类型，这里就体现了微信小程序的强大，直接给你解析数据，再也不用去寻找各种方法去解析json，xml等数据了
          'api': 'web',
          'Content-Type': 'application/json',
          'Authorization': appUtil.appUtils.getTokenData(),
        },
        data: {//这里写你要请求的参数
          "contactName": that.data.name,
          "contactNumber": that.data.phone,
          "city": that.data.city,
          "addr": that.data.city,
          "roomNo": that.data.city1,
          "default": that.data.verdict,
          "loc": [that.data.longitude, that.data.latitude],
        },
        success: function (res) {
          //这里就是请求成功后，进行一些函数操作
          console.log(res.data);
          var verdict = that.data.verdict;
          var through = res.data;
          if (verdict == true) {
            var id = through.data.id;
            console.log(id)
            // that.setDefaultAdressId(id);
            wx.setStorageSync('disputeNo', id)
          }
          if (res.data.succeeded == true) {
            wx.hideLoading()
            if (that.options.addId == 1) {
              wx.navigateBack({
              })
            } else {
              wx.redirectTo({
                url: 'manage/manage',
              })
            }
          } else if (res.data.error.code == 401) {
            that.setData({
              forbidden: false,
            })
            appUtil.appUtils.setShowMessage();
          } else {
            that.setData({
              forbidden: false,
            })
            wx.hideLoading()
            wx.showToast({
              title: '信息填写有误',
              icon: 'loading',
              duration: 1000,
              mask: true,
            });
          }
        },
        fail: function (res) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '系统繁忙，请稍后再试',
          })
        }
      })
    }
  }
})

