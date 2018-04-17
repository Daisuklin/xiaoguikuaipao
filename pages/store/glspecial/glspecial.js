//获取购物车 /6/that.data.storeId
//获取店铺信息 memberId: 2,storeId: 558
//购物车商品减少 "buyer_id": 6,"store_id": that.data.storeId,
var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    duration: 1000,
    icon: {//本地图片
      collection: "../../../image/detail/sc_01.png",
      collectionSelect: "../../../image/detail/sc_02.png",
      collectionbg: "../../../image/detail/sc_03.png",
      customer: "../../../image/detail/icon_01.png",
      cart: "../../../image/detail/cartb@2x.png",
      store: "../../../image/detail/dianpu@2x.png",
      scancode: "../../../image/detail/saoyisao4@2x.png",
      productImg: "../../../image/detail/icon_pro@2x.png",
      empty: "../../../image/detail/empty2.png",
      dissatisfied: "../../../image/detail/dissatisfied.png",
      satisfied: "../../../image/detail/satisfied.png"
    },
    categories: [],
    carts: [],
    catIndex: 0,
    maskHidden: true,
    cartHidden: true,
    csHidden: true,
    catname: '',
    actHidden: true,
    cartNum: 0,
    cartTotalPrice: 0,
    getByStyle2: false,//标记是否要分类商品
    haveCheckCatId: [],//已经获取到商品的分类
    haveCheckProduct: false,

    animation: true,
    animationText: "+1",
    business: false,
    isPrompt: false,
    defaultUrl: 'api.xiaoguikuaipao.com',//关键url字段
    ruleList: [],
    packageMallList: [],
    allPackgeFeel: 0,//打包费
  },
  //在页面 初始化时候处理两位浮点数,总价格和购物车商品数量
  initCartsData2: function (carts, cartTotalPrice, allCartNum, allPackgeFeel) {
    for (var i in carts) {
      var item = carts[i];
      carts[i].itemPrice = parseFloat(item.discountPriceStr * item.goods_num).toFixed(2);
    }
    this.setData({
      carts: carts,
      cartTotalPrice: parseFloat(cartTotalPrice + allPackgeFeel).toFixed(2),
      cartNum: allCartNum,
      allPackgeFeel: allPackgeFeel
    });

    var carts = this.data.carts;
    var cartStr = "";
    for (var i in carts) {
      if (i == 0) {
        cartStr = cartStr + carts[i].cart_id;
      } else {
        cartStr = cartStr + "," + carts[i].cart_id;
      }
    }
    wx.hideLoading();
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
  //获取购物车 
  getCartData2: function () {
    var that = this;
    wx.showLoading({
      title: '请求中',
      mask: true,
    })
    wx.request({
      //url: appUtil.ajaxUrls().getStoreCartData, //
      url: appUtil.ajaxUrls().getStoreCartData + "/" + that.data.memberId + "/" + that.data.storeId,
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        //'androidApi': '3.3.8'
        'api': 'web',
      },
      success: function (res) {
        console.log("得到店铺购物车返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var carts = res.data.data.cartList;

          that.initCartsData2(carts, res.data.data.cartTotalPrice, res.data.data.allCartNum, res.data.data.allPackgeFeel);
        }

      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();

        wx.showToast({
          title: '服务器忙',
          icon: "loading",
          duration: 800
        })

      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  // 判断店铺是否处于营业时间
  getJudgeBusinessLDY: function () {
    // ***********LDY begin**************
    //  现在时间
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    var Yeart = date.getFullYear(); //年  
    var Mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月  
    var Dates = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();//日  
    var hours = date.getHours();//时  
    var mint = date.getMinutes();//分  
    var sec = date.getSeconds();//秒
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
    var runTime = this.data.store.run_timeStr;
    var nowTime = Yeart + '-' + Mon + '-' + Dates + ' ' + hours + ":" + mint + ":" + sec;//现在时间
    var beginRunTime = Yeart + '-' + Mon + '-' + Dates + ' ' + runTime.substring(0, 8);//开始营业时间
    var endRunTime = Yeart + '-' + Mon + '-' + Dates + ' ' + runTime.substring(9, 17);//结束营业时间
    console.log(nowTime)
    console.log(beginRunTime + "----" + endRunTime)
    var nowTimes = nowTime.replace(/-/g, "/");
    var beginTimes = beginRunTime.replace(/-/g, "/");
    var endTimes = endRunTime.replace(/-/g, "/");
    var beginNum = (Date.parse(nowTimes) - Date.parse(beginTimes)) / 3600 / 1000;//现在时间与开始营业时间相比
    var endNum = (Date.parse(nowTimes) - Date.parse(endRunTime)) / 3600 / 1000;//现在时间与结束营业时间相比
    console.log("beginNum：" + beginNum + " endNum:" + endNum)
    if (beginNum >= 0 && endNum <= 0) {
      // 营业时间
      return true;
    } else {
      // 非营业时间
      return false;
    }
    // ***********LDY end****************
  },
  toPay: function () {
    if (this.data.business) {
      if (appUtil.appUtils.getTokenDataUser() == null) {
        return;
      }
      this.getCartData2();
    } else {
      wx.showToast({
        title: '店铺不在营业时间',
        icon: 'loading',
        duration: 2000
      })
    }
  },
  //查看店铺
  checkStore: function () {
    var storeId = this.data.storeId;
    wx.redirectTo({
      url: '/pages/store/index?storeId=' + storeId,
    })
  },
  //查看商品
  checkProduct: function (e) {
    var id = e.currentTarget.id;
    if (this.data.haveCheckProduct) {
      return;
    }
    this.setData({ haveCheckProduct: true });
    if (getCurrentPages().length > 6) {
      wx.redirectTo({
        url: '/pages/detail/goodsdetail?goodId=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/detail/goodsdetail?goodId=' + id,
      })
    }
  },



  clearLocalGoodList: function () {
    var goods = this.data.goods;
    for (var i in goods) {
      goods[i].cartNum = 0;
      goods[i].discountPriceStr = parseFloat(goods[i].discountPriceStr).toFixed(2);
    }
    this.setData({ goods: goods });
  },

  //清空购物车
  clearCart: function () {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var cartsTmp = this.data.carts;
    this.setData({ carts: [], cartNum: 0, cartTotalPrice: 0 });
    this.clearLocalGoodList();
    this.clearLocalStorageGoodList(cartsTmp);
    this.getDiscount();
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
          that.setData({ cartHidden: true, maskHidden: true });
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
  //从商品列表改变加入购物车的商品数量
  substractFromServerFromList: function (good, goods, flag) {
    var that = this;
    console.log(good);
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    wx.request({
      url: appUtil.ajaxUrls().substractCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": that.data.storeId,
        "goods_id": good.goods_id,
        "goods_price": good.discountPriceStr,
        "goods_num": parseInt(good.cartNum),
        "goods_spec": good.goods_spec,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        "spec_value": good.goods_specValue,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": ''
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("从列表减少返回" + parseInt(good.cartNum));
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          that.changeTotalPriceAndTotalNum(good.discountPriceStr, 1, flag, good.packagingFee);
          that.setData({ goods: goods });
          that.changeLocalStorageGoods(good.goods_id, good.goods_stcids, good.cartNum);
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        } else {
          wx.showToast({
            title: res.data.message.descript,
            icon: "loading",
            duration: 1000,
          })
        }

      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },

  //购物车商品增加（ 从商品列表 ）
  insertShopncCartFromList: function (good, goods) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    console.log(good);
    console.log(good.goods_spec);
    var that = this;
    // var goods_spec = "";
    // if (good.goods_spec != null && good.goods_spec != "") {
    //   var goods_specTmp = good.goods_spec;
    //   var len = goods_specTmp.length;
    //   goods_spec = goods_specTmp.substring(1, len - 1);
    // }
    var goods_spec = good.goods_spec;//"";
    if (good.spec_key == null) {
      good.spec_key = "";
    }

    var store = this.data.store
    wx.request({
      url: appUtil.ajaxUrls().addCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": that.data.storeId,
        "goods_id": good.goods_id,
        "goods_price": good.discountPriceStr,
        "goods_num": parseInt(good.cartNum),
        "goods_spec": goods_spec,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        "spec_value": good.goods_specValue,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": '',
        "store_name": store.store_name,
        "goods_image": good.goods_image,
        "goods_name": good.goods_name,
        "bl_id": 0,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("从列表增加返回" + parseInt(good.cartNum) + "---" + goods_spec);
        console.log(good.goods_id + "---" + good.discountPriceStr + "---" + parseInt(good.cartNum) + "---" + good.goods_specValue +
          "---" + store.store_name + "---" + good.goods_image + "---" + good.goods_name);
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          that.changeTotalPriceAndTotalNum(good.discountPriceStr, 1, "add", good.packagingFee);
          that.changeLocalStorageGoods(good.goods_id, good.goods_stcids, good.cartNum);
          that.setData({ goods: goods });
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        } else {
          wx.showToast({
            title: res.data.message.descript,
            icon: "loading",
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  //购物车商品数量变化（从选规格确定页面）
  substractFromConfirmNum: function (good, changeNum, flag) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var that = this;
    console.log(good);
    var goods_spec = good.goods_specOld;//"";
    if (good.spec_key == null) {
      good.spec_key = "";
    }
    // var goods_spec = "";
    // if (good.goods_specOld != null && good.goods_specOld != "") {
    //   var goods_specTmp = good.goods_specOld
    //   var len = goods_specTmp.length;
    //   goods_spec = goods_specTmp.substring(1, len - 1);
    // }

    wx.request({
      url: appUtil.ajaxUrls().substractCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": that.data.storeId,
        "goods_id": good.goods_id,
        "goods_price": good.discountPriceStr,
        "goods_num": parseInt(good.cartNum),
        "goods_spec": goods_spec,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        "spec_value": good.goods_specValueOld,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": good.spec_key
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          that.changeTotalPriceAndTotalNum(good.discountPriceStr, changeNum, flag, good.packagingFee);
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        } else {
          wx.showToast({
            title: res.data.message.descript,
            icon: "loading",
            duration: 1000,
          })
        }

      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },

  //当管理购物车时候，要调用该函数管理列表里面的商品数
  goodListNumChange: function (id, num) {
    var goods = this.data.goods;
    for (var i in goods) {
      if (goods[i].goods_id == id) {
        goods[i].goodsNum = num;
        break;
      }
    }
    this.setData({ goods: goods });
  },
  //去结算
  toCalcute: function () {
    var token = wx.getStorageSync("token");
    console.log("点击token:" + token);
    if (token == "") {
      wx.navigateTo({
        url: '/pages/store/my/my',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/order/order',
    })
  },
  //查看购物车
  checkCart: function () {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var maskHidden = this.data.maskHidden;
    var cartHidden = this.data.cartHidden;
    var that = this;
    if (cartHidden) {
      this.setData({ maskHidden: !maskHidden, cartHidden: !cartHidden });
    } else {
      setTimeout(function () {
        that.setData({
          maskHidden: true,
          cartHidden: true,
          csHidden: true,
        });
      }, 250);
    }

    if (cartHidden) {
      this.getCartData();
    }
    if (cartHidden) {
      this.setAnimation1();
    } else {
      this.setAnimation2();
    }

  },
  setAnimation1: function () {
    var duration = 300

    var item1 = wx.createAnimation({
      duration: duration,
      transformOrigin: '0 0 0'
    })

    item1.translateY(0).step()

    this.setData({
      item1: item1
    })
  },
  setAnimation2: function () {
    var duration = 300

    var item1 = wx.createAnimation({
      duration: duration,
      transformOrigin: '0 0 0'
    })

    item1.translateY(800).step()

    this.setData({
      item1: item1,
    })
  },
  //规格优化************************************************************************start3
  //244,242  242,244
  checkIsSame: function (str1, str2) {
    if (str1.indexOf(",") > -1) {
      var arr1 = str1.split(",");
      var flag = true;
      for (var i = 0; i < arr1.length; i++) {
        if (str2.indexOf(arr1[i]) == -1) {
          flag = false;
          break;
        }
      }
      return flag;
    } else if (str2.indexOf(",") > -1) {
      var arr2 = str2.split(",");
      var flag = true;
      for (var i = 0; i < arr2.length; i++) {
        if (str1.indexOf(arr2[i]) == -1) {
          flag = false;
          break;
        }
      }
      return flag;
    } else {
      return str1 == str2;
    }
  },
  //在弹出的选规格加入购物车那里，点击对应的规格
  checkSpecification: function (e) {
    var chooseGood = this.data.chooseGood;
    var chooseGoodTmp = chooseGood;
    var goods_spec = chooseGood.goods_spec;//商品规格数组
    var id = e.currentTarget.id;//
    var specKey = e.currentTarget.dataset.speckey;//
    var specValue = chooseGood.goods_specValue;
    if (specKey == goods_spec[id].arrIndex) {
      return;
    }
    goods_spec[id].arrIndex = specKey;
    chooseGood.goods_spec = goods_spec;
    //选规格时候，要判断最大库存

    // chooseGood.cartNum = wx.getStorageSync("chooseGoodNum") == '' ? 11 : wx.getStorageSync("chooseGoodNum");
    this.setData({ chooseGood: chooseGood });//设置一组规格里面，选择哪个商品

    //对不能选的规则做处理,必须要是最后一个选才运行以下代码 start2
    var specChooseNum = 0;
    var noChooseArrIndex = -1;
    var chooseAllSpec = ""
    for (var i in goods_spec) {
      if (goods_spec[i].arrIndex == -1) {
        specChooseNum = specChooseNum + 1;
        noChooseArrIndex = i;
      } else {
        chooseAllSpec = chooseAllSpec + "," + goods_spec[i].arrIndex;
      }
    }
    if (specChooseNum == 0) {//都选了的情况,先进行设置选择的数量
      var chooseAllSpecTmp = chooseAllSpec;
      var lenCheckTmp = chooseAllSpecTmp.length;
      if (chooseAllSpecTmp.indexOf(",") > -1) {
        chooseAllSpecTmp = chooseAllSpecTmp.substring(1, lenCheckTmp);
      }
      for (var key in specValue) {//遍历所有规格,取库存
        if (this.checkIsSame(chooseAllSpecTmp, key)) {
          chooseGood.cartNum = wx.getStorageSync("chooseGoodNum") == '' ? 1 : wx.getStorageSync("chooseGoodNum");
          //debugger
          if (parseInt(chooseGood.cartNum) > parseInt(specValue[key].stock)) {
            wx.showToast({
              title: '当前库存为' + specValue[key].stock,
              icon: "success",
              duration: 800
            })

            chooseGood.cartNum = specValue[key].stock;
            wx.setStorageSync("chooseGoodNum", parseInt(specValue[key].stock));
            this.setData({ chooseGood: chooseGood });//重新根据最大库存设置所选商品的数量
          }
          break;
        }
      }
    }
    if (specChooseNum == 1) {//只差最后一个规格要选的情况
      console.log("只差最后一个规格要选");
      var lastWantToChooseSpecs = goods_spec[noChooseArrIndex];
      var chooseKeyCheck = "";//没有拼接最后规格字段的其他规格的选择组合
      for (var i in goods_spec) {
        var chooseSpecIndexCheck = goods_spec[i].arrIndex;
        if (chooseSpecIndexCheck != -1) {
          chooseKeyCheck = chooseKeyCheck + "," + chooseSpecIndexCheck;
        }
      }
      var lenCheck = chooseKeyCheck.length;
      if (chooseKeyCheck.indexOf(",") > -1) {
        chooseKeyCheck = chooseKeyCheck.substring(1, len);
      }

      for (var i in goods_spec[noChooseArrIndex].vals) {//遍历没有选择的那组规格，拼接最终选择规格去查库存
        var chooseKeyCheckTmp = chooseKeyCheck;
        chooseKeyCheckTmp = chooseKeyCheckTmp + "," + goods_spec[noChooseArrIndex].vals[i].specKey;
        console.info(noChooseArrIndex + "组合：", chooseKeyCheckTmp);
        for (var key in specValue) {//通过遍历到的组合去查该组合的库存
          console.info("遍历的key", key);
          if (this.checkIsSame(chooseKeyCheckTmp, key)) {
            console.log(chooseKeyCheckTmp + "----" + key);
            var stock = specValue[key].stock;
            if (stock < chooseGood.cartNum) {
              console.info("库存不足", goods_spec[noChooseArrIndex]);
              goods_spec[noChooseArrIndex].vals[i].stockEnough = 0;
              console.info("库存不足2", goods_spec[noChooseArrIndex]);
            } else {
              goods_spec[noChooseArrIndex].vals[i].stockEnough = 1;
            }
          }
        }
      }
      console.info("改变后的规格标记：", goods_spec);
      chooseGood.goods_spec = goods_spec;
      this.setData({ chooseGood: chooseGood });
    } else if (specChooseNum == 0) {//都选了的情况,且当前选的key里面没有灰色状态的key同一行
      var obj = this.checkIsSameColumn(specKey, goods_spec);
      var arrChoosed = goods_spec[id];
      var specKeyNowArr = specKey;//当前选择的此组的规格
      var haveSetStateKeys = [];
      for (var key in specValue) {//遍历所有规格,以当前选择的规格为根节点进行判断分类
        console.info("组合", key + "--" + specValue[key].stock + "--" + chooseGood.cartNum);
        if (key.indexOf(specKeyNowArr) > -1 && parseInt(specValue[key].stock) < parseInt(chooseGood.cartNum)) {//对库存不足组合做处理
          //当规格组合中包含当前点击的那个组合、差最后一个没有选的、库存不足的就把那个没有选的设为不可选
          //chooseAllSpec 是当前选的全部规格的组合
          //key是可能选的库存不足的组合
          //判断chooseAllSpec是否有包含只差最后一个规格的组合
          // debugger
          console.info("可能库存不足组合", key + "--" + specValue[key].stock + "--" + chooseGood.cartNum);
          var checkValue = this.checkChooseAllSpecIsNotLastSameWhithKey(chooseAllSpec, key);
          if (checkValue.flag) {//如果是true就设置noChooseKey为灰色状态
            haveSetStateKeys.push(checkValue.noChooseKey);
            this.setHaveChooseSpecState(0, checkValue.noChooseKey, chooseGood);
          }
        } else {//对库存足的组合做处理
          console.info("库存足的组合：", key);
          if (key.indexOf(",") > -1) {
            var keyArr = key.split(",");
            var haveSetKey = [];
            var that = this;
            keyArr.forEach(function (item) {
              console.log(item);
              if (!that.checkIsHaveSameInArr(haveSetKey, item) && !that.checkIsHaveSameInArr(haveSetStateKeys, item) && !that.checkIsHaveSameInArr(obj.arr, item)) {
                haveSetKey.push(item);
                that.setHaveChooseSpecState(1, item, chooseGood);
              }
            });
          } else {
            //TODO设置单个key

          }
        }
      }
      // var page = this;
      // if(obj.flag){
      //   obj.arr.forEach(function (item) {//取出一行中灰色的key
      //     page.setHaveChooseSpecState(0,item, chooseGood);
      //   });
      // }
    }
    //对不能选的规则做处理,必须要是最后一个选才运行以下代码 end2
    var flag = true;
    for (var i in goods_spec) {
      if (goods_spec[i].arrIndex == -1) {
        flag = false;
      }
    }
    if (flag) {//如果是true证明选全了规格，改变价格
      var chooseKey = "";
      for (var i in goods_spec) {
        var chooseSpecIndex = goods_spec[i].arrIndex;
        chooseKey = chooseKey + "," + chooseSpecIndex;
      }
      var len = chooseKey.length;
      if (chooseKey.indexOf(",") > -1) {
        chooseKey = chooseKey.substring(1, len);
      }
      for (var key in specValue) {
        if (chooseKey == key) {
          if (chooseGood.discountPriceStr = Number(Number(specValue[key].price) * (Number(chooseGood.price_discount) / 10)).toFixed(2) > 0) {
            chooseGood.discountPriceStr = Number(Number(specValue[key].price) * (Number(chooseGood.price_discount) / 10)).toFixed(2);
          } else {
            chooseGood.discountPriceStr = Number(specValue[key].price).toFixed(2);
          }
          chooseGood.spec_key = key;
          chooseGood.stock = specValue[key].stock;
          this.setData({ chooseGood: chooseGood });
        }
      }
    }
  },
  //需要判断当前点击的规格key所在的行，有没有事灰色状态的key
  checkIsSameColumn: function (key, goods_spec) {
    var col = [];//所在行
    var flag = false;
    goods_spec.forEach(function (item) {//找到那一行
      item.vals.forEach(function (item2) {
        if (item2.specKey == key) {
          col = item.vals;
        }
      });
    });
    var arr = [];
    col.forEach(function (item) {//取出一行中灰色的key
      if (item.stockEnough == 0) {
        arr.push(item.specKey);
        flag = true;
      }
    });
    var obj = {
      arr: arr,
      flag: flag
    }
    return obj;
  },
  //选规格时候，要判断最大库存
  //改变数字时候，判断最大库存
  //改变选择好的规格商品数量，为加入前做准备
  checkGoodStorageBeforeChangeChooseNum: function (chooseGood, toBeCartNum) {
    var goods_spec = chooseGood.goods_spec;//商品规格数组
    var specValue = chooseGood.goods_specValue;
    var specChooseNum = 0;
    var noChooseArrIndex = -1;
    var chooseAllSpec = ""
    for (var i in goods_spec) {
      if (goods_spec[i].arrIndex == -1) {
        specChooseNum = specChooseNum + 1;
        noChooseArrIndex = i;
      } else {
        chooseAllSpec = chooseAllSpec + "," + goods_spec[i].arrIndex;
      }
    }
    var flag = false;
    if (specChooseNum == 0) {//都选了的情况,先进行设置选择的数量
      var chooseAllSpecTmp = chooseAllSpec;
      var lenCheckTmp = chooseAllSpecTmp.length;
      if (chooseAllSpecTmp.indexOf(",") > -1) {
        chooseAllSpecTmp = chooseAllSpecTmp.substring(1, lenCheckTmp);
      }
      for (var key in specValue) {//遍历所有规格,取库存
        if (this.checkIsSame(chooseAllSpecTmp, key)) {
          if (toBeCartNum > specValue[key].stock) {
            flag = true;
          }
          break;
        }
      }
    }
    return flag;
  },
  updateSpeciStateBeforeChangeChooseNum: function (chooseGood, toBeCartNum) {
    var goods_spec = chooseGood.goods_spec;//商品规格数组
    var specValue = chooseGood.goods_specValue;
    var specChooseNum = 0;
    var noChooseArrIndex = -1;
    var chooseAllSpec = ""
    for (var i in goods_spec) {
      if (goods_spec[i].arrIndex == -1) {
        specChooseNum = specChooseNum + 1;
        noChooseArrIndex = i;
      } else {
        chooseAllSpec = chooseAllSpec + "," + goods_spec[i].arrIndex;
      }
    }
    if (specChooseNum == 0) {//都选了的情况,先进行设置选择的数量
      var haveStorageNotEnught = {};
      var indexI = -1;
      var notEnughtArr = [];
      //遍历找到有库存不足的那行
      for (var i in goods_spec) {
        for (var j in goods_spec[i].vals) {
          if (goods_spec[i].vals[j].stockEnough == 0) {
            haveStorageNotEnught = goods_spec[i];
            indexI = i;
            break;
          }
        }
      }
      var chooseAllSpecTmp = chooseAllSpec;
      var lenCheckTmp = chooseAllSpecTmp.length;
      if (chooseAllSpecTmp.indexOf(",") > -1) {
        chooseAllSpecTmp = chooseAllSpecTmp.substring(1, lenCheckTmp);
      }
      //遍历找到库存不足的组合
      for (var i in haveStorageNotEnught.vals) {
        var chooseAllSpecTmp2 = chooseAllSpecTmp;
        if (haveStorageNotEnught.vals[i].stockEnough == 0) {
          var tmp = haveStorageNotEnught.vals[i].specKey;
          console.log(i + "---" + tmp);
          chooseAllSpecTmp2 = chooseAllSpecTmp2.replace("" + haveStorageNotEnught.arrIndex, "" + tmp);
          console.info("chooseAllSpecTmp2", chooseAllSpecTmp2)
          var obj = {
            chooseAllSpecTmp2: chooseAllSpecTmp2,
            key: haveStorageNotEnught.vals[i],
            indexJ: i,
          }
          notEnughtArr.push(obj);
        }
      }
      //根据最新的数量传参判断设置新的规格状态
      for (var i = 0; i < notEnughtArr.length; i++) {
        for (var key in specValue) {//遍历所有规格,取库存
          if (this.checkIsSame(notEnughtArr[i].chooseAllSpecTmp2, key)
            && specValue[key].stock >= toBeCartNum) {
            goods_spec[indexI].vals[notEnughtArr[i].indexJ].stockEnough = 1;
          }
        }
      }
      chooseGood.goods_spec = goods_spec;
      this.setData({ chooseGood: chooseGood });
    } else if (specChooseNum == 1) {//更新商品规格状态，只差最后一个规格要选的情况只差最后一个规格要选的情况
      var vals = goods_spec[noChooseArrIndex].vals;
      var chooseAllSpecTmp = chooseAllSpec;
      var lenCheckTmp = chooseAllSpecTmp.length;
      if (chooseAllSpecTmp.indexOf(",") > -1) {
        chooseAllSpecTmp = chooseAllSpecTmp.substring(1, lenCheckTmp);
      }
      console.log("已选的" + chooseAllSpecTmp);
      for (var i in vals) {
        if (vals[i].stockEnough == 0) {
          var chooseAllSpecTmp2 = chooseAllSpecTmp;
          chooseAllSpecTmp2 = chooseAllSpecTmp2 + "," + vals[i].specKey;
          for (var key in specValue) {//遍历所有规格,取库存
            if (this.checkIsSame(chooseAllSpecTmp2, key)
              && specValue[key].stock >= toBeCartNum) {
              vals[i].stockEnough = 1;
            }
          }
        }
      }
      goods_spec[noChooseArrIndex].vals = vals;
      chooseGood.goods_spec = goods_spec;
      this.setData({ chooseGood: chooseGood });
    }
  },
  changeChooseNum: function (e) {
    var flag = e.currentTarget.dataset.flag;
    var chooseGood = this.data.chooseGood;
    if (flag == "add") {
      if (this.checkGoodStorageBeforeChangeChooseNum(chooseGood, chooseGood.cartNum + 1)) {
        wx.showToast({
          title: '库存不足',
          icon: "loading",
          duration: 800,
        })
        return;
      }
      var cartNum = parseInt(chooseGood.cartNum);
      chooseGood.cartNum = cartNum + 1;
      wx.setStorageSync("chooseGoodNum", chooseGood.cartNum);
    } else {
      var cartNum = chooseGood.cartNum;
      if (cartNum != 1 && cartNum != 0) {
        chooseGood.cartNum = cartNum - 1;
        this.updateSpeciStateBeforeChangeChooseNum(chooseGood, chooseGood.cartNum);
        wx.setStorageSync("chooseGoodNum", chooseGood.cartNum);
      }
    }
    this.setData({ chooseGood: chooseGood });
  },

  checkChooseAllSpecIsNotLastSameWhithKey: function (chooseAllSpec, key) {
    //判断chooseAllSpec中是否只差最后一个就等于key
    var flag = false;
    var noChooseKey = "";
    if (key.indexOf(",") > -1) {
      var keyArr = key.split(",");
      var haveNum = 0;
      for (var i = 0; i < keyArr.length; i++) {
        if (chooseAllSpec.indexOf(keyArr[i]) > -1) {
          haveNum = haveNum + 1;
        } else {
          noChooseKey = keyArr[i];
        }
      }
      if (haveNum == keyArr.length - 1) {
        flag = true;
      } else {
        flag = false;
      }
    }
    return {
      flag: flag,
      noChooseKey: noChooseKey
    };
  },
  setHaveChooseSpecState: function (state, key, chooseGood) {
    var goods_spec = chooseGood.goods_spec;
    for (var i = 0; i < goods_spec.length; i++) {
      for (var j = 0; j < goods_spec[i].vals.length; j++) {
        if (goods_spec[i].vals[j].specKey == key) {
          goods_spec[i].vals[j].stockEnough = state;
        }
      }
    }
    chooseGood.goods_spec = goods_spec;
    this.setData({ chooseGood: chooseGood });
  },
  checkIsHaveSameInArr: function (arrs, obj) {
    var flag = false;
    for (var i = 0; i < arrs.length; i++) {
      if (arrs[i] == obj) {
        flag = true;
        break;
      }
    }
    return flag;
  },
  //规格优化************************************************************************end3
  //从商品列表那里点击选规格
  chooseSpecifi: function (e) {
    console.log(e);
    wx.setStorageSync("chooseGoodNum", "");
    var good = e.currentTarget.dataset.my;
    console.info(JSON.stringify(good))
    var goods_spec = this.goodsSpec(good);
    //  console.log(goods_spec);
    good.goods_spec = goods_spec;
    good.goods_specValue = JSON.parse(good.goods_specValue);
    good.specificationIndex = -1;
    var chooseGood = {
      goods_id: good.goods_id,
      cartNum: 1,
      goods_image: good.goods_image,
      goods_name: good.goods_name,
      goods_marketprice: good.goods_marketprice,
      discountPriceStr: Number(good.discountPriceStr),
      price_discount: good.price_discount,
      packagingFee: good.packagingFee,
      goods_spec: good.goods_spec,
      goods_specValue: good.goods_specValue,
      goods_specOld: good.goods_specOld,
      goods_specValueOld: good.goods_specValueOld,
    };
    if (good.goods_specValue == "" || good.goods_specValue == undefined || good.goods_specValue == null) {
      //如果商品没有规格时候，spec_key默认为''
      chooseGood.spec_key = '';
    }
    this.setData({
      maskHidden: false,
      csHidden: false,
      chooseGood: chooseGood
    });
  },
  //分解规格
  goodsSpec: function (goodsdetail) {//调用德有，处理商品规格和对应的价格等
    var that = this;
    /***规格解析***/
    var specValue = JSON.parse(goodsdetail.goods_specValue);
    console.log("库存对象：", specValue);
    if (goodsdetail.goods_spec != '') {
      var goodsSpec = JSON.parse(goodsdetail.goods_spec);
      console.info("规格长度：", goodsSpec.length);
      var greantArr = [];
      goodsSpec.forEach(function (e, index, arr) {
        for (var props in e) {
          var parentObj = {}
          // console.log(e[props])
          parentObj['specName'] = props;
          parentObj['arrIndex'] = -1;
          var strArr = [];
          for (var key in e[props]) {
            // console.log(arr[props][key]);
            var stockEnough = -1;
            if (goodsSpec.length == 1) {
              for (var keyTmp in specValue) {
                if (keyTmp == key && parseInt(specValue[keyTmp].stock) == 0) {
                  stockEnough = 0;
                  break;
                }
              }
            }
            var childObj = {};
            childObj['specKey'] = key;
            childObj['value'] = e[props][key];
            if (goodsSpec.length == 1 && stockEnough == 0) {
              childObj['stockEnough'] = stockEnough;
            }
            strArr.push(JSON.stringify(childObj));//将对象转换成字符串存入数组
          }
          // console.log(strArr+"-------------------")
          var childArr = [];
          for (var i in strArr) {
            var obj = JSON.parse(strArr[i]);
            childArr.push(obj)
          }
          parentObj['vals'] = childArr;
          greantArr.push(parentObj);
        }
      })
    }
    /***规格***/

    return greantArr;
  },
  checkCartIsHaveGoodWhenAddFromGoodList: function (goods_id) {
    var carts = this.data.carts;
    var checkGood = null;
    for (var i in carts) {
      if (carts[i].goods_id == goods_id) {
        checkGood = carts[i];
        break;
      }
    }
    return checkGood;
  },
  newGoodFun: function (good) {
    if (good == null) {
      return [];
    }
    var goods = JSON.parse(JSON.stringify(good));
    return goods;
  },
  //从商品列表改变商品数量 ***()
  changeGLNum: function (e) {

    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    var goods = this.newGoodFun(this.data.goods);
    console.log(flag + "----" + id);
    var storageNoFlag = false;
    if (flag == "add") {
      wx.showLoading({
        title: '添加中',
        mask: true
      })
      for (var i = 0; i < goods.length; i++) {
        if (goods[i].goods_id == id) {
          if (goods[i].goods_storage < 1) {
            storageNoFlag = true;
            wx.showToast({
              title: '商品库存不足',
              icon: "loading",
              duration: 700,
              mask: true
            })
            break;
          }
          var num = goods[i].cartNum
          goods[i].cartNum = num + 1;
          if (storageNoFlag) {
            return;
          }
          //this.changeTotalPriceAndTotalNum(goods[i].discountPriceStr, 1, "add");
          if (num == 0) {//原来的数量
            //从商品列表插入到购物车
            this.insertShopncCartFromList(goods[i], goods);
          } else {
            //从商品列表改变购物车中的数量
            this.substractFromServerFromList(goods[i], goods, "add");
          }
          break;
        }
      }
    } else {
      wx.showLoading({
        title: '删减中',
        mask: true
      })
      for (var i = 0; i < goods.length; i++) {
        if (goods[i].goods_id == id) {
          var num = goods[i].cartNum;
          if (num != 0) {
            goods[i].cartNum = num - 1;
            // this.changeTotalPriceAndTotalNum(goods[i].discountPriceStr, 1, "substract");
            //从商品列表改变购物车中的数量
            this.substractFromServerFromList(goods[i], goods, "substract");
          }
          break;
        }
      }
    }
    if (storageNoFlag) {
      return;
    }
    // console.log("执行--------------");
    // this.setData({ goods: goods });
  },

  //公共函数，可以改变总价格和购物车中的商品数量
  changeTotalPriceAndTotalNum: function (goodPriceStr, goodChangeNum, flag, packagingFee) {//
    var goodPrice = parseFloat(goodPriceStr);
    if (flag == "add" && goodChangeNum == 1) {
      this.setData({ animationText: "+1" });
      this.inVokeAnimationData();
    } else if (flag == "substract" && goodChangeNum == 1) {
      if (this.data.cartNum != 1) {
        this.setData({ animationText: "-1" });
        this.inVokeAnimationData();
      }
    }

    var cartNum = this.data.cartNum;
    var allPackgeFeel = this.data.allPackgeFeel;
    console.log(goodPrice + "---" + goodChangeNum + "---" + flag + "---" + cartNum);
    var cartTotalPrice = parseFloat(this.data.cartTotalPrice);
    if (flag == "add") {
      var tmp = parseFloat(goodPrice * goodChangeNum).toFixed(2);
      var packagingFeeTmp = parseFloat(packagingFee * goodChangeNum).toFixed(2);
      cartTotalPrice = cartTotalPrice + parseFloat(tmp) + parseFloat(packagingFeeTmp);
      cartNum = cartNum + goodChangeNum;
      allPackgeFeel = allPackgeFeel + parseFloat(packagingFeeTmp);
    } else {
      var tmp = parseFloat(goodPrice * goodChangeNum).toFixed(2);
      var packagingFeeTmp = parseFloat(packagingFee * goodChangeNum).toFixed(2);
      cartTotalPrice = cartTotalPrice - parseFloat(tmp) - parseFloat(packagingFeeTmp);
      cartNum = cartNum - goodChangeNum;
      allPackgeFeel = allPackgeFeel - parseFloat(packagingFeeTmp);
    }
    this.setData({ cartTotalPrice: cartTotalPrice.toFixed(2), cartNum: cartNum, allPackgeFeel: allPackgeFeel });
    this.getDiscount();
  },
  //从按确定选择规则商品，改变商品数量  ***
  addCartLRH: function (e) {
    var that = this;
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var carts = this.data.carts;
    var chooseGood = this.data.chooseGood;
    if (chooseGood.spec_key == undefined) {
      wx.showToast({
        title: '规格未选全',
        duration: 1000,
        icon: 'loading'
      })
      return;
    }
    if (chooseGood.cartNum == 0) {
      wx.showToast({
        title: '数量不能为0',
        duration: 1000,
        icon: 'loading'
      })
      return;
    }
    wx.showLoading({
      title: '添加中',
      mask: true
    })
    this.setData({ maskHidden: true, cartHidden: true, csHidden: true });
    var num = this.data.chooseGood.goods_num;
    var goods_spec3 = this.data.goods_spec3;
    this.setData({ gotoBuy: false, goods_spec: goods_spec3 });

    var chooseGood = this.data.chooseGood;
    var carts = this.data.carts;
    var flag = false;
    var changeNum = 0;
    for (var i in carts) {
      if (carts[i].goods_id == chooseGood.goods_id && carts[i].spec_key == chooseGood.spec_key) {
        console.log("原来的购物车有现在的商品了");
        changeNum = chooseGood.cartNum;
        chooseGood.cartNum = carts[i].goods_num + chooseGood.cartNum;
        console.log(changeNum + "增加的数量");
        flag = true;
        break;
      }
    }
    if (flag) {
      console.log(chooseGood.cartNum + "最后购物车商品数量");
      // this.changeTotalPriceAndTotalNum(chooseGood.discountPriceStr, changeNum, "add");
      this.substractFromConfirmNum(chooseGood, changeNum, "add");//购物车原来已经有了，继续添加数量
    } else {
      // this.changeTotalPriceAndTotalNum(chooseGood.discountPriceStr, chooseGood.cartNum, "add");
      this.insertShopncCart();//添加商品到购物车，从无到有
    }
  },

  //添加商品到购物车，从无到有(向服务器发送请求)
  insertShopncCart: function () {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var good = this.data.chooseGood;
    var that = this;
    // var goods_spec = "";
    // if (good.goods_specOld != null && good.goods_specOld != "") {
    //   var goods_specTmp = good.goods_specOld;
    //   var len = goods_specTmp.length;
    //   goods_spec = goods_specTmp.substring(1, len - 1);
    // }
    var goods_spec = good.goods_specOld;
    if (good.spec_key == null) {
      good.spec_key = "";
    }
    var store = this.data.store;
    wx.request({
      url: appUtil.ajaxUrls().addCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": that.data.storeId,
        "goods_id": good.goods_id,
        "goods_price": good.discountPriceStr,
        "goods_num": parseInt(good.cartNum),
        "goods_spec": goods_spec,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        "spec_value": good.goods_specValueOld,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": good.spec_key,
        "store_name": store.store_name,
        "goods_image": good.goods_image,
        "goods_name": good.goods_name,
        "bl_id": 0,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenDataUser(),
      },
      success: function (res) {
        console.log("增加返回");
        console.log(res);
        console.log(good.goods_id + "---" + good.discountPriceStr + "---" + parseInt(good.cartNum) + "---" + good.goods_specValueOld +
          "---" + store.store_name + "---" + good.goods_image + "---" + good.goods_name);
        wx.hideLoading();
        if (res.data.message.type == "success") {
          that.changeTotalPriceAndTotalNum(good.discountPriceStr, good.cartNum, "add", good.packagingFee);
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        } else {
          wx.showToast({
            title: res.data.message.descript,
            icon: "loading",
            duration: 1000,
          })
        }

      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  changeGoodsListCartNumWhenManageCart: function (cart, flag) {
    if (cart.spec_key != "") {
      return;
    }
    var goods = this.data.goods;
    if (flag == "add") {
      var goods_id = cart.goods_id;
      for (var i in goods) {
        if (goods[i].goods_id == goods_id) {
          goods[i].cartNum = goods[i].cartNum + 1;
          break;
        }
      }
    } else {
      var goods_id = cart.goods_id;
      for (var i in goods) {
        if (goods[i].goods_id == goods_id) {
          goods[i].cartNum = goods[i].cartNum - 1;
          break;
        }
      }
    }
    this.setData({ goods: goods });
  },
  //从购物车改变商品数量    ***
  changeNum: function (e) {
    var id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    var carts = this.data.carts;

    if (flag == "add") {
      wx.showLoading({
        title: '添加中',
        mask: true
      })
      for (var i = 0; i < carts.length; i++) {
        if (carts[i].cart_id == id) {
          var num = carts[i].goods_num;
          carts[i].goods_num = num + 1;
          carts[i].itemPrice = parseFloat(carts[i].goods_num * carts[i].discountPriceStr).toFixed(2);

          // this.goodListNumChange(id, carts[i].goods_num);
          // this.changeTotalPriceAndTotalNum(carts[i].discountPriceStr, 1, "add");
          // this.changeGoodsListCartNumWhenManageCart(carts[i], "add");

          this.substractFromServer(id, carts[i], "add", carts);
          break;
        }
      }
    } else {
      wx.showLoading({
        title: '删减中',
        mask: true
      })
      for (var i = 0; i < carts.length; i++) {
        if (carts[i].cart_id == id) {
          var num = carts[i].goods_num;
          if (num == 0) {
            return;
          }
          carts[i].goods_num = num - 1;
          carts[i].itemPrice = parseFloat(carts[i].goods_num * carts[i].discountPriceStr).toFixed(2);

          // this.goodListNumChange(id, carts[i].goods_num);
          // this.changeTotalPriceAndTotalNum(carts[i].discountPriceStr, 1, "substract");
          // this.changeGoodsListCartNumWhenManageCart(carts[i], "substract");

          this.substractFromServer(id, carts[i], "substract", carts);
          break;
        }
      }
    }
    //this.setData({ carts: carts });
  },
  //购物车商品数量变化（从购物车）
  substractFromServer: function (id, good, flag, carts) {
    if (appUtil.appUtils.getTokenDataUser() == null) {
      return;
    }
    var that = this;
    console.info("购物车中变化的商品", good);
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
      url: appUtil.ajaxUrls().substractCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": that.data.storeId,
        "goods_id": good.goods_id,
        "goods_price": good.discountPriceStr,
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
        console.log("减少返回" + parseInt(good.goods_num) + "---" + goods_spec);
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          that.goodListNumChange(id, good.goods_num);
          that.changeTotalPriceAndTotalNum(good.discountPriceStr, 1, flag, good.packagingFee);
          that.changeGoodsListCartNumWhenManageCart(good, flag);
          that.setData({ carts: carts });
          that.changeLocalStorageGoods(good.goods_id, good.goods_stcids, good.goods_num);
        } else if (res.data.error.code == "401") {
          appUtil.appUtils.setShowMessage();
        } else {
          wx.showToast({
            title: res.data.message.descript,
            icon: "loading",
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  changeLocalStorageGoods: function (goods_id, gc_id, cartNum) {
    console.log(goods_id + "*****" + gc_id + "*******" + cartNum);
    var storageGoods = wx.getStorageSync("storageGoods");
    for (var i in storageGoods) {
      console.log(storageGoods[i].key);
      if (gc_id == storageGoods[i].key) {
        for (var j in storageGoods[i].goods) {
          if (storageGoods[i].goods[j].goods_id == goods_id) {
            storageGoods[i].goods[j].cartNum = cartNum;
            console.log("改变后的商品数量：" + cartNum);
            break;
          }
        }
      }
    }
    wx.setStorageSync("storageGoods", storageGoods);
  },
  clearLocalStorageGoodList: function (cartsTmp) {
    var storageGoods = wx.getStorageSync("storageGoods");
    for (var n in cartsTmp) {
      for (var i in storageGoods) {
        if (cartsTmp[n].goods_stcids == storageGoods[i].key) {
          for (var j in storageGoods[i].goods) {
            if (storageGoods[i].goods[j].cartNum != 0) {
              storageGoods[i].goods[j].cartNum = 0;
            }
          }
        }
      }
    }
    wx.setStorageSync("storageGoods", storageGoods);
  },
  //在页面 初始化时候处理两位浮点数,总价格和购物车商品数量
  initCartsData: function (carts, cartTotalPrice, allCartNum, allPackgeFeel) {
    for (var i in carts) {
      var item = carts[i];
      carts[i].itemPrice = parseFloat(item.discountPriceStr * item.goods_num).toFixed(2);
    }
    this.setData({
      carts: carts,
      cartTotalPrice: parseFloat(cartTotalPrice + allPackgeFeel).toFixed(2),
      cartNum: allCartNum,
      allPackgeFeel: allPackgeFeel
    });
    this.getDiscount();
  },
  //获取购物车 
  getCartData: function () {
    var that = this;
    wx.request({
      //url: appUtil.ajaxUrls().getStoreCartData, //
      url: appUtil.ajaxUrls().getStoreCartData + "/" + that.data.memberId + "/" + that.data.storeId,
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        //'androidApi': '3.3.8'
        'api': 'web',
      },
      success: function (res) {
        console.log("得到店铺购物车返回");
        console.log(res)
        if (res.data.message.type == "success") {
          var carts = res.data.data.cartList;

          that.initCartsData(carts, res.data.data.cartTotalPrice, res.data.data.allCartNum, res.data.data.allPackgeFeel);
        }
        // wx.hideLoading();
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },








  tapMask: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        maskHidden: true,
        cartHidden: true,
        csHidden: true,
      });
    }, 250);

    this.setAnimation2();
  },
  animationStart: function () {
    var that = this;
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    animation1.translateY(-26).step();
    that.setData({
      animationData1: animation1.export(),
    })
    setTimeout(function () {
      animation1.opacity(1).step();
      that.setData({
        animationData1: animation1.export(),
      })
    }, 2000)
    setTimeout(function () {
      animation1.translateY(26).step();
      that.setData({
        animationData1: animation1.export(),
      })
    }, 4000)
  },
  setInternalActivity: function () {
    var arrs = this.data.arrs;
    var that = this;
    this.animationStart();
    setInterval(function () {
      var arr = arrs[0]
      for (var i = 0; i < arrs.length; i++) {

        if (i == arrs.length - 1) {
          arrs[i] = arr;
        } else {
          arrs[i] = arrs[i + 1];
        }
        that.setData({ arrs: arrs });
      }
      var animation1 = wx.createAnimation({
        duration: 1000,
        timingFunction: 'linear',
      })
      animation1.translateY(-26).step();
      that.setData({
        animationData1: animation1.export(),
      })
      setTimeout(function () {
        animation1.opacity(1).step();
        that.setData({
          animationData1: animation1.export(),
        })
      }, 1000)
      setTimeout(function () {
        animation1.translateY(26).step();
        that.setData({
          animationData1: animation1.export(),
        })
      }, 4000)
    }, 4500);
  },
  //转换店铺头部信息和中部商品信息
  transFromServer: function (data) {
    console.log(data);
    var goodsMap = data.goodsMap;
    var goods = [];
    for (var key in goodsMap) {
      var goodArr = goodsMap[key];
      for (var i in goodArr) {
        goodArr[i].stc_id = key;
        goodArr[i].goods_specOld = goodArr[i].goods_spec;
        goodArr[i].goods_specValueOld = goodArr[i].goods_specValue;
        goods.push(goodArr[i]);
      }
    }
    // for (var i = 0; i < data.goodsList.length; i++) {
    //   var good = data.goodsList[i];
    //   good.goods_specOld = good.goods_spec;
    //   good.goods_specValueOld = good.goods_specValue;
    // }
    for (var i = 0; i < data.storeGoodsClassList.length; i++) {
      var cat = data.storeGoodsClassList[i];
      if (cat.stc_id == -1) {
        data.storeGoodsClassList[i].stc_id = 0;
        break;
      }
    }
    var arrs = [];
    if (data.shopncStore.packageMallStr != null && data.shopncStore.packageMallStr != '' && data.shopncStore.packageMallStr != '0') {
      arrs.push(data.shopncStore.packageMallStr);
    }
    if (data.shopncStore.firstOrderYouhui != null && data.shopncStore.firstOrderYouhui != '' && data.shopncStore.firstOrderYouhui != '0') {
      arrs.push(data.shopncStore.firstOrderYouhui);
    }
    if (data.shopncStore.mansongStr != null && data.shopncStore.mansongStr != '' && data.shopncStore.mansongStr != '0') {
      arrs.push(data.shopncStore.mansongStr);
    }
    this.setData({
      goods: goods,
      categories: data.storeGoodsClassList,
      catIndex: data.storeGoodsClassList[0].stc_id,
      store: data.shopncStore,
      catname: data.storeGoodsClassList[0].stc_name,
      arrs: arrs
      // arrs: ["全场七折优惠，先到先得，机会不等人", "购满500元包1.00公里配送费", "凭优惠券，得大优惠，庆祝成立10周年"]
    });
    this.setInternalActivity();
    wx.hideLoading();
  },
  //获取店铺信息
  getStoreData: function () {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSpecialStore, //
      data: {
        // latitude: "23.38814832899305",
        // longitude: "113.264468",
        // memberId: 2,
        // storeId: 558
        latitude: "23.38814832899305",
        longitude: "113.264468",
        memberId: that.data.memberId,
        storeId: that.data.storeId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到特殊分类内容返回");
        console.log(res)
        if (res.data.message.type == "success") {
          that.transFromServer(res.data.data);
          that.getCartData();
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      },
      complete: function (res) {
        console.log("请求结束返回");
        console.log(res);
      }
    })
  },






















  inVokeAnimationData: function () {
    var animation = wx.createAnimation({
      duration: 700,
      timingFunction: 'linear',
    })
    //animation.translate(0, -35).scale(2.5, 2.5).opacity(0).scale(2.5, 2.5).step();
    animation.translate(0, -35).scale(2.5, 2.5).step();
    this.setData({
      animationData: animation.export()
    })
    var that = this;
    setTimeout(function () {
      var animation = wx.createAnimation({
        duration: 10,
        timingFunction: 'linear',
      })
      animation.translate(0, 15).step();
      that.setData({
        animationData: animation.export()
      })
    }, 700);
  },
  toDeYou: function (num) {
    var storeId = this.data.storeId;
    //var storeId = 4887; 
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getSpecByTXM,
      data: {
        "store_id": storeId,
        "barcode": num
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("根据条形码获取商品key返回");
        console.log(res);
        if (res.data.message.type == "success" && res.data.data != null) {
          var goodsId = res.data.data.goods_id;
          // var barcodeKey = res.data.data.goods_barcode;
          var barcodeKey = "";
          if (res.data.data.goods_specValue != null && res.data.data.goods_specValue != "") {
            var goodSpecObj = JSON.parse(res.data.data.goods_specValue);
            for (var key in goodSpecObj) {
              if ("" + num == "" + goodSpecObj[key].barcode) {
                barcodeKey = key;
                break;
              }
            }
          }
          wx.redirectTo({
            url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + goodsId + '&barcodeKey=' + barcodeKey,
          })
        } else if (res.data.message.type == "error") {
          that.setData({ isPrompt: !that.data.isPrompt, promptTit: '无该商品信息' })
          setTimeout(function () {
            that.setData({ isPrompt: !that.data.isPrompt })
          }, 2000)
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.stopPullDownRefresh();
      }
    })
  },
  //点击扫码购物
  scan: function () {
    if (this.data.store.speediness == 0) {
      var that = this;
      this.setData({ isPrompt: !that.data.isPrompt, promptTit: '该店暂不支持扫码购物' })
      setTimeout(function () {
        that.setData({ isPrompt: !that.data.isPrompt })
      }, 2000)
      return;
    }
    var that = this;
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        // console.log("扫码链接" + res.result)
        // console.log("截取链接" + res.result.substring(8, 30))
        var result = res.result;
        if (result.indexOf("/") == -1) {
          console.log("条形码");
          var num = res.result;
          that.toDeYou(num);
        } else {
          var resUrl = res.result.substring(8, 30);//截取相关url关键字段
          var urls = res.result;
          if (resUrl == that.data.defaultUrl) {
            //是正确的商品码
            if (urls != undefined) {
              urls = decodeURIComponent(urls);//对二维码进来的链接进行转码
              var strIndex = urls.lastIndexOf("/");//获取转码之后的goodsid
              var value = urls.substring(strIndex + 1, urls.length);
              console.log("数值：" + value);
              wx.showLoading({
                title: '加载中',
                mask: true,
                success: function () {
                  wx.redirectTo({//关闭当前页面，跳转到应用内的某个页面
                    url: '/pages/detail/goodsdetail?q=' + 'https://dev-api.xiaoguikuaipao.com/goods/' + value,
                  })
                }
              })
            }
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
          } else {
            that.setData({ isPrompt: !that.data.isPrompt, promptTit: '无该商品信息' })
            setTimeout(function () {
              that.setData({ isPrompt: !that.data.isPrompt })
            }, 2000)
          }
        }
      }
    })
  },
  onLoad: function (options) {
    wx.removeStorageSync("storageGoods");
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    if (options.q != undefined) {
      var memberId = appUtil.lrhMethods.getMemberId();
      console.log("memberId:" + memberId);
      if (memberId == null) {
        memberId = 0;
      }
      var q = decodeURIComponent(options.q);//对二维码进来的链接进行转码
      var strIndex = q.lastIndexOf("/");//获取转码之后的goodsid
      var storeId = q.substring(strIndex + 1, q.length);
      this.setData({ storeId: storeId, memberId: memberId });
    } else {
      var storeId = options.storeId;
      // var memberId = 6;
      //var storeId = 4895;
      // var storeId = 5623;//金
      //var storeId = 5031;//私人
      //var storeId = 5969;//199
      //var storeId = 5828;//烤鸭
      //1246
      var memberId = appUtil.lrhMethods.getMemberId();
      if (memberId == null) {
        memberId = 0;
      }
      this.setData({ storeId: storeId, memberId: memberId });
    }
  },
  compare: function (property) {
    console.log(property);
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  /****优惠信息----满减优惠****/
  getFullReduction: function () {
    var that = this;
    var Pricerulpric = parseFloat(this.data.cartTotalPrice);
    var greater_rulpric = 0, greater_package = 0;
    var less_rulpric = 0, less_package = 0;
    var last_rulpric = 0, last_package = 0;//最大优惠值
    var ruleList = this.data.ruleList;//满减优惠
    var packageMallList = this.data.packageMallList;//满减减邮
    /***********************满减优惠***************************/
    for (var rl = 0; rl < ruleList.length; rl++) {
      if (Pricerulpric < ruleList[rl].price) {//总价格的最大值
        greater_rulpric = ruleList[rl].price;//价格小于该优惠价，则最大值就是该值
        if (rl > 0) {//如果有上一条数据
          less_rulpric = ruleList[rl - 1].price;
          var rulpric_discount = ruleList[rl].discount;
          var already_discount = ruleList[rl - 1].discount;
          break;
        } else {//如果没有上一条数据，即为第一条数据
          less_rulpric = 0;
          var rulpric_discount = ruleList[rl].discount;
          var already_discount = 0;
          break;
        }
      } else {
        //总价格的最小值
        less_rulpric = ruleList[rl].price;//暂时先赋值最小值
        if (rl < (ruleList.length - 1)) {
          greater_rulpric = ruleList[rl + 1].price;
          var rulpric_discount = ruleList[rl + 1].discount;
          var already_discount = ruleList[rl].discount;
        } else {
          //最大优惠值
          greater_rulpric = ruleList[rl].price;
          last_rulpric = ruleList[rl].price;
          var rulpric_discount = ruleList[rl].discount;
          var already_discount = ruleList[rl].discount;
          break;
        }
      }
    }
    that.setData({
      less_rulpric: less_rulpric,//满减最小值
      greater_rulpric: greater_rulpric,//满减最大值
      last_rulpric: last_rulpric,//满减最大优惠值
      priceDifference: parseFloat(greater_rulpric - this.data.cartTotalPrice).toFixed(2),
      rulpric_discount: rulpric_discount,//再买可优惠的金额
      already_discount: already_discount,//已经满足了的优惠金额
    })
    // console.log("最小值：" + less_rulpric + ' 最大值：' + greater_rulpric + " last_rulpric:" + last_rulpric + " rulpric_discount:" + rulpric_discount)
  },
  /****优惠信息----买满包邮费****/
  getBuyAFullPackage: function () {
    var that = this;
    var Pricerulpric = parseFloat(this.data.cartTotalPrice);
    var greater_rulpric = 0, greater_package = 0;
    var less_rulpric = 0, less_package = 0;
    var last_rulpric = 0, last_package = 0;//最大优惠值
    var ruleList = this.data.ruleList;//满减优惠
    var packageMallList = this.data.packageMallList;//满减减邮
    //***************************买满减邮****************************
    for (var pa = 0; pa < packageMallList.length; pa++) {
      if (Pricerulpric < packageMallList[pa].packageMallPrice) {//总价格的最大值
        greater_package = packageMallList[pa].packageMallPrice;
        if (pa > 0) {//如果有上一条数据
          less_package = packageMallList[pa - 1].packageMallPrice;
          var rulpric_discount_package = packageMallList[pa].packageMallDis;
          var already_discount_package = packageMallList[pa - 1].packageMallDis;
          var carriageFee = packageMallList[pa].packageMallDis;//可包的邮费
          break;
        } else {//如果有上一条数据
          less_package = 0;
          var rulpric_discount_package = packageMallList[pa].packageMallDis;
          var already_discount_package = 0;
          var carriageFee = packageMallList[pa].packageMallDis;//可包的邮费
          break;
        }
      } else {
        //总价格的最小值
        less_package = packageMallList[pa].packageMallPrice;
        if (pa < (packageMallList.length - 1)) {
          greater_package = packageMallList[pa + 1].packageMallPrice;
          var rulpric_discount_package = packageMallList[pa + 1].packageMallDis;
          var already_discount_package = packageMallList[pa].packageMallDis;
          var carriageFee = packageMallList[pa].packageMallDis;//可包的邮费
        } else {
          greater_package = packageMallList[pa].packageMallPrice;
          last_package = packageMallList[pa].packageMallPrice;
          var rulpric_discount_package = packageMallList[pa].packageMallDis;
          var already_discount_package = packageMallList[pa].packageMallDis;
          var carriageFee = packageMallList[pa].packageMallDis;//可包的邮费
          break;
        }
      }
    }
    // 优惠的邮费计算
    // var freight = 3.8;//配送默认价格
    // var freightDefault = parseFloat(rulpric_discount_package * 1000);
    // if (freightDefault <= 1000) {
    //   //配送费小于1公里
    //   var carriageFee = freight;
    // } else if (freightDefault <= 5000) {
    //   //配送费大于1小于5公里
    //   var carriageFee = freight + ((freightDefault - 1000) / 1000) * 2;
    // } else if (freightDefault > 5000) {
    //   //配送费大于5公里
    //   var carriageFee = freight + (4 * 2) + ((freightDefault - 5000) / 1000) * 2.5;
    // }
    // console.log("包邮-- 最小值:" + less_rulpric + ",最大值" + greater_package + " last_package" + last_package);
    this.setData({
      less_package: less_package,//包送最小值
      greater_package: greater_package,//包送最大值
      last_package: last_package,//包送最大里程数
      packageDifference: parseFloat(greater_package - this.data.cartTotalPrice).toFixed(2),//还差多少
      rulpric_discount_package: rulpric_discount_package,//再买可包送的里程
      already_discount_package: already_discount_package,//已经满足了的包送里程
      carriageFee: carriageFee,//配送费
    })
  },
  /****优惠信息****/
  getDiscount: function () {
    var that = this;
    that.getFullReduction();
    that.getBuyAFullPackage();
  },
  //首次进来页面，初始化数据
  transFromServer2: function (data) {
    console.log(data);
    wx.setNavigationBarTitle({
      title: data.shopncStoreInfo.store_name,
    })
    this.setData({
      packageMallList: data.packageMallList,
      ruleList: data.ruleList
    });
    var goodsMap = data.goodsMinMap;
    var storageGoods = wx.getStorageSync("storageGoods");
    if (storageGoods == "") {
      storageGoods = [];
    }
    var goods = [];
    var that = this;
    var flag = 0;
    var catIndex = -100;
    for (var key in goodsMap) {
      flag = flag + 1;
      catIndex = key;
      var goodArr = goodsMap[key];
      for (var i in goodArr) {
        goodArr[i].goods_stcids = key;
        goodArr[i].goods_specOld = goodArr[i].goods_spec;
        goodArr[i].goods_specValueOld = goodArr[i].goods_specValue;
        goods.push(goodArr[i]);
      }
    }
    if (flag == 1) {//为1代表是数量过100的店铺
      this.setData({ getByStyle2: true });
      var catGood = {
        key: catIndex,
        goods: goods,
        currentPage: 1,
      }
      storageGoods.push(catGood);
    }
    for (var i = 0; i < data.storeGoodsClassList.length; i++) {
      var cat = data.storeGoodsClassList[i];
      // if (cat.stc_id == -1) {
      //   data.storeGoodsClassList[i].stc_id = 0;
      //   break;
      // }
    }

    var categories = data.storeGoodsClassList;
    var goodsTmp = goods;
    var goodsTmp2 = [];
    if (flag == 1) {
      if (goodsTmp.length > 10) {
        goodsTmp2 = goodsTmp.slice(0, 10);
      } else {
        goodsTmp2 = goodsTmp;
      }
    } else {
      goodsTmp2 = goodsTmp;
    }
    this.setData({
      goods: goodsTmp2,
      categories: categories,
      catIndex: categories[0].stc_id,
      store: data.shopncStoreInfo,
      business: data.shopncStoreInfo.business,
      catname: categories[0].stc_name,
      arrs: data.youhui,
      haveCheckCatId: [categories[0].stc_id]
    });
    wx.setStorageSync("storageGoods", storageGoods);

    this.setInternalActivity();
    setTimeout(function () {
      wx.hideLoading();
    }, 800);

  },
  //从缓存拿到更多商品放到data
  getCatogoriesGoodsFromStorage: function () {
    var storageGoods = wx.getStorageSync("storageGoods");
    var catIndex = this.data.catIndex;
    console.info("滑动取数据：" + catIndex);
    for (var i in storageGoods) {
      if (storageGoods[i].key == catIndex) {
        var goodsTmp = storageGoods[i].goods;
        var currentPage = storageGoods[i].currentPage + 1;
        storageGoods[i].currentPage = currentPage;
        var goodsTmp2 = [];
        if (goodsTmp.length > 10 * currentPage) {
          goodsTmp2 = goodsTmp.slice(0, 10 * currentPage);
        } else {
          goodsTmp2 = goodsTmp;
        }
        this.setData({ goods: goodsTmp2 });
        wx.setStorageSync("storageGoods", storageGoods);
        break;
      }
    }
  },
  //得到店铺的头部和商品信息
  getStoreData2: function () {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getStoreData2, //
      data: {
        latitude: wx.getStorageSync("latitude"),
        longitude: wx.getStorageSync("longitude"),
        memberId: that.data.memberId,
        storeId: that.data.storeId,
        //pageSize: 12,
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到店铺内容2方式返回");
        console.log(res)
        if (res.data.message.type == "success") {
          that.transFromServer2(res.data.data);

          if (that.data.memberId != 0) {
            that.getCartData();
          }
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      },
      complete: function (res) {
        console.log("请求结束返回");
        console.log(res);
        // wx.hideLoading();
      }
    })
  },
  //对点击单个分类返回的商品数据做处理（设置到data里面和加入到缓存里面）
  transCatGoodDataFromServer: function (newGoods, stcids) {
    var goods = [];

    for (var i in newGoods) {
      newGoods[i].goods_stcids = stcids;
      goods.push(newGoods[i]);
    }
    var goodsTmp = goods;
    var goodsTmp2 = [];
    if (goodsTmp.length > 10) {
      goodsTmp2 = goodsTmp.slice(0, 10);
    } else {
      goodsTmp2 = goodsTmp;
    }

    this.setData({ goods: goodsTmp2 });
    wx.hideLoading();
    var storageGoods = wx.getStorageSync("storageGoods");
    var catGood = {
      key: stcids,
      goods: goods,
      currentPage: 1,
    }
    storageGoods.push(catGood);
    wx.setStorageSync("storageGoods", storageGoods);
  },
  //点击分类名字，请求服务器得到对应的商品返回
  getGoodsByCat: function (stcids) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: appUtil.ajaxUrls().getGoodsByCat, //
      data: {
        storeId: that.data.storeId,
        stcids: stcids,
        memberId: that.data.memberId,
        isWxa: false
        // pageSize:0,
        // condition:0,
        // currPage:0,
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到一个分类里面的东西返回" + stcids);
        console.log(res)
        if (res.data.message.type == "success") {
          that.transCatGoodDataFromServer(res.data.data, stcids);
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      },
      complete: function (res) {
        console.log("请求结束返回");
        console.log(res);
      }
    })
  },
  //查看是否已经加载过
  checkIsHaveCatId: function (id) {//检查看的分类里面是否已经加载，如果加载返回true,不再请求服务器该分类里面商品数据
    var haveCheckCatId = this.data.haveCheckCatId;
    var flag = false;
    for (var i in haveCheckCatId) {
      if (haveCheckCatId[i] == id) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      haveCheckCatId.push(id);
      this.setData({ haveCheckCatId: haveCheckCatId });
    }
    return flag;
  },
  //点击分类，查看分类内容的商品
  checkCat: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    var catname = e.target.dataset.catname;
    this.setData({ catIndex: id, catname: catname });
    if (this.data.getByStyle2) {//如果是超过100个的才执行，不然goods是全部的商品了
      if (!this.checkIsHaveCatId(id)) {//缓存里面没有该分类的商品，就要请求服务器
        this.getGoodsByCat(id);
      } else {//否则直接从缓存里面拿商品数据
        var storageGoods = wx.getStorageSync("storageGoods");
        storageGoods.currentPage = 1;
        wx.setStorageSync("storageGoods", storageGoods);
        for (var i in storageGoods) {
          if (storageGoods[i].key == id) {
            var goodsTmp = storageGoods[i].goods
            var goodsTmp2 = [];
            if (goodsTmp.length > 10) {
              goodsTmp2 = goodsTmp.slice(0, 10);
            } else {
              goodsTmp2 = goodsTmp;
            }
            this.setData({ goods: goodsTmp2 });
            break;
          }
        }
      }
    }
  },


















  onShareAppMessage: function () {
    var store_name = this.data.store.store_name;
    var storeId = this.data.storeId;
    return {
      title: '' + store_name,
      path: '/pages/store/glspecial/glspecial?storeId=' + storeId
    }
  },
  onReady: function () {

  },
  onShow: function () {
    var memberId = appUtil.lrhMethods.getMemberId();
    if (memberId == null) {
      memberId = 0;
    }
    this.setData({ memberId: memberId, haveCheckProduct: false });
    wx.removeStorageSync("storageGoods");
    this.getStoreData2();
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})