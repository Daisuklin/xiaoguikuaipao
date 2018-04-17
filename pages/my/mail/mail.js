// pages/my/mail/mail.js
var app = getApp();
var appUtil = require('../../../utils/appUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'consent', value: '我同意' },
    ],
    checked: false,
    activeIndex: -1,
    hiddenFlag: true,
    hiddenState: true,
    activeIndexTmp: -2,
    message: '选择物品类型',
    price: 1,
    showMail: true,
    showAddressee: true,
    information: null,
    money: null,
    serve: null,
    weather: null,
    prices: null,
    whether: false,
    festivalFee: false,
    allPay: '0.00',
    totalCharge: '',
    areaCode: '',
    isPrompt: false,
  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  //修改备注信息
  information(e) {
    var that = this;
    var message1 = e.detail.value;
    wx.setStorageSync("optional", message1)
  },

  //封装清空事件
  empty: function () {
    wx.removeStorageSync("optional")
    wx.removeStorageSync("mailId")
    wx.removeStorageSync("addresseeId")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //进来执行清空事件，防止非默认地址的再显现
    if (options.transmitId!=undefined){
      wx.setStorageSync('assignment', '0753')
    }
    this.empty();
  },
  masking() {
    this.setData({ hiddenState: true })
  },
  onReady: function () {

  },

  //点击物品选择类型
  tabClick: function (e) {
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;
    //从本地缓存中同步移除指定 key 
    wx.removeStorageSync('else')
    //获取其他选项中的类型
    var rest = appUtil.appUtils.getelseData();
    if (id == 0) {
      var value = "文件";
      this.setData({
        hiddenFlag: true,
        rest: rest
      });
    }
    if (id == 1) {
      var value = "数码产品";
      this.setData({
        hiddenFlag: true,
        rest: rest
      });
    }
    if (id == 2) {
      var value = "生活用品";
      this.setData({
        hiddenFlag: true,
        rest: rest
      });
    }
    if (id == 3) {
      var value = "服装";
      this.setData({
        hiddenFlag: true,
        rest: rest
      });
    }
    if (id == 4) {
      var value = "食品";
      this.setData({
        hiddenFlag: true,
        rest: rest
      });
    }

    this.setData({
      message: value,
      hiddenState: true,
      activeIndex: e.currentTarget.id,
      activeIndexTmp: e.currentTarget.id,
    });
    if (id == 5) {
      this.setData({
        hiddenState: false,
        hiddenFlag: false
      });
    }
  },
  arrows: function (e) {
    console.log(e);
    var hiddenState = this.data.hiddenState;
    this.setData({ hiddenState: false });
  },

  //点击确认后返回数据个选择类
  uploading: function () {
    //获取缓存中的其他选项信息
    var rest = appUtil.appUtils.getelseData();
    this.setData({
      hiddenState: !false,
      message: rest,
    });
    if (rest == 0 || rest == null) {
      this.setData({
        message: '选择物品类型',
      })
    }
  },

  //点击取消后隐藏其他样式
  cancel: function (e) {
    console.log(e.currentTarget.id)
    wx.removeStorageSync("else")
    var rest = appUtil.appUtils.getelseData()
    this.setData({
      hiddenFlag: true,
      rest: rest,
      activeIndex: e.currentTarget.id,
      activeIndexTmp: e.currentTarget.id,
    })
  },

  //记录下其他中的输入事件
  matter: function (e) {
    var rest = e.detail.value;
    console.log(rest)
    wx.setStorageSync("else", rest)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  IN(res) {
    var that = this;
    var price = parseInt(res.detail.value);
    wx.setStorageSync("quantity", price);
  },
  // 用户不存在弹出对话框
  getShowModalThings:function(){
    console.info("用户不存在弹出")
    wx.showModal({
      // title: '提示',
      content: '用户不存在，请先登录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/newLogin/newLogin',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //跳转到寄件人列表中的友好提示
  sender: function () {
    var that =this;
    wx.showLoading({
      title: '正在跳转中，请稍后',
    })
    var transmitId = this.options.transmitId;//判断是来自何方的入口
    //调用寄件人列表接口
    wx.request({
      url: appUtil.ajaxUrls().addressUrl,
      method: 'GET',
      header: {
        "Content-Type": "application/json",//默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        if (res.data.succeeded == true) {
          if (res.data.data.length != 0) {
            wx.navigateTo({
              url: 'address/manage/manage?transmitId= ' + transmitId,
            })
            wx.hideLoading()
          } else {
            wx.navigateTo({
              url: 'sender/sender',
            })
            wx.hideLoading()
          }
        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        } else if (res.data.error.descript == '用户不存在' || res.data.message.descript == '帐户不存在或者已经被注销'){
          wx.hideLoading()
          // that.getPromptPark('用户不存在');
          that.getShowModalThings();//调用用户不存在的函数
        }
      },
      fail: function (e) { }
    })
  },

  //跳转到收货人列表中的友好提示
  consignee: function () {
    var that = this;
    wx.showLoading({
      title: '正在跳转中，请稍后',
    })
    var transmitId = this.options.transmitId;//判断是来自何方的入口
    //调用收货人列表接口
    wx.request({
      url: appUtil.ajaxUrls().consigneeUrl,
      method: 'GET',
      header: {
        "Content-Type": "application/json",//默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        if (res.data.succeeded == true) {
          if (res.data.data.length != 0) {
            wx.navigateTo({
              url: 'address2/manage/manage?transmitId= ' + transmitId,
            })
            wx.hideLoading()
          } else {
            wx.navigateTo({
              url: 'consignee/consignee',
            })
            wx.hideLoading()
          }
        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        } else if (res.data.error.descript == '用户不存在' || res.data.message.descript == '帐户不存在或者已经被注销') {
          wx.hideLoading()
          // that.getPromptPark('用户不存在');
          that.getShowModalThings();//调用用户不存在的函数
        }
      },
      fail: function (e) { }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取缓存中的赋值
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }

    var assignment = appUtil.appUtils.getassignmentData();
    console.log("--" + assignment)
    if (assignment == '0753') {
      //获取默认的defaultAddress值
      var priority = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
      //提取本地缓存的默认收件人id
      var addresseeId = appUtil.appUtils.getaddresseeIdData();
      //提取本地缓存的默认寄件人id
      var mailId = appUtil.appUtils.getmailIdData();
      if (mailId != 0) {
        this.siteList1();
        this.siteList2();
      } else {
        this.siteList();
        this.siteList2();
      }
    } else {
      this.siteList1();
      this.siteList2();
    }
    this.freight()
    var price = this.data.price;
    wx.setStorageSync("quantity", price);
  },


  //运费
  freight: function () {
    var that = this;
    //提取本地缓存的默认寄件人id
    var mailId = appUtil.appUtils.getmailIdData();
    //提取本地缓存的默认收货人id
    var addresseeId = appUtil.appUtils.getaddresseeIdData();
    //编辑区域码(寄件地址中的areaCode)
    var code = appUtil.appUtils.getregionCodeData();
    //获取缓存中的赋值
    var assignment = appUtil.appUtils.getassignmentData();
    if (mailId != null && addresseeId != 0) {
      wx.request({
        url: appUtil.ajaxUrls().freightUrl,
        method: 'POST',
        data: {
          "areaCode": code,
          "senderAddId": mailId,
          "receiverAddId": addresseeId,
        },
        header: {
          'content-type': 'application/json', // 默认值
          'api': 'web',
          'Authorization': appUtil.appUtils.getTokenData(),
        },
        success: function (res) {
          if (res.data.succeeded == true) {
            var list = res.data;
            var freight = list.data;
            var money = freight.carriageFee;
            that.cost(money);
          } else if (res.data.error.code == 401) {
            appUtil.appUtils.setShowMessage();
          } else if (res.data.error.descript == '用户不存在' || res.data.message.descript == '帐户不存在或者已经被注销') {
            wx.hideLoading()
            // that.getPromptPark('用户不存在');
            that.getShowModalThings();//调用用户不存在的函数
          }else {
            wx.showToast({
              icon: "loading",
              title: res.data.error.descript,
            })
          }
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            icon: "loading",
            title: '系统繁忙',
          })
        }
      })
    }
  },

  //获取夜间服务费和恶劣天气服务费，节假日期间存在的服务费(只存在于节假日期间，平时隐藏)
  cost(money) {
    var that = this;
    //获取区域码(寄件地址中的areaCode)
    var areaCode = appUtil.appUtils.getregionCodeData();
    //发送网络请求
    wx.request({
      url: appUtil.ajaxUrls().areaUrl + '/' + areaCode, //仅为示例，并非真实的接口地址
      method: 'GET',//请求方式
      header: {
        'content-type': 'application/json',// 默认值
        'api': 'web',
        'areaCode': areaCode,//区域码
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.succeeded == true) {
          var serve = res.data.data.nightCharge;
          var weather = res.data.data.weatherCharge;
          var totalCharge = res.data.data.totalCharge;
          var festivalFee = res.data.data.festivalCharge;
          if (serve == 0) {
            that.setData({
              serve: null,//夜间服务费
              weather: weather,//恶劣天气服务费
              festivalFee: festivalFee,//节日服务费
              totalCharge: totalCharge,//夜间+天气+节日==总和
            })
            var allPay = Number(money + that.data.totalCharge).toFixed(2);
            that.setData({
              money: money,
              allPay: allPay,
            })
          } else {
            that.setData({
              serve: serve,//夜间服务费
              weather: weather,//恶劣天气服务费
              festivalFee: festivalFee,//节日服务费
              totalCharge: totalCharge,//夜间+天气+节日==总和
            })
            var allPay = Number(money + that.data.totalCharge).toFixed(2);
            that.setData({
              money: money,
              allPay: allPay,
            })
          }
        } else {
          wx.showToast({
            icon: "loading",
            title: '数据加载有误',
          })
        }
      },
      fail: function () {
        wx.showToast({
          icon: "loading",
          title: '系统繁忙',
        })
      }
    })
  },

  //点击我同意
  checkboxChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var radioChange = e.detail.value;
    this.setData({
      radioChange: radioChange
    })
  },

  //点击问号弹出蒙版提示
  question() {
    this.setData({
      showNight: true
    })
  },
  //点击确定隐藏蒙版提示
  closeServiceFee: function () {
    this.setData({
      showNight: false
    })
  },

  //点击寄件
  subscribe(e) {
    var that = this;
    wx.showLoading({
      title: '提交订单中',
      mask: true
    })
    //监听点击事件
    var estimate = that.data.radioChange;
    //提取本地缓存的默认寄件人id
    var mailId = appUtil.appUtils.getmailIdData();
    //提取本地缓存的默认收件人id
    var addresseeId = appUtil.appUtils.getaddresseeIdData();
    //获取缓存中用户填写的备注信息
    var remark = appUtil.appUtils.getoptionalData();
    //获取缓存中的件数
    var amount = wx.getStorageSync("quantity");
    //编辑区域码(寄件地址中的areaCode)
    var code = appUtil.appUtils.getregionCodeData();
    //夜间服务费
    if (that.data.serve == null) {
      var night = 0;
    } else {
      var night = that.data.serve;
    }
    //天气服务费
    var weather = that.data.weather;
    //节日服务费
    var festival = that.data.festivalFee;
    //夜间服务费+天气服务费+节日服务费
    var prices = that.data.totalCharge;
    //获取种类
    var kind = that.data.message;
    //获取寄件人和收货人的电话
    var telephone = that.data.phone;
    var telephone1 = that.data.contactNumber;
    if (telephone == null || telephone1 == null) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请选择地址',
      })
    } else if (kind == '选择物品类型') {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请选择种类',
      })
    } else if (amount == 0 || amount == null || isNaN(amount)) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请填写寄件数',
      })
    } else if (estimate != 'consent') {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请阅读并同意条款',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              radioChange: 'consent',
              checked: true
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      that.setData({
        whether: true,
      });
      wx.request({
        url: appUtil.ajaxUrls().mailUrl, //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          "sourcePlatform": "wxa",
          "valuation": 0.0,
          "type": "urgent",
          "commoditySize": "small",
          "commodityWeight": null,
          "couponId": null,
          "nightCharge": night,//夜间服务费
          "weatherCharge": weather,//天气服务费
          "festivalCharge": festival,//节日服务费
          "tip": prices,//夜间服务费+天气服务费+节日服务费
          "memo": remark,//备注信息
          "sendAddress": mailId,//寄件人id
          "receiveAddress": addresseeId,//收件人id
          "commodityList": [{
            "count": amount,//件数
            "name": kind,//种类
          }],
          "areaCode": code,//区域码
        },
        header: {
          'content-type': 'application/json', // 默认值
          'api': 'web',
          'Authorization': appUtil.appUtils.getTokenData(),
        },
        success: function (res) {
          console.log(res)
          if (res.data.succeeded == true) {
            console.log('我进来咯')
            var mode = res.data.data.payWay;
            var id = res.data.data.id;//获取订单id
            var totalPrices = res.data.data.totalPrice;//获取总金额
            var transmitId = that.options.transmitId;
            if (mode == "payBalance") {
              that.empty();
              wx.showLoading({
                title: '寄件成功',
              })
              if (that.options.transmitId == 15626199190) {//确定是店铺入口后，做的操作
                setTimeout(function () {
                  wx.hideLoading()
                  wx.navigateBack({
                  })
                }, 1500)
              } else {//否则另行操作
                setTimeout(function () {
                  wx.hideLoading()
                  wx.switchTab({
                    url: '../my',
                  })
                }, 1500)
              }
            } else {
              that.setData({
                whether: false,
              });
              wx.navigateTo({
                url: '/pages/my/payment/payment?id=' + id + '&&totalPrice=' + totalPrices + '&&transmitId=' + transmitId,
              })
            }
          } else if (res.data.error.code == 401) {
            that.setData({
              whether: false,
            });
            appUtil.appUtils.setShowMessage();
          } else if (res.data.error.descript == '用户不存在' || res.data.message.descript == '帐户不存在或者已经被注销') {
            wx.hideLoading()
            // that.getPromptPark('用户不存在');
            that.getShowModalThings();//调用用户不存在的函数
          } else if (res.data.error.descript == "夜间服务费有误，请重新下单") {
            that.setData({
              whether: false,
            });
            wx.showToast({
              icon: "loading",
              title: '请重新下单',
            })
          } else if (res.data.error.descript == "恶劣天气服务费有误，请重新下单") {
            that.setData({
              whether: false,
            });
            wx.showToast({
              image: '../../../image/mail/weather.png',
              title: '请重新下单',
            })
          } else if (res.data.error.descript == "节日服务费有误，请重新下单") {
            that.setData({
              whether: false,
            });
            wx.showToast({
              image: '../../../image/mail/festival.png',
              title: '请重新下单',
            })
          } else if (res.data.error.descript == "寄件人不能跟收件人相同") {
            that.setData({
              whether: false,
            });
            wx.showToast({
              icon: "loading",
              title: '信息不能相同',
            })
          } else {
            wx.showLoading({
              title: res.data.error.descript,
            })
            setTimeout(function () {
              wx.hideLoading()
              that.setData({
                whether: false,
              });
            }, 2000)
          }
        },
        fail: function (res) {
          that.setData({
            whether: false,
          });
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '系统繁忙',
          })
        }
      })
    }
  },


  //设置不能重复提交
  anew() {
    wx.showLoading({
      title: '请勿重新提交',
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  //运费和夜间服务费说明封装
  explain() {
    var that = this;
    //获取区域码(寄件地址中的areaCode)
    var areaCode = appUtil.appUtils.getregionCodeData();
    //发送网络请求
    wx.request({
      url: appUtil.ajaxUrls().areaUrl + '/' + areaCode, //仅为示例，并非真实的接口地址
      method: 'GET',//请求方式
      header: {
        'content-type': 'application/json',// 默认值
        'api': 'web',
        'areaCode': areaCode,//区域码
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.succeeded == true) {
          var carriage = res.data.data.carriageInfo;
          var nightInfo = res.data.data.nightInfo;
          that.setData({
            carriage: carriage,//运费说明
            nightInfo: nightInfo,//夜间服务费说明
          })
        } else {
          wx.showToast({
            icon: "loading",
            title: '费用说明失效',
          })
        }
      },
      fail: function () {
        wx.showToast({
          icon: "loading",
          title: '系统繁忙',
        })
      }
    })
  },

  //勾选默认寄件地址
  siteList() {
    var that = this;
    //获取默认的defaultAddress值
    var priority = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
    wx.setStorageSync("mailId", priority)
    wx.showLoading({
      title: '玩命加载中',
    })
    if (priority != 0) {
      wx.request({
        url: appUtil.ajaxUrls().gainUrl + '/' + priority,
        method: 'GET',
        data: {
          'addressId': priority,
        },
        header: {
          'content-type': 'application/json', // 默认值
          'api': 'web',
          'Authorization': appUtil.appUtils.getTokenData(),
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.succeeded == true) {
            var list = res.data;
            var siteList = list.data;
            var regionCode = siteList.areaCode;
            wx.setStorageSync('regionCode', regionCode)
            that.setData({
              name: siteList.contactName,
              phone: siteList.contactNumber,
              addr: siteList.addr,
              roomNo: siteList.roomNo,
              showMail: false,
              show: true,
            })
            that.explain();
          } else if (res.data.error.code == 401) {
            appUtil.appUtils.setShowMessage();
          } else if (res.data.error.descript == '用户不存在' || res.data.message.descript == '帐户不存在或者已经被注销') {
            wx.hideLoading()
            // that.getPromptPark('用户不存在');
            that.getShowModalThings();//调用用户不存在的函数
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


  //自选默认寄件地址
  siteList1() {
    var that = this;
    //获取初始的寄件id
    var id = that.options.mailId;
    //提取本地缓存
    var mailId = appUtil.appUtils.getmailIdData();
    wx.showLoading({
      title: '玩命加载中',
    })
    if (mailId != 0) {
      wx.request({
        url: appUtil.ajaxUrls().gainUrl + '/' + mailId,
        method: 'GET',
        data: {
          'addressId': mailId,
        },
        header: {
          'content-type': 'application/json', // 默认值
          'api': 'web',
          'Authorization': appUtil.appUtils.getTokenData(),
        },
        success: function (res) {
          console.log(res.data)
          wx.hideLoading()
          if (res.data.succeeded == true) {
            var list = res.data;
            var siteList = list.data;
            var regionCode = siteList.areaCode;
            wx.setStorageSync('regionCode', regionCode)
            that.setData({
              name: siteList.contactName,
              phone: siteList.contactNumber,
              addr: siteList.addr,
              roomNo: siteList.roomNo,
              show: true,
              showMail: false,
            })
            that.explain();
          } else if (res.data.error.code == 401) {
            appUtil.appUtils.setShowMessage();
          } else if (res.data.error.descript == '用户不存在' || res.data.message.descript == '帐户不存在或者已经被注销') {
            wx.hideLoading()
            // that.getPromptPark('用户不存在');
            that.getShowModalThings();//调用用户不存在的函数
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


  //自选默认收货地址
  siteList2() {
    var that = this;
    //获取初始的寄件id
    var id = that.options.mailId;
    //提取本地缓存
    var addresseeId = appUtil.appUtils.getaddresseeIdData();
    wx.showLoading({
      title: '玩命加载中',
    })
    if (addresseeId != 0) {
      wx.request({
        url: appUtil.ajaxUrls().gainUrl + '/' + addresseeId,
        method: 'GET',
        data: {
          'addressId': addresseeId,
        },
        header: {
          'content-type': 'application/json', // 默认值
          'api': 'web',
          'Authorization': appUtil.appUtils.getTokenData(),
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res.data)
          if (res.data.succeeded == true) {
            var list = res.data;
            var siteList = list.data;
            var regionCode = siteList.areaCode;
            that.setData({
              contactName: siteList.contactName,
              contactNumber: siteList.contactNumber,
              addr1: siteList.addr,
              roomNo1: siteList.roomNo,
              show1: true,
              showAddressee: false,
            })
          } else if (res.data.error.code == 401) {
            appUtil.appUtils.setShowMessage();
          } else if (res.data.error.descript == '用户不存在' || res.data.message.descript == '帐户不存在或者已经被注销') {
            wx.hideLoading()
            // that.getPromptPark('用户不存在');
            that.getShowModalThings();//调用用户不存在的函数
          }else {
            wx.showToast({
              icon: "loading",
              title: res.data.error.descript,
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
  deed: function () {
    wx.navigateTo({
      url: 'contract/contract',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
