var appUtil = require('../../utils/appUtil.js');
Page({
  data: {
    delHidden: true,
    calHidden: false,
    tipText: "编辑",
    tatal_price: 0,
    ischeckAll: false,

    stop_propagation:true
  },
  //去购物
  goShop: function () {
    wx.switchTab({
      url: '/pages/home2/home2',
    })
  },
  //查看店铺
  checkStore: function (e) {
    if (!appUtil.lrhMethods.checkPageState()) {
      return;
    }
    var jumpType = e.currentTarget.dataset.jumptype;
    var storeId = e.currentTarget.id;
    console.log(jumpType);
    if (jumpType == 2) {
      wx.navigateTo({
        url: '/pages/store/index?storeId=' + storeId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/store/glspecial/glspecial?storeId=' + storeId,
      })
    }
  },
  //去支付
  toPay: function () {
    var cart = this.data.cart;
    var cartStr = "";
    for (var i in cart) {
      if (cart[i].storePrice != 0) {
        var flag = 0;
        for (var j in cart[i].cartList) {
          if (cart[i].cartList[j].isCheck && !cart[i].cartList[j].delFlag) {
            if (flag == 0) {
              cartStr = cartStr + cart[i].cartList[j].cart_id;
              flag = 1;
            } else {
              cartStr = cartStr + "," + cart[i].cartList[j].cart_id;
            }

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
  //查看商品详情
  checkProduct: function (e) {
    if (!appUtil.lrhMethods.checkPageState()) {
      return;
    }
    var goodId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/goodsdetail?goodId=' + goodId,
    })
  },
  //全选
  checkAll: function () {
    var ischeckAll = !this.data.ischeckAll;
    var cart = this.data.cart;
    this.setData({ ischeckAll: ischeckAll });
    //ischeckAll为true时候，是点击后为选上状态
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = ischeckAll;
      for (var j = 0; j < cart[i].cartList.length; j++) {
        var isCheckTmp = cart[i].cartList[j].isCheck;
        cart[i].cartList[j].isCheck = ischeckAll;
      }
    }
    this.setData({ cart: cart });
  },
  //查看店铺
  tapSingleStore: function (e) {
    var id = e.currentTarget.id;
    var cart = this.data.cart;
    if (this.data.delHidden) {//如果是要编辑，才进来
     // console.log("执行了---");
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].store_id != id) {
          if (cart[i].isCheck) {
            cart[i].storePrice = 0;
          }
          cart[i].isCheck = false;
          for (var j = 0; j < cart[i].cartList.length; j++) {
            cart[i].cartList[j].isCheck = false;
          }
        }

      }
      this.setData({ cart: cart });//先设置勾选的状态
    }

    this.setData({ cartO: cart });

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].store_id == id) {
        var isCheck = !cart[i].isCheck;
        // cart[i].storePrice = 0;
        //isCheck 如果等于true，就是点击后为选上状态
        cart[i].isCheck = !cart[i].isCheck;
        for (var j = 0; j < cart[i].cartList.length; j++) {
          cart[i].cartList[j].isCheck = isCheck;
        }
      }
    }
    this.setData({ cart: cart });//先设置勾选的状态

    var cartO = this.data.cartO;
    for (var i = 0; i < cartO.length; i++) {//设置价格
      if (cartO[i].store_id == id) {
        var isCheck = cartO[i].isCheck;
        for (var j = 0; j < cartO[i].cartList.length; j++) {
          console.log("次序：" + j + "---店铺改变后选择状态：" + !isCheck + "---商品原来选择状态：" + cartO[i].cartList[j].isCheck);
          if (!isCheck && !cartO[i].cartList[j].isCheck && !cartO[i].cartList[j].delFlag) {
            console.log("增加次序：" + j);
            this.changeSingleStorePrice(cartO[i].store_id, cartO[i].cartList[j].discountPriceStr, 1, cartO[i].cartList[j].goods_num);
          } else if (isCheck && cartO[i].cartList[j].isCheck && !cartO[i].cartList[j].delFlag) {
            console.log("减少次序：" + j);
            this.changeSingleStorePrice(cartO[i].store_id, cartO[i].cartList[j].discountPriceStr, 0, cartO[i].cartList[j].goods_num);
          }
        }
      }
    }

  },
  //选择单个商品
  tapSingleGood: function (e) {
    var id = e.currentTarget.id;
    var cart = this.data.cart;
    var storeId = e.currentTarget.dataset.storeid;
    for (var i = 0; i < cart.length; i++) {
      for (var j = 0; j < cart[i].cartList.length; j++) {
        var good = cart[i].cartList[j];
        if (cart[i].store_id != storeId) {
          cart[i].storePrice = 0;
          cart[i].isCheck = 0;
          for (var j = 0; j < cart[i].cartList.length; j++) {
            cart[i].cartList[j].isCheck = false;
          }
        }
        if (good.cart_id == id) {
          var isCheck = cart[i].cartList[j].isCheck;
          if (isCheck) {//原来是选择的，现在要取消
            this.changeSingleStorePrice(cart[i].store_id, cart[i].cartList[j].discountPriceStr, 0, cart[i].cartList[j].goods_num);
          } else {
            this.changeSingleStorePrice(cart[i].store_id, cart[i].cartList[j].discountPriceStr, 1, cart[i].cartList[j].goods_num);
          }
          cart[i].cartList[j].isCheck = !cart[i].cartList[j].isCheck;
          break;
        }
      }
    }
    this.setData({ cart: cart });
  },
  //第一个参数是改变的单价，第二个是家或者减（1是加），第三个是改变的数量
  changeSingleStorePrice: function (storeId, changeprice, flag, changenum) {
    var cart = this.data.cart;
    var index = -1;
    for (var i in cart) {
      if (storeId == cart[i].store_id) {
        index = i;
        break;
      }
    }
    var storePrice = parseFloat(cart[index].storePrice);
    var changeNumLast = parseFloat(changeprice * changenum).toFixed(2);
    if (flag) {
      storePrice = storePrice + parseFloat(changeNumLast);
    } else {
      storePrice = storePrice - parseFloat(changeNumLast);
    }
    cart[i].storePrice = parseFloat(storePrice).toFixed(2);
    this.setData({ cart: cart });
    console.log(this.data.cart);
  },

  //初始化数据到data
  transFromServerData: function (cart) {
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = false;
      cart[i].storePrice = 0;
      for (var j = 0; j < cart[i].cartList.length; j++) {
        cart[i].cartList[j].isCheck = false;
      }
    }
    this.setData({ cart: cart });
  },
  //购物车商品数量变化（从购物车）
  delFromServer: function (good) {
    var that = this;
    console.log(good);
    var goods_spec = "";
    if (good.goods_spec != null && good.goods_spec != "") {
      var goods_specTmp = good.goods_spec;
      var len = goods_specTmp.length;
      goods_spec = goods_specTmp.substring(1, len - 1);
    }
    if (good.spec_key == null) {
      good.spec_key = "";
    }
    wx.request({
      url: appUtil.ajaxUrls().substractCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": good.store_id,
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

        } else if (res.data.error.code == "401"){
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
  //购物车商品数量变化（从购物车）
  substractFromServer: function (good) {
    var that = this;
    
    console.log(good);
    var goods_spec = good.goods_spec;//"";
    // if (good.goods_spec != null && good.goods_spec != "") {
    //   var goods_specTmp = good.goods_spec;
    //   var len = goods_specTmp.length;
    //   goods_spec = goods_specTmp.substring(1, len - 1);
    // }
    if (good.spec_key == null) {
      good.spec_key = "";
    }
    wx.request({
      //url: appUtil.ajaxUrls().updateByCartId, //
      //url:"https://api.xiaoguikuaipao.com/api/v1/updateByCartId",
      url: appUtil.ajaxUrls().substractCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": good.store_id,
        // "cart_id": good.cart_id,
        "goods_id": good.goods_id,
        "goods_price": good.goods_price,
        "goods_num": parseInt(good.goods_num),
        "goods_spec": goods_spec,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        "spec_value": good.goods_specValue,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": good.spec_key,

        "goods_name": good.goods_name,
        "bl_id":0,
        "goods_image": good.goods_image,
        "store_avatar": good.store_avatar,
        "store_name": good.store_name
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
  //修改商品数量
  changeNum: function (e) {
    var id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    var cart = this.data.cart;
    console.log(flag + "----" + id);
    if (flag == "add") {
      wx.showLoading({
        title: '增加中',
        mask: true
      })
      for (var i = 0; i < cart.length; i++) {
        for (var j = 0; j < cart[i].cartList.length; j++) {
          var good = cart[i].cartList[j];
          if (good.cart_id == id) {
            var numTmp = cart[i].cartList[j].goods_num;
            cart[i].cartList[j].goods_num = numTmp + 1;
            this.substractFromServer(cart[i].cartList[j]);
            if (cart[i].cartList[j].isCheck) {
              this.changeSingleStorePrice(cart[i].store_id, cart[i].cartList[j].discountPriceStr, 1, 1);
            }
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
            wx.showLoading({
              title: '减少中',
              mask: true
            })
            cart[i].cartList[j].goods_num = numTmp - 1;
            this.substractFromServer(cart[i].cartList[j]);
            if (cart[i].cartList[j].isCheck) {
              this.changeSingleStorePrice(cart[i].store_id, cart[i].cartList[j].discountPriceStr, 0, 1);
            }
            break;
          }
        }
      }
    }
    this.setData({ cart: cart });
  },
  //从服务器获取个人购物车数据
  getCartData: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
      mask:true
    })
    wx.request({
      url: appUtil.ajaxUrls().getShopncCartByMemberId + "/" + that.data.memberId,
      //url: 'https://api.xiaoguikuaipao.com/api/v1/getShopncCartByMemberId/'+that.data.memberId,
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
      },
      complete:function(res){
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  //点击修改完成
  finished: function () {
    var cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = false;
      cart[i].storePrice = 0;
      for (var j = 0; j < cart[i].cartList.length; j++) {
        cart[i].cartList[j].isCheck = false;
      }
    }
    this.setData({ cart: cart });
    this.setData({ delHidden: true, calHidden: false, tipText: "编辑", tatal_price: 0, ischeckAll: false });
  },
  //点击编辑
  edit: function () {
    var cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      cart[i].isCheck = false;
   
      for (var j = 0; j < cart[i].cartList.length; j++) {
        cart[i].cartList[j].isCheck = false;
      }
    }
    this.setData({ cart: cart });
    this.setData({ delHidden: false, calHidden: true, tipText: "取消", tatal_price: 0, ischeckAll: false });
  },
  //点击删除
  del: function () {
    // var cart = this.data.cart;
    // for (var i = 0; i < cart.length; i++) {
    //   for (var j = 0; j < cart[i].cartList.length; j++) {
    //     var isCheck = cart[i].cartList[j].isCheck;
    //     if (isCheck) {
    //       cart[i].cartList[j].goods_num = 0;
    //       this.delFromServer(cart[i].cartList[j]);
    //       cart[i].cartList.splice(j--, 1);
    //     }
    //   }
    // }
    // this.setData({ cart: cart });

    var cart = this.data.cart;
    var delCarts = [];
    for (var i = 0; i < cart.length; i++) {
      for (var j = 0; j < cart[i].cartList.length; j++) {
        var isCheck = cart[i].cartList[j].isCheck;
        if (isCheck) {
          cart[i].cartList[j].goods_num = 0;
          delCarts.push(cart[i].cartList[j].cart_id);
          cart[i].cartList.splice(j--, 1);
        }
      }
    }
    this.delFromServerNew(delCarts);
    this.setData({ cart: cart });
  },
  //删除请求
  delFromServerNew: function (delCarts) {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().delCartsNew, //
      data: {
        cart_id:delCarts
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("新删除返回");
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
  onLoad: function (options) {
    var memberId = appUtil.lrhMethods.getMemberIdUser();
    this.setData({ memberId: memberId });

  },
  onReady: function () {

  },
  onShow: function () {
    appUtil.lrhMethods.initPageState();
    var memberId = appUtil.lrhMethods.getMemberId();
    this.setData({memberId:memberId});
    if (this.data.memberId != null) {
      this.getCartData();
    }else{
      this.setData({ cart:[]});
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    var memberId = appUtil.lrhMethods.getMemberIdUser();
    if (memberId != null) {
      this.setData({memberId:memberId});
      this.getCartData();
    }else{
      wx.stopPullDownRefresh();
    }
  }
})
