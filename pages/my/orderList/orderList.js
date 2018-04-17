// pages/my/orderList/orderList.js
var app = getApp();
var appUtil = require('../../../utils/appUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '../../../image/orderList/house.png',
    icon1: '../../../image/orderList/motorcycle1.png',
    isLastPage: false,
    showLoading: true,
    hiddenLoading: false,
    refundReasonInfo: {
      isShow: false,
      title: "退款",
      reasonMessage: "",
      orderId: "",
      orderSN: "",
      reasonList: null
    },
    isLastPage: false,
    showLoading: true,
    hiddenLoading: false,
    pageInfo: {
      arbitramentMsg: "web",
      state_type: "all",
      page: 10,
      curPage: 1
    },
    orderList: {}

  },
  discolor: function (e) {
    wx.showToast({
      icon: "loading", title: "加载中...",mask:true,
    })
   // console.info(JSON.stringify(e))
    this.setData({
      isLastPage: false,
      pageInfo: {
        arbitramentMsg: "web",
        state_type: e.currentTarget.dataset.type,
        page: 10,
        curPage: 1
      },
      orderList: {}
    })
    this.loadList()
  },
  showOrderInfoByIndex: function (e) {
   // console.info(e.currentTarget.dataset.orderindex)
    this.data.orderList.forEach(function (order) {
      if (order.order_id == e.currentTarget.dataset.orderindex) {
        order.check = !order.check;
      }
    })
    this.setData({
      orderList: this.data.orderList
    })
  }
  ,
  loadList: function () {
    var that = this;
    that.setData({
      hiddenLoading: !that.data.hiddenLoading
    })

    appUtil.controllerUtil.orderListByUserCenter(this.data.pageInfo, function (res) {
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

      var orderList = ("undefined" == typeof (list.data) || null == list.data || "undefined" == typeof (list.data.order_list) || null == list.data.order_list) ? [] : list.data.order_list;
      // console.log(orderList.store_name)
      for (var i = 0; (orderList != null && i < orderList.length); i++) {
        orderList[i].check = false;
      }
      that.setData({
        orderList: orderList,
        hiddenLoading: !that.data.hiddenLoading
      });
      wx.stopPullDownRefresh();
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
    console.info("1111:" + appUtil.appUtils.getMemberId())
    wx.showToast({
      mask:true,icon: "loading", title: "加载中..."
    })
    var thisPage = this;
    appUtil.appUtils.getMemberId("")
    appUtil.controllerUtil.getSelectRefundReason(function (res) {
      thisPage.setData({
        refundReasonInfo: {
          isShow: thisPage.data.refundReasonInfo.isShow,
          title: "退货原因",
          reasonList: res.data.data
        }
      })

    });
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
    var thisPage = this;
    thisPage.data.isLastPage = false;
    thisPage.data.pageInfo.curPage = 1
    var thisPage = this;
    appUtil.appUtils.getMemberId("")
    appUtil.controllerUtil.getSelectRefundReason(function (res) {
      thisPage.setData({
        refundReasonInfo: {
          isShow: thisPage.data.refundReasonInfo.isShow,
          title: "退货原因",
          reasonList: res.data.data
        }
      })

    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },//取消订单
  cancellationOfOrder: function (orderId) {//取消订单
    var thisPage = this;
    var thisOrderId = orderId;
    appUtil.controllerUtil.updateCancellationOrder({
      order_id: orderId
    }, function (res) {
      if (res.data.succeeded) {
        wx.showToast({
          title: '取消订单成功！',
        })
        thisPage.data.orderList.forEach(function (order) {
          if (order.order_id == thisOrderId) {
            order.state_desc = '已取消';
            order.evaluation_state = ''
          }
        })
        thisPage.setData({
          orderList: thisPage.data.orderList
        })
      } else {
        wx.showToast({
          title: '取消订单失败！',
        })
      }
    })
  },
  toOrderDetail: function (e) {
    e.currentTarget.dataset.orderindex
  },
  toStore: function (e) {
    wx.showToast({
      title: '加载中...',
      icon: "loading",
      mask: true
    })
    var url = "";
    var orderId = e.currentTarget.dataset.orderid;
    var sincehand = e.currentTarget.dataset.sincehand;
    wx.navigateTo({
      url: "/pages/my/order/orderDetail/orderDetail?orderId=" + orderId,
    })

  },

  //关闭消息框
  closeReasonInfoBox: function (e) {
    this.setData({
      refundReasonInfo: {
        isShow: !this.data.refundReasonInfo.isShow,
      }
    })

  },
  //提交按钮
  submitReasonInfo: function (e) {
    var thisPage = this;
    var orderid = e.target.dataset.orderid;
    var ordersn = e.target.dataset.ordersn;
    var title = e.target.dataset.title;
    var reasonMessage = this.data.reasonMessage;

    this.setData({
      refundReasonInfo: {
        isShow: !this.data.refundReasonInfo.isShow,
      }
    })

    if (title == "退货") {
      appUtil.controllerUtil.insertBuyerReturns({
        "order_id": orderid,
        "reason_info": reasonMessage,
        "buyer_message": reasonMessage
      }, function (res) {
        if (res.data.succeeded) {
          wx.showToast({
            title: '申请退货成功！',
          })
          thisPage.data.orderList.forEach(function (order) {
            if (order.order_id == orderid) {
              order.state_desc = '退货中';
              order.booking_time = null;
            }
          })
          thisPage.setData({
            orderList: thisPage.data.orderList
          })
        } else {
          wx.showToast({
            icon: "loading",
            title: '申请退货失败！',
          })
        }
      })
    } else {
      appUtil.controllerUtil.insertorderRefund({
        "order_id": orderid,
        "reason_info": reasonMessage
      }, function (res) {
        if (res.data.succeeded) {
          wx.showToast({
            title: '申请退款成功！',
          })
          thisPage.data.orderList.forEach(function (order) {
            if (order.order_id == orderid) {
              order.state_desc = '退款中';
              order.booking_time = null;
            }
          })
          thisPage.setData({
            orderList: thisPage.data.orderList
          })
        } else {
          wx.showToast({
            icon: "loading",
            title: '申请退款失败！',
          })
        }
      })
    }

  },
  //文本输入
  textareaBindInput: function (e) {
    this.setData({
      reasonMessage: e.detail.value
    })
    console.log(e.detail.value)
  }
  ,
  //单选按钮
  reasonChange: function (e) {
    this.data.refundReasonInfo.reasonList.forEach(function (reason) {
      if (e.detail.value == reason.reason_id) {
        reason.checked = true;
      } else {
        reason.checked = false;
      }
    })
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  toChagePage(e) {
    wx.showToast({
      title: '请等候',
      icon: "loading",
      mask: true,
      duration: 4000
    })
    var thisPage = this;
    var orderid = e.currentTarget.dataset.orderid;
    var ordersn = e.currentTarget.dataset.ordersn;
    var btntype = e.currentTarget.dataset.btntype;
    switch (btntype) {
      case "qxdd": //取消订单  李欧 
        wx.showModal({
          title: '提示',
          content: '是否确认取消订单！',
          success: function (res) {
            if (res.confirm) {
              thisPage.cancellationOfOrder(orderid);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case "qzf": //去支付  可能跳转订单详情
        wx.navigateTo({
          //url: '/pages/my/order/notpay/notpaym?orderId=' + orderid,
          url: "/pages/my/order/orderDetail/orderDetail?orderId=" + orderid,
        })
        break;
      case "cxgm"://重新购买  
        var storeId = e.currentTarget.dataset.storeid;
        appUtil.controllerUtil.getOrderOnceMoreById(orderid, function (res) {
          if (res.data.succeeded) {
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
          } else {
            wx.showToast({
              icon: "loading",
              title: res.data.error.descript
            })
          }
        }, function (res) {
          console.info(res);
        })
        break;
      case "sqtk": //申请退款  李欧
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '是否确认申请退款！',
          success: function (res) {
            if (res.confirm) {
              var i = 0;
              appUtil.controllerUtil.getSelectRefundMoneyReason(function (res) {
                res.data.data.forEach(function (reason) {
                  reason.checked = (i == 0 ? true : false);
                  i++;
                })

                thisPage.setData({
                  refundReasonInfo: {
                    isShow: !thisPage.data.refundReasonInfo.isShow,
                    title: "退款",
                    orderId: orderid,
                    orderSN: ordersn,
                    reasonList: res.data.data
                  }
                })

                setTimeout(function () {
                  thisPage.setData({
                    reasonMessage: ""
                  })
                }, 500)

              });

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case "sqth": ///api/v1/shopMc/insertBuyerReturns 买家订单------退货 必传参：order_id，reason_id（可不传），reason_info，buyer_message
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '是否确认申请退货！',
          success: function (res) {
            if (res.confirm) {
              var i = 0;
              appUtil.controllerUtil.getSelectRefundReason(function (res) {
                res.data.data.forEach(function (reason) {
                  reason.checked = (i == 0 ? true : false);
                  i++;
                })

                thisPage.setData({
                  refundReasonInfo: {
                    isShow: !thisPage.data.refundReasonInfo.isShow,
                    title: "退货",
                    orderId: orderid,
                    orderSN: ordersn,
                    reasonList: res.data.data
                  }
                })

                setTimeout(function () {
                  thisPage.setData({
                    reasonMessage: ""
                  })
                }, 500)

              });

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case "lxsj"://联系商家
        console.info("lxsj")
        break;
      case "lxkf": //联系客服
        console.info("lxkf")
        break;
      case "cd": //催单
        appUtil.controllerUtil.urgeOrder({ "order_id": orderid }, function (res) {
          if (res.data.succeeded) {
            wx.showToast({ title: "催单成功" })
          } else {
            wx.showToast({ icon: "loading", title: res.data.error.descript })
          }
        }, function (res) {

        })
        break;
      case "qdsh": //确认收货  李欧  非跳转  /api/v1/shopMc/updateorderCompletion order_id   返回true false;
        appUtil.controllerUtil.updateorderCompletion({ "order_id": orderid }, function (res) {
          if (res.data.succeeded) {
            wx.showToast({ title: "确认收货" })
            thisPage.data.orderList.forEach(function (order) {
              if (order.order_id == orderid) {
                order.state_desc = '已完成';
                order.evaluation_state = '未评价'
              }
            })
            thisPage.setData({
              orderList: thisPage.data.orderList
            })
          } else {

            wx.showToast({ icon: "loading", title: res.data.errorMesg })
          }
        }, function (res) {

        })
        break;

      case "zlyd": //再来一单
        var storeId = e.currentTarget.dataset.storeid;
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

          } else {
            wx.showToast({
              icon: "loading",
              title: res.data.error.descript,
            })
          }
        }, function (res) {
          console.info(res);
        })
        break;
      case "ddpj"://评价  跳转到评价页面 ????
        if (getCurrentPages().length > 4) {
          wx.redirectTo({
            url: '/pages/my/evaluate/evaluate?orderId=' + orderid,
          })
        } else {
          wx.navigateTo({
            url: '/pages/my/evaluate/evaluate?orderId=' + orderid,
          })
        }
        break;
      case "ddypj"://已评价
        wx.hideToast();
        break;
    }
  },
  lower: function (e) {


  },
  loadListFun: function (callBack) {
    var thisPage = this;
    // console.info("thisPage.data.pageInfo" + JSON.stringify(thisPage.data.pageInfo))  
    appUtil.controllerUtil.orderListByUserCenter(thisPage.data.pageInfo, function (res) {
      callBack(res)
    })

  },
  addNextPageOrderToOrderList: function (nextPageOrderPage) {
    var thisPage = this;
    var orderList = this.data.orderList;
    nextPageOrderPage.forEach(function (t) {
      thisPage.data.isLastPage = false;
      orderList.push(t)
    });
    this.setData({
      orderList: orderList
    })
    setTimeout(function () {
      wx.hideToast();
    }, 2000);

  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: "loading",
      mask: true,
    })
    var thisPage = this;
    thisPage.data.isLastPage = false;
    thisPage.data.pageInfo.curPage = 1
    thisPage.loadList();
    wx.stopPullDownRefresh()
  },
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

        thisPage.data.pageInfo.curPage = thisPage.data.pageInfo.curPage + 1
        thisPage.loadListFun(function (res) {

          var list = res.data;

          var orderList = ("undefined" == list.data || null == list.data || "undefined" == list.data.order_list || null == list.data.order_list) ? [] : list.data.order_list;
          // console.log(orderList.store_name)
          for (var i = 0; (orderList != null && i < orderList.length); i++) {
            orderList[i].check = false;
          }

          thisPage.addNextPageOrderToOrderList(orderList)
        })
      }
    }, 500)

  },
  toDistributionOrderList:function(){
    wx.redirectTo({
      url: "/pages/my/distributionOrderList/distributionOrderList",
    })
  }
  ,toIndex:function(){
    wx.switchTab({
      url: '/pages/home2/home2',
    })
  }
})