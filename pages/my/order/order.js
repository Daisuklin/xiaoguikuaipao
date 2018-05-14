// pages/my/order/order.js
var app = getApp();
var appUtil = require("../../../utils/appUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    isPrompt: false,
    promptTitle: '请输入地址信息',
    userDemand: '',
    since_hand: 0,
    cantClick: false,
    icon: {
      pellet: '../../../image/pellet.png',
      icon_location: '../../../image/detail/icon_location.png',//地址图标
      icon_appoint: '../../../image/detail/icon_appoint.png',//指定时间图标
      icon_call: '../../../image/detail/order_call@2x.png',//自提手机图标
      icon_qusition: '../../../image/detail/nightfee@2x.png',//夜间服务费
      icon_select: '../../../image/detail/select.png',
      icon_sel1: '../../../image/detail/icon_00.png',
      icon_sel2: '../../../image/detail/icon_01.png',
      storetop: '../../../image/detail/store.png'
    },

    items: [
      { name: '1', value: '小龟配送', checked: 'true' },
      { name: '2', value: '自提购买' },

    ],
    order_msgs: [],
    monthday: '',
    selectHam: '',
    box_park: false,
    isClickBind: false,
    integralchecked: true,//默认不选择龟米抵扣
    integralsValue: '',//默认积分为0
  },
  // 备注获取焦点
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  radioChange: function (e) {//选择配送还是自提
    var that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var showNum = parseInt(e.detail.value);
    this.setData({
      isShow: showNum,
      since_hand: showNum
    })
    if (showNum == 0) {//选择配送后进行重新渲染
      var getDefaltId = appUtil.appUtils.getDefaltId();
      var defaultAddress = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
      if (typeof (this.data.cart_id) != 'undefined' || typeof (this.data.goods) != 'undefined' || typeof (this.data.spec_key) != 'undefined' || typeof (this.data.ifcart) != 'undefined') {
        if (getDefaltId != defaultAddress) {
          that.getAddressInfoAgain(getDefaltId);
          console.info("显示1")
        } else {
          that.getAddressInfoAgain(defaultAddress);
          console.info("显示2")
        }
      }
    } else {//选择自提之后进行重新渲染
      var addressId = '';
      that.getAddressInfoAgain(addressId)
    }
  },
  gotoaddress: function () {//选择地址
    var that = this;
    // ************禁止多次点击**************
    if (that.data.isClickBind) {
      return;
    }
    that.setData({ isClickBind: true });
    console.info("禁止多次点击")
    // ************禁止多次点击 end**************
    wx.navigateTo({
      url: '/pages/my/site/site?transmitId=' + '15626199190',//来自确认订单页的入口
    })
  },
  showChoiceTime: function () {//弹出选择预约时间弹窗
    this.setData({
      gotoBuy: !this.data.gotoBuy,
      hasMask: true
    });

  },
  hideChoiceTime: function () {//关闭选择预约时间弹窗
    this.setData({
      gotoBuy: false,
      hasMask: false
    });
  },
  canselChoiceTime: function () {//取消选择时间
    var that = this;
    that.setData({
      monthday: '',
      chioceHours: 0,
      selectHam: '',
      appointmentTime: this.data.nowTime,
      chioceHoursParent: 0
    })
    that.hideChoiceTime();
  },
  //确定选择预约时间
  getDetermine: function () {
    var that = this;
    console.log("monthdayChild:" + this.data.monthdayChild)
    console.log("selectHamParent:" + this.data.selectHamParent)
    // 日期和时间都不为空
    if (this.data.selectHamParent != '') {
      that.setData({
        monthday: this.data.monthdayChild,//选择配送的时间（month,date）
        selectHam: this.data.selectHamParent,//选择配送的时间（h,m）
        chioceHoursParent: this.data.chioceHours,
        selectHamParent: ''
      })
    } else {
      that.setData({
        monthday: '',//选择配送的时间（month,date）
        selectHam: '',//选择配送的时间（h,m）
        chioceHoursParent: 0,
        chioceHours: 0,
      })
    }
    that.hideChoiceTime();
    if (this.data.since_hand == 0) {//选择配送后进行重新渲染
      var getDefaltId = appUtil.appUtils.getDefaltId();
      var defaultAddress = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
      if (typeof (this.data.cart_id) != 'undefined' || typeof (this.data.goods) != 'undefined' || typeof (this.data.spec_key) != 'undefined' || typeof (this.data.ifcart) != 'undefined') {
        if (getDefaltId != defaultAddress) {
          this.getAddressInfoAgain(getDefaltId);
          console.info("显示1")
        } else {
          this.getAddressInfoAgain(defaultAddress);
          console.info("显示2")
        }
      }
    } else {//选择自提之后进行重新渲染
      var addressId = '';
      this.getAddressInfoAgain(addressId)
    }
  },
  //选项卡左侧时间选择
  changeIndex: function (e) {
    // console.log(e.currentTarget.id)
    console.log(this.data)
    var monthday = e.currentTarget.dataset.mouthday;
    var num = parseInt(e.currentTarget.id);
    for (var t = 1; t < 7; t++) {
      if (num == t && num != 0) {
        monthday = monthday;
        break;
      } else if (num == 0) {
        monthday = ''
      }
    }
    console.log("monthdayParent:" + monthday)
    this.setData({
      isIndexNu: num,
      monthdayParent: monthday,//选择配送的时间（month,date）
    })
  },
  //选择时间段
  radioChangepake: function (e) {
    // 选择有效时间
    var values = e.currentTarget.dataset.value;
    var num = this.data.isIndexNu;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("num:" + num)
    for (var t = 1; t < 7; t++) {
      if (num == t && num != 0) {
        var tomorrow_timetamp = timestamp + 24 * 60 * 60 * t;
        var n_to = tomorrow_timetamp * 1000;
        var tomorrow_date = new Date(n_to);
        var Y_tomorrow = tomorrow_date.getFullYear();
        var M_tomorrow = (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
        var D_tomorrow = tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();
        var date_md = M_tomorrow + "月" + D_tomorrow + "日";
        var appointmentTime = Y_tomorrow + "-" + M_tomorrow + "-" + D_tomorrow + " ";
        break;
      } else if (num == 0) {
        var appointmentTime = this.data.nowTime;
      }
    }
    if (this.data.monthdayParent == "" && values == '08:30') {
      this.setData({
        // monthdayParent: '',
        monthdayChild: this.data.monthdayParent,
        chioceHours: 0,
        selectHamParent: '',
        isSelectClass: values,
        isIndexNuChild: this.data.isIndexNu,
        appointmentTime: appointmentTime
      })
      console.log("chioceHours:" + 0)
    } else {
      this.setData({
        monthdayChild: this.data.monthdayParent,
        isSelectClass: values,
        selectHamParent: values,//选择配送的时间（h,m）
        chioceHours: 1,
        isIndexNuChild: this.data.isIndexNu,
        appointmentTime: appointmentTime
      })
    }
    console.log("appointmentTime:" + appointmentTime)
  },
  getDataTime: function () {//获取当前时间
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    var Yeart = date.getFullYear(); //年  
    var Mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月  
    var Dates = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();//日  
    var hours = date.getHours();//时  
    var mint = date.getMinutes();//分  
    if (mint < 10) {
      mint = "0" + mint;
    } else {
      mint = mint;
    }
    var s = date.getSeconds();//秒
    var day = ""; //星期
    switch (date.getDay()) {
      case 0:
        day = "日";
        break;
      case 1:
        day = "一";
        break;
      case 2:
        day = "二";
        break;
      case 3:
        day = "三";
        break;
      case 4:
        day = "四";
        break;
      case 5:
        day = "五";
        break;
      case 6:
        day = "六";
        break;
    }
    console.log("星期" + day);
    var nowTime = Yeart + "-" + Mon + "-" + Dates + " ";//今天时间
    var nowHours = hours + 1 + ":" + "00";
    var nowHourMin = hours + 1 + ":" + mint;
    var getDateArr = [];
    var getHoursArr = [];
    for (var t = 1; t < 7; t++) {
      var tomorrow_timetamp = timestamp + 24 * 60 * 60 * t;
      var n_to = tomorrow_timetamp * 1000;
      var tomorrow_date = new Date(n_to);
      var M_tomorrow = (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
      var D_tomorrow = tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();
      var date_md = M_tomorrow + "月" + D_tomorrow + "日";
      getDateArr.push(date_md);//获取今天以后的六天时间
    }
    var H = 8;//起始时间
    var min = 0;//分钟
    var arr = [];
    for (var i = 0; i < 28; i++) {//获取间隔时间段
      var minOj = {};
      min += 30;
      if (min > 50) {
        min = 0;
        H += 1
      }
      minOj['time'] = (H > 9 ? H : "0" + H) + ":" + (min > 9 ? min : "0" + min)
      arr.push(minOj);
    }
    console.log(nowHours)
    console.log(nowHourMin)
    this.setData({
      getDateArr: getDateArr,//获取后六天的天数
      arr: arr,
      day: day,
      nowTime: nowTime,
      Yeart: Yeart,
      Mon: Mon,
      Dates: Dates,
      hours: hours,
      mint: mint,
      nowHours: nowHours,
      nowHourMin: nowHourMin,
    })
  },
  getServiceFee: function () {//获取夜间服务费
    var that = this;
    //获取区域码(寄件地址中的areaCode)
    var areaCode = that.data.address_info.areaCode;//appUtil.appUtils.getregionCodeData();
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
  },

  closeServiceFee: function () {//关闭夜间服务费
    this.setData({
      showNight: !this.data.showNight
    })
  },
  userNeedInput: function (e) {//获取留言信息
    var order_msgs = this.data.order_msgs;
    console.log(e.currentTarget.id)
    var store_id = e.currentTarget.id;
    var flag = false;
    for (var i = 0; i < order_msgs.length; i++) {
      if (store_id == order_msgs[i].store_id) {
        flag = true;
        break;
      }
    }
    if (flag) {
      for (var i = 0; i < order_msgs.length; i++) {
        if (store_id == order_msgs[i].store_id) {
          order_msgs[i].msg = e.detail.value;
          break;
        }
      }
    } else {
      var mages = {};
      mages['store_id'] = store_id;
      mages['msg'] = e.detail.value;
      order_msgs.push(mages)
    }
    console.log(order_msgs);
    this.setData({
      order_msgs: order_msgs
    })
  },
  //选择地址之后再一次刷新地址列表
  getAddressInfoAgain: function (addressId) {
    var that = this;
    var booking_times = that.data.appointmentTime + that.data.selectHam;

    console.log("booking_times:" + booking_times)
    appUtil.controllerUtil.getSelectDownOrders({
      goods: this.data.goods_id,
      address_id: addressId,
      pintuan: 0,
      cart_id: this.data.cart_id,
      ifcart: this.data.ifcart,
      spec_key: this.data.spec_key,
      order_from: 3,//订单来源 1web 2手机 3小程序
      booking_time: this.data.chioceHours == 0 ? '' : booking_times,//预约时间
      // pintuan_num: 0,
    }, function (res) {
      if (res.data.succeeded == true) {
        if (res.data.data.is_freight != null && res.data.data.is_freight != '') {
          that.setData({ isPrompt: !that.data.isPrompt, promptTit: res.data.data.is_freight, cantClick: true })
          setTimeout(function () {
            that.setData({
              isPrompt: !that.data.isPrompt,
              isClickBind: false,//支付失败之后还原点击事件
            })
          }, 2000)
          //  return;
        } else {
          that.setData({
            cantClick: false
          })
        }
        var oldstore_amount = that.data.oldstore_amount;//原始实付价格
        var oldcoupon_total = that.data.oldcoupon_total;//原始优惠数量（即优惠了coupon_total）
        console.info("is_freight为空===", res.data.data)
        that.getAmountOfCalculation(res.data.data, res.data.data.store_cart_list[0].store_amount, res.data.data.couponStr);//计算减去优惠券、积分之后的价格
        that.setData({
          address_info: res.data.data.address_info == null || res.data.data.address_info == '' ? '' : res.data.data.address_info,
          // store_cart_list: res.data.data.store_cart_list,
          // order_amount: res.data.data.order_amount,
          is_freight: res.data.data.is_freight,
          // coupon: res.data.data.coupon,
          isClickBind: false,//还原点击事件
        })
        console.log("再次刷新")
      }
    })
  },
  //获取确认订单接口
  getOrederdata: function (options) {
    var that = this;
    //请求数据
    var cartIdarr = [];
    console.log("getDefaltId:" + appUtil.appUtils.getDefaltId())
    var cartIds = options.cartId.split(',');
    for (var ca = 0; ca < cartIds.length; ca++) {//将数组中的字符串转换成int类型的
      cartIdarr.push(parseInt(cartIds[ca]))
    }
    console.log(cartIdarr)
    if (appUtil.appUtils.getMemberIdData().userData == null || typeof (appUtil.appUtils.getMemberIdData().userData) == 'undefined' || appUtil.appUtils.getMemberIdData().userData == '' || appUtil.appUtils.getMemberIdData().userData.defaultAddress == null) {
      var address_id = ''
    } else {
      var address_id = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
    }
    appUtil.controllerUtil.getSelectDownOrders({
      goods: options.goodId,
      address_id: address_id,//appUtil.appUtils.getMemberIdData().userData.defaultAddress,
      pintuan: 0,
      cart_id: options.cartId.split(',') == '' ? [] : cartIdarr,
      ifcart: options.cartId.split(',') == '' ? 0 : 1,
      spec_key: options.spaecKey,
      order_from: 3,//订单来源 1web 2手机 3小程序
      booking_time: '',//预约时间
      // pintuan_num: 0,
    }, function (data) {
      // ******************token无效时提醒 begin********************
      if (data.data.succeeded == false) {
        wx.hideLoading();
        if (data.data.error.code == '401' || data.data.error.descript == 'token无效，请重新输入' || data.data.message.descript == '帐户不存在或者已经被注销' || data.data.error.descript == 'token无效') {
          that.setData({ isPrompt: !that.data.isPrompt, promptTit: '身份信息失效，请重新登录' })
          setTimeout(function () {
            that.setData({ isPrompt: !that.data.isPrompt, box_park: false })
            wx.redirectTo({
              url: '/pages/newLogin/newLogin'
            })
          }, 2000)
        } else {
          that.setData({ isPrompt: !that.data.isPrompt, promptTit: data.data.message.descript, box_park: true })
          setTimeout(function () {
            that.setData({ isPrompt: !that.data.isPrompt, box_park: false })
            wx.navigateBack();
          }, 2000)
        }
      } else {
        if (data.data.data) {
          var order = data.data;
          var orderMas = order.data;
          var isIndexNu = 0, isSelectClass = 1;
          that.getDataTime();
          console.log(order)
          // let oldstore_amount = orderMas.store_cart_list[0].store_amount;//原始实付价格
          // let oldcoupon_total = orderMas.store_cart_list[0].coupon_total;//原始优惠数量（即优惠了coupon_total）
          orderMas.store_cart_list[0].oldstore_amount = orderMas.store_cart_list[0].store_amount;//原始实付价格
          orderMas.store_cart_list[0].oldcoupon_total = orderMas.store_cart_list[0].coupon_total;//原始优惠数量（即优惠了coupon_total）
          let oldstore_amount = orderMas.store_cart_list[0].oldstore_amount;//原始实付价格
          let oldcoupon_total = orderMas.store_cart_list[0].oldcoupon_total;//原始优惠数量（即优惠了coupon_total）
          that.getAmountOfCalculation(orderMas, oldstore_amount, oldcoupon_total);//计算减去优惠券、积分之后的价格
          that.setData({
            orderMas: orderMas,
            // coupon: orderMas.coupon,
            // order_amount: orderMas.order_amount,
            address_info: orderMas.address_info,
            carriage: order.data.carriage_type,
            store_cart_list: orderMas.store_cart_list,
            goods_id: options.goodId,
            spec_key: options.spaecKey,
            cart_id: options.cartId.split(',') == '' ? [] : cartIdarr,
            ifcart: options.cartId.split(',') == '' ? 0 : 1,
            address_id: appUtil.appUtils.getMemberIdData().userData.defaultAddress,
            isIndexNu: isIndexNu,
            isSelectClass: isSelectClass,
            monthday: '',
            monthdayParent: '',
            selectHam: '',
            chioceHours: 0,
            chioceHoursParent: 0,
            appointmentTime: that.data.nowTime,
            isShow: 0,
            is_freight: orderMas.is_freight,
            redPacketNum: orderMas.redPacketNum,//优惠券可用
            // redPacketNum: 1,//优惠券可用
            discountPrice: '',//优惠券价格
            oldstore_amount: oldstore_amount,//原始实付价格
            oldcoupon_total: oldcoupon_total,//原始优惠数量（即优惠了coupon_total）
          })
        }
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      //*******************token无效时提醒 end******************* */
    })
  },
  // 计算龟米抵扣值
  // getintegrals: function (orderMas) {
  //   let that = this;
  //   // let integralsVal = e.detail.value;
  //   let totalPrice = parseFloat(orderMas.store_cart_list[0].store_totle);//共需付的价格
  //   let viewPoint = parseFloat(that.data.orderMas.viewPoint);//剩余积分总数
  //   let coupon_total = parseFloat(orderMas.store_cart_list[0].coupon_total)//后台已计算的优惠价格
  //   let discountPrice = parseFloat(wx.getStorageSync('couponPrice') == '' ? 0 : wx.getStorageSync('couponPrice'));//需要扣除的优惠券金额
  //   //共需付总价-已经优惠价-优惠券=龟米积分值
  //   let integralsVal = parseFloat(totalPrice - coupon_total - discountPrice);
  //   console.info("integralsVal----", integralsVal)
  //   if (integralsVal > viewPoint) {
  //     // 当你输入的积分数大于总积分数
  //     integralsVal = viewPoint;
  //   }
  //   that.setData({
  //     integralsValue: integralsVal,//龟米积分抵扣值
  //   })
  //   that.getAmountOfCalculation(that.data.orderMas);//计算减去优惠券、积分之后的价格
  // },
  // 是否选择龟米抵扣
  bingChangeChecked: function () {
    let that = this;
    // let oldstore_amount = that.data.oldstore_amount;//原始实付价格
    let oldstore_amount = that.data.orderMas.order_amount;
    // let oldcoupon_total = that.data.oldcoupon_total;//原始优惠数量（即优惠了coupon_total）
    let oldcoupon_total = that.data.orderMas.couponStr;//原始优惠数量（即优惠了coupon_total）
    that.setData({
      integralchecked: !that.data.integralchecked
    })
    that.getAmountOfCalculation(that.data.orderMas, oldstore_amount, oldcoupon_total);//计算减去优惠券、积分之后的价格
  },
  // 实付金额扣除积分
  getAmountOfCalculation: function (orderMas, oldstore_amount, oldcoupon_total) {
    let that = this;
    let store_cart_list = orderMas.store_cart_list;
    let couponPrice = wx.getStorageSync('couponPrice') == '' ? '' : wx.getStorageSync('couponPrice');
    console.info("couponPrice", couponPrice)
    let discountPrice = parseFloat(couponPrice == '' || couponPrice.discountStr == '' ? 0 : couponPrice.discountStr);//需要扣除的优惠券金额
    console.info("discountPrice----", discountPrice)
    var integralPrice = 0;//需要扣除的积分数
    var oldstore_amount = parseFloat(oldstore_amount == '' ? 0 : oldstore_amount);//原始优惠后的实付价格
    var oldcoupon_total = parseFloat(oldcoupon_total == '' ? 0 : oldcoupon_total);//原始已优惠价格
    // 选择积分参与支付
    if (that.data.integralchecked) {
      // -----------------计算需要多少积分 begin--------------------
      let totalPrice = parseFloat(orderMas.store_cart_list[0].store_totle);//共需付的价格
      let viewPoint = parseFloat(orderMas.viewPoint);//剩余积分总数
      let coupon_total = parseFloat(orderMas.store_cart_list[0].coupon_total)//后台已计算的优惠价格
      //共需付总价-已经优惠价-优惠券=龟米积分值
      let integralsVal = parseFloat(oldstore_amount - discountPrice);
      console.info("integralsVal----", integralsVal)
      if (integralsVal > viewPoint) {
        // 当你输入的积分数大于总积分数
        integralsVal = viewPoint;
      }
      // -----------------计算需要多少积分 end--------------------
      integralPrice = integralsVal;
      // integralPrice = parseFloat(that.data.integralsValue == '' ? 0 : that.data.integralsValue);
    }
    // store_cart_list[0].store_amount = parseFloat(oldstore_amount - integralPrice - discountPrice);//满减包邮下的实付
    var storeAmount = parseFloat(oldstore_amount - integralPrice - discountPrice);//满减包邮下的实付 
    store_cart_list[0].store_amount = Math.floor(storeAmount * 100) / 100;//小数点后去两位
    console.info(Math.floor(storeAmount * 100) / 100, "store_cart_list[0].store_amount", store_cart_list[0].store_amount, "store_cart_list", store_cart_list);
    store_cart_list[0].coupon_total = parseFloat(oldcoupon_total + integralPrice + discountPrice);//满减包邮下的优惠
    that.setData({
      orderMas: orderMas,
      integralsValue: integralPrice,//龟米积分抵扣值
      store_cart_list: store_cart_list,
      order_amount: store_cart_list[0].store_amount,//提交订单的实付
      coupon: store_cart_list[0].coupon_total,
      discountPrice: discountPrice
    })
  },
  // 选择优惠券
  gotovouchers: function (e) {
    let that = this;
    let ifManSong = that.data.orderMas.ifManSong;
    let ifPackageMall = that.data.orderMas.ifPackageMall;
    let order_amount = that.data.store_cart_list[0].store_totle;//实付总金额
    wx.navigateTo({
      url: '/pages/my/vouchers/vouchers?order_amount=' + order_amount + '&ifManSong=' + ifManSong + '&ifPackageMall=' + ifPackageMall + '&showType=2',
    })
  },
  onSubmitOrder: function (e) {//提交订单
    var selfpages = this;
    // ************禁止多次点击**************
    if (selfpages.data.isClickBind) {
      return;
    }
    selfpages.setData({ isClickBind: true });
    // ************禁止多次点击 end**************
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log("formId:" + e.detail.formId);
    var booking_times = selfpages.data.appointmentTime + selfpages.data.selectHam;
    // 判断地址是否为空
    if (selfpages.data.address_info == null && selfpages.data.since_hand == 0) {
      wx.hideLoading();
      selfpages.setData({ isPrompt: !selfpages.data.isPrompt, promptTit: selfpages.data.promptTitle })
      setTimeout(function () {
        selfpages.setData({
          isPrompt: !selfpages.data.isPrompt,
          isClickBind: false,//还原点击事件
        })
      }, 2000)
      return;
    }
    // 提交订单前出现信息报错
    console.log("selfpages.data.orderMas.is_freight:" + selfpages.data.is_freight)
    if (selfpages.data.is_freight != '' && selfpages.data.is_freight != null) {
      wx.hideLoading();
      selfpages.setData({ isPrompt: !selfpages.data.isPrompt, promptTit: selfpages.data.is_freight })
      setTimeout(function () {
        selfpages.setData({
          isPrompt: !selfpages.data.isPrompt,
          isClickBind: false,//还原点击事件
        })
      }, 2000)
      return;
    }
    console.log("booking_times:" + booking_times)
    // 获取红包信息
    var couponPrice = wx.getStorageSync('couponPrice') == '' ? '' : wx.getStorageSync('couponPrice');
    console.info("couponPrice---", couponPrice)
    let red_packetId = couponPrice.packetId;
    let red_discount = couponPrice.discountStr;
    let red_storeId = couponPrice.storeId;
    let red_use_point = selfpages.data.integralsValue;
    appUtil.controllerUtil.onSubmitOrder({
      goods: selfpages.data.goods_id,
      pintuan: '0',//0不是拼团 1是拼团
      cart_id: selfpages.data.cart_id,
      ifcart: selfpages.data.ifcart,
      spec_key: selfpages.data.spec_key,
      address_id: selfpages.data.address_info == null ? '' : selfpages.data.address_info.id,
      order_msg: (typeof (this.data.order_msgs) == "undefined") ? [] : this.data.order_msgs,
      // order_msg: '[{ "store_id": "4878", "msg": "就是提交订单的" }]'
      booking_time: this.data.chioceHours == 0 ? '' : booking_times,//预约时间
      since_hand: selfpages.data.since_hand,//是否自提0配送，1自提
      order_from: 3,//订单来源 1web 2手机 3小程序
      formId: e.detail.formId,
      red_packet_id: couponPrice == '' || couponPrice == null || typeof (couponPrice) == 'undefined' ? 0 : red_packetId,   // 红包id   对应订单确认页的  packetId 
      red_packet_price: couponPrice == '' || couponPrice == null || typeof (couponPrice) == 'undefined' ? 0 : red_discount, 		// 红包金额  对应订单确认页的  discount 
      red_packet_source: couponPrice == '' || couponPrice == null || typeof (couponPrice) == 'undefined' ? 0 : red_storeId, 	// 红包来源  对应订单确认页的  storeId 
      use_point: red_use_point == "" || red_use_point == null || typeof (red_use_point) == 'undefined' ? 0 : red_use_point,		//用户使用多少积分
    }, function (submitData) {
      console.info("submitData---", submitData)
      if (submitData.data.succeeded) {
        // 判断是否要调用支付接口（当实付金额为0时不调用支付接口）
        if (selfpages.data.order_amount == 0) {
          // 不调用支付接口
          var submitOrder = submitData.data.data;
          var orderId = submitOrder.suborder_list[0].order_id;
          wx.redirectTo({
            url: '/pages/my/order/orderDetail/orderDetail?orderId=' + orderId + '&isShowIntegral=1',
          })
          return
        }
        // ***********提交订单----调用支付***************
        selfpages.gotoApplyPay(submitData); // 提交订单----调用支付
        // *************提交订单----调用支付*************
      } else {
        // 调用接口异常
        wx.hideLoading();
        selfpages.setData({ isPrompt: !selfpages.data.isPrompt, promptTit: submitData.data.message.descript })
        setTimeout(function () {
          selfpages.setData({
            isPrompt: !selfpages.data.isPrompt,
            isClickBind: false,//还原点击事件
          })
        }, 2000)
      }
    }, function (submitData) {
      selfpages.setData({ isClickBind: false });//支付失败之后还原点击事件
      console.log(submitData)
    })
  },
  // 提交订单----调用支付
  gotoApplyPay: function (submitData) {
    var selfpages = this;
    if (submitData.data.succeeded == true) {
      //调用提交订单接口成功
      var submitOrder = submitData.data.data;
      var orderId = submitOrder.suborder_list[0].order_id;
      var orderIdArr = [];
      for (var o = 0; o < submitOrder.suborder_list.length; o++) {
        orderIdArr.push(submitOrder.suborder_list[o].order_id);
      }
      selfpages.setData({
        since_hand: selfpages.data.since_hand
      })
      //判断openid是否为空,若为空，则重新获取openid
      selfpages.getOpenIdData();
      appUtil.controllerUtil.gotoApplyPay({//支付接口
        payType: 'wxa',
        openid: appUtil.appUtils.getOpenIdData(),
        type: 1,
        order_id: orderIdArr.join(','),
      }, function (gotoApplyPayData) {
        if (gotoApplyPayData.data.succeeded == true) {
          // ************提交订单----调用微信支付***************
          selfpages.getGotoApplyPay(gotoApplyPayData, orderId);
          // *************提交订单----调用微信支付**************
        } else {
          //支付接口调用失败
          wx.hideLoading()
          selfpages.setData({ isPrompt: !selfpages.data.isPrompt, promptTit: '支付失败' })
          setTimeout(function () {
            selfpages.setData({
              isPrompt: !selfpages.data.isPrompt,
              isClickBind: false,//支付失败之后还原点击事件
            })
            // wx.hideLoading();
          }, 2000)
        }
      })
    } else {
      //调用提交订单接口失败
      wx.hideLoading()
      if (submitData.data.message.descript == '你的账号在别处登录了，请重新登录') {
        selfpages.setData({ isPrompt: !selfpages.data.isPrompt, promptTit: submitData.data.message.descript })
        setTimeout(function () {
          selfpages.setData({
            isPrompt: !selfpages.data.isPrompt,
            isClickBind: false,//支付失败之后还原点击事件
          })
          // wx.hideLoading();
        }, 2000)
      } else {
        selfpages.setData({ isPrompt: !selfpages.data.isPrompt, promptTit: '提交订单失败' })
        setTimeout(function () {
          selfpages.setData({
            isPrompt: !selfpages.data.isPrompt,
            isClickBind: false,//支付失败之后还原点击事件
          })
          // wx.hideLoading();
        }, 2000)
      }
    }
  },
  // 提交订单----调用微信支付
  getGotoApplyPay: function (gotoApplyPayData, orderId) {
    var selfpages = this;
    //支付接口调用成功
    console.log(gotoApplyPayData.data.data)
    console.log("***********支付接口内容**************")
    var payorderList = gotoApplyPayData.data.data;
    // 获取prepay_id begin
    var payorderListpackage = payorderList.package;
    var prepayIdNum = payorderList.package.lastIndexOf("=");
    var prepayId = payorderListpackage.substring(prepayIdNum + 1, payorderListpackage.length);
    console.log("prepayId:" + prepayId)
    // 获取prepay_id end
    console.log("orderId:" + orderId)
    wx.hideLoading();
    wx.requestPayment({//调用微信支付接口
      'appId': payorderList.appId,
      'timeStamp': payorderList.timeStamp,
      'nonceStr': payorderList.nonceStr,
      'package': payorderList.package,
      'signType': payorderList.signType,
      'paySign': payorderList.paySign,
      'success': function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({//关闭当前页面，跳到订单详情
          url: '/pages/my/order/orderDetail/orderDetail?orderId=' + orderId + '&isShowIntegral=1',
        })
        selfpages.setData({ isClickBind: false });//支付成功之后还原点击事件
        console.log("支付成功");
      },
      'fail': function (res) {
        console.log("fail支付失败");
        console.log(selfpages.data.since_hand)
        selfpages.setData({ isClickBind: false });//支付失败之后还原点击事件
        wx.hideLoading()
      },
      complete: function (res) {
        console.log(res)
        if (res.errMsg == 'requestPayment:cancel') {
          console.log("complete:支付失败");
          console.log(selfpages.data.since_hand)
        }
      }
    })
  },
  //判断openid是否为空
  getOpenIdData: function () {
    //判断openid是否为空
    if (appUtil.appUtils.getOpenIdData() == '' || appUtil.appUtils.getOpenIdData() == null || typeof (appUtil.appUtils.getOpenIdData()) == 'undefined') {
      // openid为空
      wx.login({
        success: res => {
          console.info(res);
          if (res.code) {
            //发起网络请求
            console.info("code:res.code" + res.code)
            appUtil.controllerUtil.getUserOpenIdController({ code: res.code }, function (res) {
              console.info(JSON.stringify(res))
              appUtil.appUtils.setSessionkeyData(res.data.data.session_key);
              appUtil.appUtils.setOpenIdData(res.data.data.openid);
              console.log("重新保存openid")
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('couponPrice', '');//将优惠券价格缓存到本地的值给清空
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        console.log("loading")
      }
    })
    var defaultAddress = (appUtil.appUtils.getMemberIdData().userData == null) ? '' : appUtil.appUtils.getMemberIdData().userData.defaultAddress;
    wx.setStorageSync("defaltId", defaultAddress);//初始化地址id，将默认地址id defaultAddress赋值给defaltId
    //判断是否登陆，即判断能否获取到用户的token
    if (appUtil.appUtils.getTokenData() == null || appUtil.appUtils.getTokenData() == "") {
      // 未登录
      wx.switchTab({
        url: '/pages/newLogin/newLogin',
      })
    } else {//已登录
      console.info("onLoad")
      console.info("-------------options------------------")
      this.getOrederdata(options);
    }

    //0.判断是否单个商品或购物车列表集合 //goods_id|Count
    // var goods_id = options.goods_id;
    // var tokens = appUtil.appUtils.getTokenData();
    //1 路径上面拿去good_id
    //2拿到token
    //3、 调用接口
    //4、把数据写到 data里面
    //5、

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.info("初次渲染完成")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("******************show********************")
    console.log(typeof (this.data.cart_id) == 'undefined')
    //*********支付失败后对价格进行重新渲染*****************
    if (this.data.since_hand == 0) {//选择配送后进行重新渲染
      var getDefaltId = appUtil.appUtils.getDefaltId();//选择地址之后返回的地址id
      // var defaultAddress = appUtil.appUtils.getMemberIdData().userData.defaultAddress;
      var defaultAddress = (appUtil.appUtils.getMemberIdData().userData == null) ? '' : appUtil.appUtils.getMemberIdData().userData.defaultAddress;
      if (typeof (this.data.cart_id) != 'undefined' || typeof (this.data.goods) != 'undefined' || typeof (this.data.spec_key) != 'undefined' || typeof (this.data.ifcart) != 'undefined') {
        if (getDefaltId != defaultAddress) {
          this.getAddressInfoAgain(getDefaltId);
          console.info("显示1")
        } else {
          this.getAddressInfoAgain(defaultAddress);
          console.info("显示2")
        }
      }
    } else {//选择自提之后进行重新渲染
      var addressId = '';
      this.getAddressInfoAgain(addressId)
    }
    //*********支付失败后对价格进行重新渲染 end*****************
    // 选择优惠券之后重新计算价格
    if (wx.getStorageSync('couponPrice') != '' && wx.getStorageSync('couponPrice') != null) {
      console.info("couponPrice-----show")
      let oldstore_amount = this.data.oldstore_amount;//原始实付价格
      let oldcoupon_total = this.data.oldcoupon_total;//原始优惠数量（即优惠了coupon_total）
      this.getAmountOfCalculation(this.data.orderMas, oldstore_amount, oldcoupon_total);//计算减去优惠券、积分之后的价格
      // this.getintegrals(this.data.orderMas)
    }

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})