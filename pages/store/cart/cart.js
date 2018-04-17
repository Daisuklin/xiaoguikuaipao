var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    delHidden: true,
    calHidden: false,
    tipText: "编辑",

    tatal_price: 0,
    ischeckAll: false
  },
  goShop:function(){
    wx.switchTab({
      url: '/pages/home2/home2',
    })
  },
  toPay: function () {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var cart = this.data.cart;
    var cartStr = "";
    for (var i in cart) {
      if (cart[i].storePrice != 0) {
        var flag = 0;
        for (var j in cart[i].cartList) {
          if (cart[i].cartList[j].isCheck && !cart[i].cartList[j].delFlag) {
            if (flag == 0) {
              cartStr = cartStr + cart[i].cartList[j].cart_id;
            } else {
              cartStr = cartStr + "," + cart[i].cartList[j].cart_id;
            }
            flag = 1;
          }
        }
        break;
      }
    }
    console.log(cartStr);
    if (cartStr == "") {
      wx.showToast({
        title: '请选商品',
        duration: 800,
        icon: "loading"
      })
      return;
    }
    wx.navigateTo({
      url: "/pages/my/order/order?goodId=" + '' + "&spaecKey=" + '' + "&cartId=" + cartStr,
    })
  },
  checkProduct: function (e) {
    var goodId = e.currentTarget.id;
    wx.redirectTo({
      url: '../../detail/goodsdetail?goodId=' + goodId,
    })
  },
  checkAll: function () {
    var ischeckAll = !this.data.ischeckAll;
    var cart = this.data.cart;
    this.setData({ ischeckAll: ischeckAll });
    //ischeckAll为true时候，是点击后为选上状态
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = ischeckAll;
      for (var j = 0; j < cart[i].cartList.length; j++) {
        var isCheckTmp = cart[i].cartList[j].isCheck;

        if (isCheckTmp && !ischeckAll) {//如果原来是已经选择了的，此时是要取消就要减去总价
          this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 0, cart[i].cartList[j].goods_num);
        } else if (!isCheckTmp && ischeckAll) {//如果原来是没选择的，此时是要取消就要加上总价
          this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 1, cart[i].cartList[j].goods_num);
        }
        cart[i].cartList[j].isCheck = ischeckAll;
      }
    }
    this.setData({ cart: cart });
  },
  tapSingleStore: function (e) {
    var id = e.currentTarget.id;
    var cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].store_id == id) {
        var isCheck = !cart[i].isCheck;
        //isCheck 如果等于true，就是点击后为选上状态
        cart[i].isCheck = !cart[i].isCheck;
        for (var j = 0; j < cart[i].cartList.length; j++) {
          var isCheckTmp = cart[i].cartList[j].isCheck;
          if (isCheckTmp && !isCheck && !cart[i].cartList[j].delFlag) {//如果原来是已经选择了的，此时是要取消就要减去总价
            this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 0, cart[i].cartList[j].goods_num);
          } else if (!isCheckTmp && isCheck && !cart[i].cartList[j].delFlag) {//如果原来是没选择的，此时是要取消就要加上总价
            this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 1, cart[i].cartList[j].goods_num);
          }
          cart[i].cartList[j].isCheck = isCheck;
        }
      }
    }
    this.setData({ cart: cart });
  },
  tapSingleGood: function (e) {
    var id = e.currentTarget.id;
    var cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      for (var j = 0; j < cart[i].cartList.length; j++) {
        var good = cart[i].cartList[j];
        if (good.cart_id == id) {
          var isCheck = cart[i].cartList[j].isCheck;
          if (isCheck) {//原来是选择的，现在要取消
            this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 0, cart[i].cartList[j].goods_num);
          } else {
            this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 1, cart[i].cartList[j].goods_num);
          }
          cart[i].cartList[j].isCheck = !cart[i].cartList[j].isCheck;
          break;
        }
      }
    }
    this.setData({ cart: cart });
  },
  //初始化数据到data
  transFromServerData: function (cart) {
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = false;
      for (var j = 0; j < cart[i].cartList.length; j++) {
        cart[i].cartList[j].isCheck = false;
      }
    }
    this.setData({ cart: cart });
    // if (cart[0]=undefined){
    //   this.setData({ good: cart[0].cartList[0]});
    // }
  },
  changeTotalPrice: function (changeprice, flag, changenum) {//第一个参数是改变的单价，第二个是家或者减（1是加），第三个是改变的数量
    console.log(changeprice + "-----" + flag + "-----" + changenum);
    var changeNumLast = changeprice * changenum;
    console.log("改变的数：" + changeNumLast);
    var tatal_price = this.data.tatal_price;
    if (flag) {
      tatal_price = tatal_price + changeNumLast;
    } else {
      tatal_price = tatal_price - changeNumLast;
    }
    var num1 = parseFloat(tatal_price);
    tatal_price = Math.round(num1 * 100) / 100;
    this.setData({ tatal_price: tatal_price });
  },
  changeNum: function (e) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    var cart = this.data.cart;
    console.log(flag + "----" + id);
    if (flag == "add") {
      for (var i = 0; i < cart.length; i++) {
        for (var j = 0; j < cart[i].cartList.length; j++) {
          var good = cart[i].cartList[j];
          if (good.cart_id == id) {
            var numTmp = cart[i].cartList[j].goods_num;
            cart[i].cartList[j].goods_num = numTmp + 1;
            if (cart[i].cartList[j].isCheck) {
              this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 1, 1);
            }
            this.substractFromServer(cart[i].cartList[j]);
            break;
          }
        }
      }
    } else {
      for (var i = 0; i < cart.length; i++) {
        for (var j = 0; j < cart[i].cartList.length; j++) {
          var good = cart[i].cartList[j];
          if (good.cart_id == id) {
            var numTmp = cart[i].cartList[j].goods_num;
            if (numTmp == 1) {
              break;
            }
            cart[i].cartList[j].goods_num = numTmp - 1;
            if (cart[i].cartList[j].isCheck) {
              this.changeTotalPrice(cart[i].cartList[j].discountPriceStr, 0, 1);
            }
            this.substractFromServer(cart[i].cartList[j]);
            break;
          }
        }
      }
    }
    this.setData({ cart: cart });
  },
  //购物车商品数量变化（从购物车）
  substractFromServer: function (good) {
    wx.showLoading({
      title: '操作中',
      mask: true
    })
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var that = this;
    console.log(good);
    var goods_spec = "";
    if (good.goods_spec != null && good.goods_spec != "") {
      var goods_specTmp = good.goods_spec;
      var len = goods_specTmp.length;
      goods_spec = goods_specTmp.substring(1, len - 1);
    }

    wx.request({
      url: appUtil.ajaxUrls().substractCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": that.data.storeId,
        "goods_id": good.goods_id,
        "goods_price": good.goods_price,
        "goods_num": parseInt(good.goods_num),
        "goods_spec": goods_spec,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        "spec_value": good.goods_specValue,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": good.spec_key
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("修改返回" + parseInt(good.goods_num) + "---" + goods_spec);
        console.log("token:" + appUtil.appUtils.getTokenDataUser());
        console.log(res)
        if (res.data.message.type == "success") {

        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        }
        wx.hideLoading();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  getCartData: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().getSingleStoreCart + "/"+that.data.memberId+"/"+that.data.storeId, //
      //url:'https://api.xiaoguikuaipao.com/api/v1/getShopncCartByMemberId/1631',
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到平台购物车数据" + appUtil.ajaxUrls().getShopncCartByMemberId);
        console.log(res)
        if (res.data.message.type == "success") {
          that.transFromServerData(res.data.data);
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  finished: function () {
    var cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = false;
      for (var j = 0; j < cart[i].cartList.length; j++) {
        cart[i].cartList[j].isCheck = false;
      }
    }
    this.setData({ cart: cart });
    this.setData({ delHidden: true, calHidden: false, tipText: "编辑", tatal_price: 0, ischeckAll: false });
  },
  edit: function () {
    var cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = false;
      for (var j = 0; j < cart[i].cartList.length; j++) {
        cart[i].cartList[j].isCheck = false;
      }
    }
    this.setData({ cart: cart });
    this.setData({ delHidden: false, calHidden: true, tipText: "完成", tatal_price: 0, ischeckAll: false });
  },
  clearCart: function () {
    this.setData({ cart: [],tatal_price: 0 });
    var that = this;
    //clearCart
    wx.request({
      url: appUtil.ajaxUrls().clearCart, //
      data: {
        "memberId": that.data.memberId,
        "storeId": that.data.storeId,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("清空购物车返回");
        console.log(res)
        if (res.data.message.type == "success") {

        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        }
        wx.hideLoading();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  del: function () {
    if (this.data.ischeckAll){
      this.clearCart();
      return;
    }
    var cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      for (var j = 0; j < cart[i].cartList.length; j++) {
        var isCheck = cart[i].cartList[j].isCheck;
        if (isCheck) {
          cart[i].cartList[j].goods_num = 0;
          this.substractFromServer(cart[i].cartList[j]);
          cart[i].cartList.splice(j--, 1);
        }
      }
    }
    this.setData({ cart: cart });
  },
  onLoad: function (options) {
    // var storeId = 4045;
    // var memberId = 51;
    var storeId = options.storeId;
    var memberId = appUtil.lrhMethods.getMemberIdUser();
    this.setData({ storeId: storeId, memberId: memberId });
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({ tatal_price: 0});
    if (this.data.memberId != null) {
      this.getCartData();
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    if (this.data.memberId != null) {
      this.getCartData();
    }
  },
  onReachBottom: function () {

  },
})
