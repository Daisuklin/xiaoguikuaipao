// pages/my/order/orderDetail/orderDetail.js
var appUtil = require("../../../../utils/appUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPrompt: false,
    promptTitle: '请输入地址信息',
    icon: {
      order_top: '../../../../image/detail/order_bot@2x.png',
      order_bot: '../../../../image/detail/order_top@2x.png',
      icon_appoint: '../../../../image/detail/icon_appoint.png',//指定时间图标
      icon_Distri_state0: '../../../../image/detail/order_status_not_access.png',//未接单
      icon_Distri_state1: '../../../../image/detail/order_status_access.png',//备货中
      icon_Distri_state5: '../../../../image/detail/order_status_access2.png',//备货完成
      icon_Distri_state2: '../../../../image/detail/order_status_quhuo.png',//取货中
      icon_Distri_state3: '../../../../image/detail/order_status_peisong.png',//配送中
      icon_Distri_state4: '../../../../image/detail/order_status_end.png',//配送完成
      icon_store_call: '../../../../image/detail/NewOrder_07@2x.png',//商家电话,
      icon_store_mas: '../../../../image/detail/NewOrder_08@2x.png',//商家电话,
      icon_qusition: '../../../../image/detail/nightfee@2x.png',//夜间服务费
      icon_xing: '../../../../image/detail/xing1.png',
      order_success: '../../../../image/detail/order_suc2.png',
      order_fail: '../../../../image/detail/order_suc1.png',
      order_peisong: '../../../../image/detail/peisong.png',
      storetop: '../../../../image/detail/store.png'

    },
    refundReasonInfo: {
      isShow: false,
      title: "退款",
      reasonMessage: "",
      reasonList: [{}, {}]
    },
    refundDialogBox: {//公共自定义对话框
      dialogTitle: '',
      isDialogShow: false,
      getSubmitEvent: '',
      getCancelDialog: 'getCancelDialog'
    },
    // isDialogShow:false,
  },
  // 弹窗之提示信息
  getParkse: function (txts) {
    var selfpages = this;
    selfpages.setData({ isPrompt: !selfpages.data.isPrompt, promptTit: txts })
    setTimeout(function () {
      selfpages.setData({ isPrompt: !selfpages.data.isPrompt })
    }, 2000)
  },

  // 订单操作事件begin
  contactBusinesses: function () {//联系商家
    console.log(this.data.extend_store.store_phone)
    wx.makePhoneCall({
      phoneNumber: this.data.extend_store.store_phone //仅为示例，并非真实的电话号码
    })
  },
  getDistributor: function () {//联系配送员
    console.log(this.data.orderDetail.extend_logistics.mobile)
    wx.makePhoneCall({
      phoneNumber: this.data.orderDetail.extend_logistics.mobile//仅为示例，并非真实的电话号码
    })
  },
  todoReminder: function () {//催单
    var that = this;
    appUtil.controllerUtil.toDoUrgeOrder({
      order_id: this.data.orderDetail.order_id
    }, function (res) {
      if (res.data.succeeded == true) {
        that.getParkse('催单成功');
      } else {
        that.getParkse(res.data.message.descript);
      }
      console.log(res.data);
    })
  },
  // ********************退款、退货 begin*************************
  //单选按钮
  reasonChange: function (e) {
    var that = this;
    this.data.refundReasonInfo.reasonList.forEach(function (reason) {
      if (e.detail.value == reason.reason_id) {
        var reason_info = reason.reason_info;
        console.log(reason_info)
        reason.checked = true;
        that.setData({
          reason_info: reason_info,//选中的理由
        })
      } else {
        reason.checked = false;
      }
    })
    // this.setData({
    //   reason_id: e.detail.value
    // })
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  textareaBindInput: function (e) {//textArea输入值
    this.setData({
      reasonMessage: e.detail.value
    })
    console.log(e.detail.value)
  },
  closeReasonInfoBox: function (e) {//关闭申请弹窗
    this.setData({
      refundReasonInfo: {
        isShow: !this.data.refundReasonInfo.isShow,
      }
    })
  },
  gotoApplyForRefund: function () {//申请退款原因
    console.log("去自提的待验货的页面")
    var thisPage = this;
    //申请退款  李欧

    thisPage.setData({
      refundDialogBox: {//公共自定义对话框
        isDialogShow: true,//弹出自定义对话框
        dialogTitle: '是否确认申请退款！',//自定义对话框标题
        getSubmitEvent: 'getconfirmApplyForRefund',//确认退款事件
        getCancelDialog: 'getCancelDialog',//取消按钮
      },
    })
  },
  // 自定义弹窗之确认退款事件
  getconfirmApplyForRefund: function () {
    console.log("自定义弹窗之确认退款事件")
    var thisPage = this;
    var i = 1;
    thisPage.getCancelDialog();//关闭自定义对话框
    appUtil.controllerUtil.getSelectRefundMoneyReason(function (res) {
      console.log("*************getSelectRefundMoneyReason*************")
      console.log(res.data)
      res.data.data.forEach(function (reason) {
        reason.checked = (i == 0 ? true : false);
        i++;
      })
      thisPage.setData({
        refundReasonInfo: {
          isShow: !thisPage.data.refundReasonInfo.isShow,
          title: "退款",
          reasonList: res.data.data
        }
      })

      setTimeout(function () {
        thisPage.setData({
          reasonMessage: ""
        })
      }, 500)

    });
  },
  // 退货************************
  getSelectRefund: function () {//申请退货原因
    console.log("去自提的待验货的页面")
    var thisPage = this;
    //申请退货
    thisPage.setData({
      refundDialogBox: {//公共自定义对话框
        isDialogShow: true,//弹出自定义对话框
        dialogTitle: '是否确认申请退货！',//自定义对话框标题
        getSubmitEvent: 'getconfirmSelectRefund',//确认退款事件
        getCancelDialog: 'getCancelDialog',//取消按钮
      }

    })
  },
  // 自定义弹窗之确认退货事件
  getconfirmSelectRefund: function () {
    var thisPage = this;
    var i = 1;
    thisPage.getCancelDialog();//关闭自定义对话框
    appUtil.controllerUtil.getSelectRefundReason(function (res) {
      console.log("*************getSelectRefundReason*************")
      console.log(res.data)
      res.data.data.forEach(function (reason) {
        reason.checked = (i == 0 ? true : false);
        i++;
      })
      thisPage.setData({
        refundReasonInfo: {
          isShow: !thisPage.data.refundReasonInfo.isShow,
          title: "退货",
          reasonList: res.data.data
        }
      })

      setTimeout(function () {
        thisPage.setData({
          reasonMessage: ""
        })
      }, 500)

    });
  },
  // 退款、退货操作
  submitReasonInfo: function () {
    console.log("退款操作")
    var that = this;
    if (typeof (this.data.reason_info) == 'undefined') {
      var reasonId = '';
    } else {
      var reasonId = this.data.reason_info;
    }
    if (this.data.reasonMessage == '') {
      var reasonMes = '';
    } else {
      var reasonMes = this.data.reasonMessage;
    }

    if (typeof (this.data.reason_info) != 'undefined' || this.data.reasonMessage != '') {
      //评论不为空
      if (this.data.refundReasonInfo.title == '退款') {
        //退款操作
        console.log(this.data.refundReasonInfo.title)
        appUtil.controllerUtil.insertorderRefund({
          order_id: this.data.orderDetail.order_id,
          reason_info: reasonId + "," + reasonMes
        }, function (res) {
          if (res.data.succeeded == true) {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 2000
            })
            that.closeReasonInfoBox();
            wx.redirectTo({
              url: '/pages/my/orderList/orderList',
            })
            //that.getParkse(data.data.message.descript);//提示信息
          } else {
            //申请退款失败
            console.log("申请退款失败")
            console.log(res.data)
            if (typeof (res.data.message) == 'undefined') {
              that.getParkse(res.data.errorMesg);//提示信息
              that.closeReasonInfoBox();
            }
            that.getParkse(res.data.message.descript);//提示信息
            that.closeReasonInfoBox();
          }

        })
      } else if (this.data.refundReasonInfo.title == '退货') {
        //退货操作
        console.log(this.data.refundReasonInfo.title)
        appUtil.controllerUtil.getinsertBuyerReturns({
          order_id: this.data.orderDetail.order_id,
          reason_info: reasonId + "," + reasonMes
        }, function (res) {
          if (res.data.succeeded == true) {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 2000
            })
            that.closeReasonInfoBox();
            wx.redirectTo({
              url: '/pages/my/orderList/orderList',
            })
          } else {
            //申请退货失败
            that.getParkse(res.data.message.descript);//提示信息
            that.closeReasonInfoBox();
          }

        })
      }

    } else {
      that.getParkse('请输入申请理由！');
      // wx.showModal({
      //   content: '请输入申请理由！',
      //   showCancel: false,
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     }
      //   }
      // })
    }
  },
  // ********************退款、退货 end*************************
  // 确认订单
  getConfirmReceipt: function () {
    var that = this;
    // 弹出自定义对话框
    that.setData({
      refundDialogBox: {//公共自定义对话框
        isDialogShow: true,//弹出自定义对话框
        dialogTitle: '确认已经收到商品了！',//自定义对话框标题
        getSubmitEvent: 'getconfirmConfirmReceipt',//确认收货事件
        getCancelDialog: 'getCancelDialog',//取消按钮
      }
    })
  },
  // 自定义弹窗之确认收货事件
  getconfirmConfirmReceipt: function () {
    var that = this;
    that.getCancelDialog();//关闭自定义对话框
    appUtil.controllerUtil.updateorderCompletion({
      "order_id": that.data.orderDetail.order_id
    }, function (res) {//确认收货
      if (res.data.succeeded) {
        wx.showToast({ title: "确认收货" })
        console.log(res.data)
        that.getUpdateOrederDetail();
      } else {
        if (res.data.message.descript == '系统繁忙，请稍候') {
          // 系统繁忙
          that.getParkse('系统繁忙，请稍候')
        }
        wx.showToast({ icon: "loading", title: res.data.errorMesg })
      }
    }, function (res) {
    })
  },
  //再来一单
  getMoreNote: function (e) {
    var that = this;
    var orderid = this.data.orderDetail.order_id;
    var storeId = e.currentTarget.id;
    appUtil.controllerUtil.getOrderOnceMoreById(orderid, function (res) {
      if (res.data.succeeded) {
        if (res.data.data == 1) {
          wx.reLaunch({
            url: '/pages/store/glspecial/glspecial?isAgin=1&storeId=' + storeId,
          })
        } else {
          wx.navigateTo({
            url: '/pages/store/cart/cart?isAgin=1&storeId=' + storeId,
          })
        }
      }
    }, function (res) { })
    // if (this.data.extend_store.store_show_type == 2) {
    //   wx.reLaunch({//关闭所有的页面
    //     url: '/pages/store/cart/cart?isAgin=1&storeId=' + e.currentTarget.id,//商超类型上下
    //   })
    // } else {
    //   wx.reLaunch({//关闭所有的页面
    //     url: '/pages/store/glspecial/glspecial?isAgin=1&storeId=' + e.currentTarget.id,//美食等类型左右
    //   })
    // }
    // console.log(e.currentTarget.id)
  },
  //评价
  gotoEvaluate: function () {
    wx.navigateTo({
      url: '/pages/my/evaluate/evaluate?orderId=' + this.data.orderDetail.order_id,
    })
  },
  // 订单操作事件end
  getServiceFee: function () {//获取夜间服务费
    var that = this;
    //获取区域码(寄件地址中的areaCode)
    var areaCode = that.data.orderDetail.area_code;//appUtil.appUtils.getregionCodeData();
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
            showNight: !that.data.showNight,//弹出夜间服务费
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
    // this.setData({
    //   showNight: !this.data.showNight
    // })
  },
  closeServiceFee: function () {//关闭夜间服务费
    this.setData({
      showNight: !this.data.showNight
    })
  },
  changeIfMore: function () {//更改更多信息
    this.setData({
      ifmore: !this.data.ifmore
    })
  },
  getNowTiem: function (time) {//转换时间格式
    //获取当前时间  
    var n = time * 1000;
    var date = new Date(n);
    //年  
    var Yeart = date.getFullYear();
    //月  
    var Mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var Dates = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时  
    var hours = date.getHours();
    //分  
    var mint = date.getMinutes();
    if (mint < 10) {
      mint = "0" + mint;
    } else {
      mint = mint;
    }
    //秒  
    var s = date.getSeconds();
    var orderTime = Yeart + "-" + Mon + "-" + Dates + " " + hours + ":" + mint;//订单时间格式
    return orderTime;
  },
  // 付款倒计时
  getResidualPaymentTime: function (timestamp) {
    var that = this;
    var times = setInterval(function () {
      var nowTime = Math.round(new Date().getTime() / 1000).toString();
      var paytime = nowTime - timestamp;//支付后半个小时的时间减去现在的时间
      // console.log("paytime:" + paytime + "timestamp:" + timestamp + "+" + "nowTime:" + nowTime)
      var pat = -paytime;
      if (pat <= 900 && pat > 0) {
        pat = pat;
        // console.log(pat)
      } else {
        pat = 0
      }
      var date = new Date(pat * 1000);
      //分  
      var mint = date.getMinutes();
      //秒  
      var sec = date.getSeconds();
      if (mint < 10) {
        mint = "0" + mint;
      } else {
        mint = mint;
      }
      if (sec < 10) {
        sec = "0" + sec;
      } else {
        sec = sec;
      }
      var countDownTime = mint + ":" + sec;
      console.log(countDownTime)
      if (pat == 0) {
        appUtil.controllerUtil.cancellationOfOrder({//获取取消订单接口
          order_id: that.data.orderDetail.order_id
        }, function (data) {
          if (data.data.succeeded == true) {
            that.getUpdateOrederDetail();
          } else {
            that.getUpdateOrederDetail();
          }
          console.log("取消订单成功")
          clearInterval(times);//停止循环
        })
        clearInterval(times);//停止循环
      } else {
        that.setData({
          surplusTime: countDownTime
        })
      }
    }, 1000);
  },
  //去支付
  gotopay: function () {
    var that = this;
    console.log(this.data.orderDetail.order_id);
    appUtil.controllerUtil.gotoApplyPay({//支付接口
      payType: 'wxa',
      openid: appUtil.appUtils.getOpenIdData(),
      type: 1,
      order_id: this.data.orderDetail.order_id
    }, function (res) {
      console.log(res.data)
      console.log("*************************")
      var payorderList = res.data.data;
      console.log("since_hand:" + that.data.since_hand)
      wx.requestPayment({//调用微信支付接口
        'appId': payorderList.appId,
        'timeStamp': payorderList.timeStamp,
        'nonceStr': payorderList.nonceStr,
        'package': payorderList.package,
        'signType': payorderList.signType,
        'paySign': payorderList.paySign,
        'success': function (res) {
          //支付成功之后跳转到订单列表
          wx.redirectTo({
            url: '/pages/my/orderList/orderList',
          })
          console.log(res)
          console.log("支付成功");
        },
        'fail': function (res) {
          console.log(res);
          console.log("支付失败");
        }
      })
    })
  },

  cancellationOfOrder: function () {//取消订单
    var that = this;
    // 弹出自定义对话框
    that.setData({
      refundDialogBox: {//公共自定义对话框
        isDialogShow: true,//弹出自定义对话框
        dialogTitle: '亲，真哒要取消订单嘛？',//自定义对话框标题
        getSubmitEvent: 'getconfirmCancellationOfOrder',//确认收货事件
        getCancelDialog: 'getCancelDialog',//取消按钮
      }
    })
  },
  // 自定义弹窗之确认取消订单事件
  getconfirmCancellationOfOrder: function () {
    var that = this;
    that.getCancelDialog();//关闭自定义对话框
    appUtil.controllerUtil.cancellationOfOrder({//取消订单接口
      order_id: that.data.orderDetail.order_id
    }, function (data) {
      if (data.data.succeeded == true) {
        wx.redirectTo({
          url: '/pages/my/orderList/orderList'
        })
        that.setData({ isTrue: true })
      } else {
        that.getParkse(data.data.message.descript);//提示信息
      }
    })
  },
  //对订单进行操作之后重新刷新页面
  getUpdateOrederDetail: function () {
    var that = this;
    appUtil.controllerUtil.getselectOrderDetails({
      order_id: that.data.orderDetail.order_id,
      map: 'amap'
    }, function (res) {
      var orderDetail = res.data.data;
      var addTime = that.getNowTiem(orderDetail.add_time);//订单时间
      var finnshed_time = that.getNowTiem(orderDetail.finnshed_time);//订单完成时间
      var payment_time = that.getNowTiem(orderDetail.payment_time);//支付时间
      var cancel_time = that.getNowTiem(orderDetail.cancel_time);//订单取消时间
      var receiving_time = that.getNowTiem(orderDetail.receiving_time);//接单时间
      var sellerAddTime = that.getNowTiem(orderDetail.extend_order_common.add_time);//申请退款/退货时间
      var seller_time = that.getNowTiem(orderDetail.extend_order_common.seller_time);//申请退款/退货成功（失败）时间
      var selleradmin_time = that.getNowTiem(orderDetail.extend_order_common.admin_time);//仲裁结果时间
      that.setData({
        orderDetail: orderDetail,
        extend_store: orderDetail.extend_store,
        extend_order_goods: orderDetail.extend_order_goods,
        overhead_info: orderDetail.extend_order_common.overhead_info,//附加信息
        coupon_info: orderDetail.extend_order_common.coupon_info,//优惠信息
        // orderPrice: (orderDetail.order_amount + orderDetail.extend_order_common.favorablePrice).toFixed(2),//共付价格
        addTime: addTime,//订单时间
        finnshed_time: finnshed_time.substring(11, 16),//订单完成时间
        payment_time: payment_time.substring(11, 16),//支付时间
        cancel_time: cancel_time.substring(11, 16),//订单取消时间
        receiving_time: receiving_time.substring(11, 16),//接单时间
        sellerAddTime: sellerAddTime.substring(11, 16),//申请退款/退货时间
        seller_time: seller_time.substring(11, 16),//申请退款/退货成功（失败）时间
        selleradmin_time: selleradmin_time.substring(11, 16),//仲裁结果时间
        orderPrice: (orderDetail.order_amount + orderDetail.extend_order_common.favorablePrice).toFixed(2),//共付价格

      })

    });
  },
  getOrderDetail: function (options) {//获取订单详情信息
    var that = this;
    appUtil.controllerUtil.getselectOrderDetails({
      order_id: options.orderId,//options.orderId'1539'
      map: 'amap',
      type: 'wxa'
    }, function (res) {
      console.info("res.data*****************", res.data)
      if (res.data.succeeded == false) {
        if (res.data.message.descript == '该账号未绑定微信，请绑定微信！') {
          // 未绑定微信号
          wx.showModal({
            content: '该账号未绑定微信，请绑定微信！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.redirectTo({
                  url: '/pages/newLogin/newLogin',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateBack();
              }
            }
          })
        } else if (res.data.error.code == '401' || res.data.message.descript == 'token已失效，请重新登录' || res.data.message.descript == '后台信息更新，请重新登录') {
          wx.redirectTo({
            url: '/pages/newLogin/newLogin',
          })
        } else {
          that.getParkse(res.data.message.descript);
        }
      }
      if (res.data.data != null) {
        var orderDetail = res.data.data;
        // that.getNowTiem(orderDetail);
        var addTime = that.getNowTiem(orderDetail.add_time);//订单时间
        var finnshed_time = that.getNowTiem(orderDetail.finnshed_time);//订单完成时间
        var payment_time = that.getNowTiem(orderDetail.payment_time);//支付时间
        var cancel_time = that.getNowTiem(orderDetail.cancel_time);//订单取消时间
        var receiving_time = that.getNowTiem(orderDetail.receiving_time);//接单时间
        var sellerAddTime = that.getNowTiem(orderDetail.extend_order_common.add_time);//申请退款/退货时间
        var seller_time = that.getNowTiem(orderDetail.extend_order_common.seller_time);//申请退款/退货成功（失败）时间
        var selleradmin_time = that.getNowTiem(orderDetail.extend_order_common.admin_time);//仲裁结果时间
        that.getResidualPaymentTime(orderDetail.surplusTime)
        console.log(orderDetail);
        that.setData({
          orderDetail: orderDetail,
          extend_store: orderDetail.extend_store,
          extend_order_goods: orderDetail.extend_order_goods,
          overhead_info: orderDetail.extend_order_common.overhead_info,//附加信息
          coupon_info: orderDetail.extend_order_common.coupon_info,//优惠信息
          // orderPrice: (orderDetail.order_amount + orderDetail.extend_order_common.favorablePrice).toFixed(2),//共付价格
          addTime: addTime,//订单时间
          finnshed_time: finnshed_time.substring(11, 16),//订单完成时间
          payment_time: payment_time.substring(11, 16),//支付时间
          cancel_time: cancel_time.substring(11, 16),//订单取消时间
          receiving_time: receiving_time.substring(11, 16),//接单时间
          sellerAddTime: sellerAddTime.substring(11, 16),//申请退款/退货时间
          seller_time: seller_time.substring(11, 16),//申请退款/退货成功（失败）时间
          selleradmin_time: selleradmin_time.substring(11, 16),//仲裁结果时间
          orderPrice: (orderDetail.order_amount + orderDetail.extend_order_common.favorablePrice).toFixed(2),//共付价格
        })
        wx.hideLoading();
      }
    })
  },
  // 关闭自定义对话框（即取消操作）
  getCancelDialog: function () {
    this.setData({
      refundDialogBox: {//公共自定义对话框
        isDialogShow: false,//弹出自定义对话框
      },
    })
  },
  // 跳转到商品详情
  goToTheGoodsDetail: function (e) {
    var goodsId = e.currentTarget.id;
    wx.redirectTo({
      url: '/pages/detail/goodsdetail?goodId=' + goodsId,
    })
  },
  // 跳转到店铺
  goToTheStore: function (e) {
    var storeId = e.currentTarget.id;
    console.log(storeId)
    if (this.data.extend_store.store_show_type == 2) {
      wx.redirectTo({//关闭所有的页面
        url: '/pages/store/index?isAgin=0&storeId=' + storeId,//商超类型上下
      })
    } else {
      wx.redirectTo({//关闭所有的页面
        url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + storeId,//美食等类型左右
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info("onLoad")
    console.info("-------------options------------------")
    //0.判断是否单个商品或购物车列表集合 //goods_id|Count
    // var goods_id = options.goods_id;
    // var tokens = appUtil.appUtils.getTokenData();
    // //1 路径上面拿去good_id
    // this.orederdata(options);
    //判断是否登陆，即判断能否获取到用户的token
    if (appUtil.appUtils.getTokenData() == null || appUtil.appUtils.getTokenData() == "") {
      // 未登录
      wx.redirectTo({
        url: '/pages/newLogin/newLogin',
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      this.getOrderDetail(options);
    }

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
    wx.stopPullDownRefresh();
    this.getUpdateOrederDetail();
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