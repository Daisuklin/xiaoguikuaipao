// pages/detail/goodsdetail.js
var app = getApp();

var amapFile = require('../../utils/amap-wx.js');
var appUtil = require("../../utils/appUtil.js");
Page({
  data: {
    defaultUrl: 'api.xiaoguikuaipao.com',//关键url字段
    cartNum: 1,
    avatarUrl: null,
    isPrompt: false,
    promptTitle: '无该商品信息',
    collectionPark: false,
    toView: 'hash1',
    goods_specKey: {},
    //banner 参数
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 500,
    icon: {//本地图片
      collection: "../../image/detail/sc_01.png",
      collectionSelect: "../../image/detail/sc_02.png",
      collectionbg: "../../image/detail/sc_03.png",
      customer: "../../image/detail/icon_01.png",
      cart: "../../image/detail/cartb@2x.png",
      store: "../../image/detail/dianpu@2x.png",
      scancode: "../../image/detail/saoyisao4@2x.png",
      productImg: "../../image/detail/icon_pro@2x.png",
      empty: "../../image/detail/empty2.png",
      dissatisfied: "../../image/detail/dissatisfied.png",
      satisfied: "../../image/detail/satisfied.png",
      order_top: '../../image/detail/order_bot@2x.png',
      order_bot: '../../image/detail/order_top@2x.png',
      detail_start: '../../image/detail/start.png',
      geval_member: "../../image/detail/geval_member.png",
      emptyCart: "../../image/detail/emptyCart.png",
      login: "../../image/detail/login.png",
      storetop: '../../image/detail/store.png',
      share: '../../image/detail/share.png'
    },
    allCartNum: 0,
    allPrice: 0,
    isHide: false,
    isfoots: false,
    isClickBind: false,//是否已经点击了按钮
    previewNum: 0,
    isgetShow: -1,
    animationData: {}
  },
  onShareAppMessage: function () {
    // 测试
    var that = this;
    var goodsdata = this.data.goodsdetail;
    return {
      title: '小龟快跑',
      // desc: '最具人气的小龟开发联盟!',
      path: '/pages/detail/goodsdetail?goodId=' + goodsdata.goods_id,
      success: function () {
        // 分享成功
        console.info("分享成功", goodsdata.goods_id)

      },
      fail: function () {
        // 分享失败
        console.info("分享失败")

      }
    }
  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  // 获取详情内容和评论的scrollTop位置
  getGoodsDetailAndEvaluate: function () {
    var that = this;
    // 第一阶段内容
    setTimeout(function () {
      wx.createSelectorQuery().select('#content1').fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (res) {
        console.info("res-----", res.height)
        that.setData({
          contentHeight1: res.height
        })
      }).exec()
    }, 0);
    // 第二阶段内容
    setTimeout(function () {
      wx.createSelectorQuery().select('#content2').fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (res) {
        console.info("res-----", res.height)
        that.setData({
          contentHeight2: res.height
        })
      }).exec()
    }, 100)
  },
  //滑动导航显示隐藏
  bindscrollTop: function (event) {
    var that = this;
    var scrolltopNum = event.detail.scrollTop;
    var defaults = 250;//滚动的距离
    var opacitysty = (scrolltopNum / (defaults / 100)) / 100;//得到opacity的值
    var opacityParent = parseFloat(opacitysty).toFixed(2);//数据处理/第二导航的透明度
    if (scrolltopNum < defaults) {
      if (scrolltopNum < 10) {
        that.setData({
          isHide: true
        })
      } else {
        that.setData({
          opacityParent: opacityParent,
          isHide: false
        })
      }

    } else {
      that.setData({
        opacityParent: 1,

      })
    }
    // 顶部到详情的距离
    var contentHeight1 = that.data.contentHeight1;
    // 顶部到评论的距离
    var contentHeight2 = that.data.contentHeight1 + that.data.contentHeight2;
    // console.log("scrolltopNum:" + scrolltopNum+ " contentHeight1:" + contentHeight1 + " contentHeight2:"+contentHeight2)
    //定位图标自动跟随
    if (scrolltopNum > contentHeight1 && scrolltopNum < contentHeight2) {
      that.setData({
        navShowImg: 1
      })
    } else if (scrolltopNum > contentHeight2) {
      setTimeout(function () {
        that.setData({
          navShowImg: 2
        })
      }, 300)

    } else {
      that.setData({
        navShowImg: 0
      })
    }
    this.setData({
      ispaly: false,
      showVideo: false,
      showVideonum: 0
    })
  },
  //定位商品
  goHashGoods: function () {
    this.setData({
      toView: 'hash1',
      navShowImg: 0
    })
  },

  //定位详情
  goHashGoodsDetail: function () {
    this.setData({
      toView: 'hash2',
      navShowImg: 1
    })
  },
  //定位评价
  goHashEvaluate: function () {
    this.setData({
      toView: 'hash3',
    })
  },
  checkStore: function (e) {//去店铺
    var pages = getCurrentPages();//获取当前栈数
    var pagesNum = 5;//当前页面不超过的栈数
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(e.currentTarget.id)
    var that = this;
    if (this.data.goodsdetail.store_show_type == 2) {
      if (pages.length < pagesNum) {//当页面栈数大于4层时
        wx.navigateTo({//保留当前页
          url: '/pages/store/index?isAgin=0&storeId=' + that.data.goodsdetail.store_id,//商超类型上下
        })
      } else {
        wx.redirectTo({//不保留当前页
          url: '/pages/store/index?isAgin=0&storeId=' + that.data.goodsdetail.store_id,//商超类型上下
        })
      }
      wx.hideLoading()
    } else {
      if (pages.length < pagesNum) {//当页面栈数大于4层时
        wx.navigateTo({//保留当前页
          url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + that.data.goodsdetail.store_id,//美食等类型左右
        })
      } else {
        wx.redirectTo({//保留当前页
          url: '/pages/store/glspecial/glspecial?isAgin=0&storeId=' + that.data.goodsdetail.store_id,//美食等类型左右
        })
      }

      wx.hideLoading()
    }
  },
  // 去支付----立即购买方式
  getDirectPurchase: function (cartIdStr) {
    var that = this;
    var pages = getCurrentPages();//获取当前栈数
    var pagesNum = 6;//当前页面不超过的栈数
    var goodsid = this.data.goodsdetail.goods_id;
    if (this.data.goodsdetail.goods_spec == '' || typeof (that.data.goodsdetail.goods_spec) == 'undefined') {//直接购买无规格商品结算
      // 判断是否库存不足(无规格)
      if (that.data.buyGood.goods_num > that.data.goodsdetail.goods_storage) {
        // 库存不足
        that.getPromptPark('库存不足，无法购买');
        that.setData({ isClickBind: false });//还原点击事件
        return;
      }
      if (pages.length < pagesNum) {
        wx.navigateTo({
          url: '../my/order/order?goodId=' + goodsid + "|" + this.data.cartNum + "&spaecKey=" + '' + "&cartId=" + cartIdStr,
        })
        wx.hideLoading()
      } else {
        wx.redirectTo({//关闭当前页
          url: '../my/order/order?goodId=' + goodsid + "|" + this.data.cartNum + "&spaecKey=" + '' + "&cartId=" + cartIdStr,
        })
        wx.hideLoading()
      }
      //关闭购买弹窗
      setTimeout(function () {
        that.closebuys();
      }, 2000);
    } else {//直接购买有规格商品结算
      // 判断是否库存不足(有规格)
      if (that.data.buyGood.goods_num > that.data.buyGood.stock) {
        // 库存不足
        that.setData({ isPrompt: !that.data.isPrompt, promptTit: '库存不足，无法购买' })
        setTimeout(function () {
          that.setData({ isPrompt: !that.data.isPrompt, isClickBind: false });//还原点击事件
        }, 2000);
        return;
      }
      if (typeof (this.data.buyGood.spec_key) != 'undefined') {//获取规格key
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        console.log("直接购买" + cartIdStr)
        if (pages.length < pagesNum) {
          wx.navigateTo({
            url: '../my/order/order?goodId=' + goodsid + "|" + this.data.cartNum + "&spaecKey=" + this.data.chooseKey + "&cartId=" + cartIdStr,
          })
          wx.hideLoading()
        } else {
          wx.redirectTo({//关闭当前页
            url: '../my/order/order?goodId=' + goodsid + "|" + this.data.cartNum + "&spaecKey=" + this.data.chooseKey + "&cartId=" + cartIdStr,
          })
          wx.hideLoading()
        }
        // 关闭购买弹窗
        setTimeout(function () {
          that.closebuys();
          that.setData({
            showVideo: false,
            showVideonum: 1,
            // gotoBuy: false,
            // isSelect: false,
          })
        }, 2000);
      } else {
        that.getPromptPark('请选择商品规格！');
        that.setData({ isClickBind: false });//还原点击事件
      }
    }
  },
  // 去支付----从购物车购买
  getBuyFromShoppingCart: function (cartIdStr) {
    var that = this;
    var cartlist = this.data.cartList;
    var pages = getCurrentPages();//获取当前栈数
    var pagesNum = 6;//当前页面不超过的栈数
    // 购物车购物前再次进行库存判断
    for (var cn in cartlist) {
      // 验证失效商品
      if (cartlist[cn].isDel == 1) {
        that.getPromptPark(cartlist[cn].goods_name + "失效")
        that.setData({ isClickBind: false });//还原点击事件
        return;
        break;
      }
      if (cartlist[cn].goods_num > cartlist[cn].goods_storage) {
        that.getPromptPark(cartlist[cn].goods_name + "库存不足")
        that.setData({ isClickBind: false });//还原点击事件
        return;
        break;
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //从购物车购买begin 
    if (cartlist != '') {
      console.log("从购物车购买" + cartIdStr)
      if (pages.length < pagesNum) {
        wx.navigateTo({
          url: '/pages/my/order/order?goodId=' + "" + "&spaecKey=" + this.data.speceNum + "&cartId=" + cartIdStr,
        })
      } else {
        wx.redirectTo({//关闭当前页
          url: '/pages/my/order/order?goodId=' + "" + "&spaecKey=" + this.data.speceNum + "&cartId=" + cartIdStr,
        })
      }
      // 关闭购物车弹窗
      that.closeCarts();
      console.log("购物车路由")
    } else {
      that.getPromptPark('请选择商品！')
      that.setData({ isClickBind: false });//还原点击事件
    }
    //从购物车购买end 
  },
  //去支付
  gotoOrder: function (e) {
    var that = this;
    // ************禁止多次点击**************
    if (that.data.isClickBind) {
      return;
    }
    that.setData({ isClickBind: true });
    // ************禁止多次点击 end**************
    if (typeof (that.data.goodsdetail) == 'undefined' || that.data.goodsdetail == '' || that.data.goodsdetail == null) {
      that.getPromptPark('网络给小龟吃了！')
      that.setData({ isClickBind: false });//还原点击事件
      return;
    }
    if (that.data.goodsdetail.business == false) {
      that.getPromptPark('店铺不在营业时间')
      that.setData({ isClickBind: false });//还原点击事件
      return;
    }
    // 判断商品是否已经下架
    if (that.data.goodsdetail.goods_state != 1) {
      that.getPromptPark('该商品已下架')
      that.setData({ isClickBind: false });//还原点击事件
      return;
    }

    // var pages = getCurrentPages();//获取当前栈数
    // var pagesNum = 8;//当前页面不超过的栈数
    this.getCartDataAfterAddGood(0);
    var cartlist = this.data.cartList;
    var cart_id = [];
    var ifcart_id = e.currentTarget.dataset.ifcartid;
    for (var ids = 0; (typeof (cartlist) != "undefined" && null != cartlist && ids < cartlist.length); ids++) {
      cart_id.push(parseInt(cartlist[ids].cart_id));
    }
    var cartIdStr = cart_id.join(',');
    if (ifcart_id == 0) {//ifcartid=0直接购买ifcartid=1从购物车购买
      cartIdStr = '';
    } else {
      cartIdStr = cartIdStr;
    }
    console.log('cartIdStr:' + cartIdStr)
    if (appUtil.appUtils.getTokenData() == null || appUtil.appUtils.getTokenData() == "") {//判断是否登陆，即判断能否获取到用户的token
      wx.navigateTo({
        url: '/pages/newLogin/newLogin',
      })
      that.setData({ isgetShow: -1 })//开启onshow
      wx.hideLoading()
    } else {
      // 已登录 begin&& that.data.goodsdetail.run_time
      var goodsid = this.data.goodsdetail.goods_id;

      if (ifcart_id == 0) {
        //直接购买
        // 判断商品是否已经失效
        if (that.data.isInvalid == 1) {
          that.getPromptPark('该商品已删除')
          that.setData({ isClickBind: false });//还原点击事件
          return;
        }
        that.getDirectPurchase(cartIdStr);
      } else {
        //从购物车购买
        that.getBuyFromShoppingCart(cartIdStr);
      }
      this.setData({ isgetShow: -1 })//开启onshow
      // 已登录 end
    }
  },
  // 扫码购物
  scanCodeShopping: function () {
    var that = this;
    var goodsDetails = that.data.goodsdetail;
    // 判断是否支持扫码购物
    if (goodsDetails.speediness == 0) {
      that.getPromptPark('不支持扫码购物');
      return;
    }
    // 只允许从相机扫码
    wx.scanCode({//getSearchStoreGoodsBarcode
      onlyFromCamera: true,
      success: (res) => {
        var urls = res.result;
        var urlsString = urls.substring(0, 4);
        console.log("扫码链接" + res.result, "urlsString", urlsString)
        //判断是条形码还是二维码
        if (urlsString == 'http' || urls.indexOf("/") != -1) {
          // 扫描的是二维码
          console.log("截取链接" + res.result.substring(8, 30))
          var resUrl = res.result.substring(8, 30);//截取相关url关键字段
          // var urls = res.result;
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
                    // url: '/pages/detail/goodsdetail?goodId=' + value,
                    url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + value,
                  })
                }
              })
            }
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
          } else {
            //商品码错误
            that.setData({ isPrompt: !that.data.isPrompt, promptTit: that.data.promptTitle })
            setTimeout(function () {
              that.setData({ isPrompt: !that.data.isPrompt })
            }, 2000)
          }
          // console.log("扫描的是二维码")
          // that.getPromptPark('请扫描条形码');
          // that.setData({
          //   scan_source: 0,
          //   isgetShow: 1
          // })
          // return;
        } else {
          // 是条形码
          that.getSearchStoreGoodsBarcode(urls);
        }
      }
    })
  },
  // 条形码
  getSearchStoreGoodsBarcode: function (urls) {
    var that = this;
    // 扫描的是条形码
    appUtil.controllerUtil.getSearchStoreGoodsBarcode({
      store_id: typeof (that.data.goodsdetail) != 'undefined' && that.data.goodsdetail != '' && that.data.goodsdetail != null ? that.data.goodsdetail.store_id : '',
      // store_id: 4887,
      barcode: urls
    }, function (goodsBarcode) {
      console.info("descript:", goodsBarcode.data.message.descript)
      if (goodsBarcode.data.succeeded == true) {
        var storeGoodsBarcode = goodsBarcode.data.data;
        // 判断条形码是否合法
        if (storeGoodsBarcode != '' && storeGoodsBarcode != null) {
          var goodsId = goodsBarcode.data.data.goods_id;
          if (storeGoodsBarcode.goods_specValue != "" && storeGoodsBarcode.goods_specValue != undefined && storeGoodsBarcode.goods_specValue != null) {
            // 含有规格
            var codeSpecValue = storeGoodsBarcode.goods_specValue;//获取code规格值
            var codeSpecValue = JSON.parse(codeSpecValue);
            // 分解codeSpecValue
            var barcodeKey = '';
            for (var co in codeSpecValue) {
              console.info("co", co, "codeSpecValue", codeSpecValue[co])
              // 与当前扫描的条形码与规格中的code码相匹配
              if (codeSpecValue[co].barcode == urls) {
                barcodeKey = co;
                break;
              }
            }
            console.info("codeSpecValue-barcodeKey***************", barcodeKey)
            // 条形码合法
            wx.showLoading({
              title: '加载中',
              mask: true,
              success: function () {
                wx.redirectTo({//关闭当前页面，跳转到应用内的某个页面
                  // url: '/pages/detail/goodsdetail?goodId=' + value,
                  url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + goodsId + '&barcodeKey=' + barcodeKey,
                })
              }
            })
          } else {
            // 无规格
            // 条形码合法
            wx.showLoading({
              title: '加载中',
              mask: true,
              success: function () {
                wx.redirectTo({//关闭当前页面，跳转到应用内的某个页面
                  // url: '/pages/detail/goodsdetail?goodId=' + value,
                  url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + goodsId + '&barcodeKey=' + barcodeKey,
                })
              }
            })
          }
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        } else {
          //条形码非法
          that.getPromptPark('暂无该商品信息');
        }
      } else {
        // 店铺没有该商品
        that.getPromptPark('暂无该商品信息');
      }
    })
  },

  //截取时间&&处理评论区图片
  handleImgAndData: function (goodsdetail) {
    var pictures = [];
    for (var i = 0; i < goodsdetail.shopncEvaluateGoods.length; i++) {//截取年月日
      var strTmp = "" + goodsdetail.shopncEvaluateGoods[i].geval_addtime;
      goodsdetail.shopncEvaluateGoods[i].geval_addtime = strTmp.substring(0, 10);
    }
    for (var i = 0; i < goodsdetail.shopncEvaluateGoods.length; i++) {//处理评论区图片
      var strImg = "" + goodsdetail.shopncEvaluateGoods[i].geval_image_arr;
      pictures[i] = goodsdetail.shopncEvaluateGoods[i].geval_image_arr;
    }
    this.setData({
      pictures: pictures
    })
  },
  //悬浮头部导航TODO
  goHash: function (e) {
    var hash = e.currentTarget.dataset.hash;
    console.log(hash);
    this.setData({
      toView: hash
    })
  },
  //去评价列表
  toComment: function () {
    var goodsId = this.data.goodsdetail.goods_id;
    console.log(goodsId)
    wx.navigateTo({
      url: './evaluate/evaluate?goodId=' + goodsId,
    })
    this.setData({ isgetShow: -1 })//开启onshow
  },
  //商品详情展开收缩
  showAndHide: function () {
    var that = this;
    that.setData({
      isFold: !this.data.isFold
    });
    setTimeout(function () {
      that.getGoodsDetailAndEvaluate();
    }, 100)
  },
  //收藏与取消收藏
  changeImg: function () {
    console.log(appUtil.appUtils.getTokenData());
    var that = this;
    // ************禁止多次点击**************
    if (that.data.isClickBind) {
      return;
    }
    that.setData({ isClickBind: true });
    // ************禁止多次点击 end**************
    //判断是否登陆，即判断能否获取到用户的token
    if (appUtil.appUtils.getTokenData() == null || appUtil.appUtils.getTokenData() == "") {
      wx.showToast({
        title: '尚未登录！',
        image: this.data.icon.login,
        duration: 2000,
        success: function () {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
            that.setData({ isgetShow: -1 })//开启onshow
          }, 2000)

        }
      })
      return;
    }
    // 判断商品是否已经失效
    if (that.data.isInvalid == 1) {
      that.getPromptPark('该商品已删除')
      that.setData({ isClickBind: false });//还原点击事件
      return;
    }
    this.setData({
      ispaly: false,
      showVideo: false,
    });
    wx.request({
      url: appUtil.ajaxUrls().insertShopncFavorites,
      data: {
        store_id: this.data.goodsdetail.store_id,
        goodsId: this.data.goodsdetail.goods_id,
        memberId: that.data.memberId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData()
      },
      method: 'post',
      dataType: '',
      success: function (res) {
        if (res.data.succeeded == true) {
          that.setData({
            collectionImg: !that.data.collectionImg,
            collectionPark: true,
          })
          setTimeout(function () {
            that.setData({
              collectionPark: false,
              isClickBind: false
            });
          }.bind(that), 1500);
        } else {
          if (res.data.message.descript == '账户不存在或者已被注销' || res.data.message.descript == '帐户不存在或者已经被注销' || res.data.error.descript == 'token无效' || res.data.error.code == '401') {
            //用户信息过期
            wx.showToast({
              title: '登录信息失效！',
              image: that.data.icon.login,
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/newLogin/newLogin',
                  })
                  that.setData({ isgetShow: -1 })//开启onshow
                }, 2000)
              }
            })
          } else {
            that.getPromptPark(res.data.message.descript);
          }
        }// console.log(res.data)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //轮播banner图全屏展示
  bannerImage: function (e) {
    var that = this,
      //获取当前图片的下表
      index = e.currentTarget.dataset.index,
      //数据源
      imgUrls = this.data.imgUrls;
    // ************禁止多次点击**************
    if (that.data.isClickBind) {
      return;
    }
    that.setData({ isClickBind: true });
    // ************禁止多次点击 end**************
    wx.previewImage({
      //当前显示下表
      current: imgUrls[index],
      //数据源
      urls: imgUrls,
      success: function () {
        console.log("preNum")
      }
    })
    this.setData({ isgetShow: -1 })//开启onshow
  },
  //评论区展示图全屏展示
  previewImage: function (e) {
    var that = this,
      //获取当前图片的下表
      index = e.currentTarget.dataset.index,
      //数据源
      pictures = this.data.pictures[index];
    // ************禁止多次点击**************
    if (that.data.isClickBind) {
      return;
    }
    that.setData({ isClickBind: true });
    // ************禁止多次点击 end**************
    console.log(this.data)
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
    this.setData({ isgetShow: -1 })//开启onshow
  },
  //购物车商品减少（从购物车）*********LDY************
  substractFromServer: function (good) {
    var that = this;
    console.info("goods_specOld:", good.goods_specOld, "goods_specValueOld", good.goods_specValueOld);
    if (appUtil.appUtils.getTokenData() == null || appUtil.appUtils.getTokenData() == "") {//判断是否登陆，即判断能否获取到用户的token
      wx.navigateTo({
        url: '/pages/newLogin/newLogin',
      })
      that.setData({ isgetShow: -1 })//开启onshow
    }
    var goods_spec = good.goods_spec;
    if (good.spec_key == null) {
      good.spec_key = "";
    }
    wx.request({
      url: appUtil.ajaxUrls().subtractShopncCart, //
      data: {
        "buyer_id": that.data.memberId,
        "store_id": that.data.storeId,
        "goods_id": good.goods_id,
        "goods_price": good.goods_price,
        // "cart_id": good.cart_id,
        "goods_num": parseInt(good.goods_num),
        "goods_spec": typeof (good.goods_specOld) == 'undefined' || good.goods_specOld == '' || good.goods_specOld == null ? goods_spec : good.goods_specOld,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        "spec_value": typeof (good.goods_specValueOld) == 'undefined' || good.goods_specValueOld == '' || good.goods_specValueOld == null ? good.goods_specValue : good.goods_specValueOld,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": good.spec_key
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log("修改购物车返回" + parseInt(good.goods_num) + "---" + goods_spec);
        console.log(res.data)
        if (res.data.message.type == "success") {
          that.setData({ isClickBind: false });
          console.info("购物车中原来有相同的商品")
        } else if (res.data.error.descript == 'token无效' || res.data.error.descript == '你的账号在别处登录了，请重新登录' || res.data.message.descript == '帐户不存在或者已经被注销' || res.data.error.code == '401') {
          wx.navigateTo({
            url: '/pages/newLogin/newLogin',
          })
          that.setData({ isgetShow: -1, isClickBind: false })//开启onshow
        } else {
          that.getPromptPark(res.data.message.descript)
          that.setData({ isClickBind: false });//还原点击事件
        }
        wx.hideLoading();
        //判断登录是否无效是否
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  //添加商品到购物车，从无到有
  insertGoodToCart: function (buyGood) {
    var goodsdetail = this.data.goodsdetail
    var that = this;
    console.log("that.data.memberId:" + that.data.memberId)
    wx.request({
      url: appUtil.ajaxUrls().insertShopncCart, //
      data: {
        "buyer_id": that.data.memberId,
        // "store_id": that.data.storeId,
        "goods_id": buyGood.goods_id,
        // "goods_price": buyGood.goods_price,
        "goods_num": buyGood.goods_num,
        // flg: add,//在购物车原有的基础上添加数量
        // "goods_spec": goodsdetail.goods_specOld,// "{"颜色":{"1":"白色","2":"黑色"},"尺寸":{"3":"S","4":"M"}}",
        // "spec_value": goodsdetail.goods_specValue,//"{"14":{"price":11,"stock":20},"13":{"price":5,"stock":10}}",
        "spec_key": buyGood.spec_key,
        // "store_name": goodsdetail.store_name,
        // "goods_image": goodsdetail.goods_image,
        // "goods_name": goodsdetail.goods_name,
        // "bl_id": 0,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (data) {
        // ******************token无效时提醒 begin********************
        if (data.data.succeeded == false) {
          if (data.data.error.descript == 'token无效' || data.data.message.descript == '帐户不存在或者已经被注销' || data.data.message.descript == '账户不存在或者已被注销' || data.data.error.code == '401') {
            wx.showModal({//token无效时提醒
              // title: '登陆提醒！',
              title: '身份信息过期，请重新登录！',
              success: function (res) {
                if (res.confirm) {
                  //路由通往个人中心页面暂时不通
                  wx.navigateTo({
                    url: '/pages/newLogin/newLogin',
                  })
                  that.setData({ isgetShow: -1 })//开启onshow
                  console.log('用户点击确认')
                } else if (res.cancel) {
                  that.setData({ isClickBind: false });//还原点击事件
                  console.log('用户点击取消')
                }
              }
            })
          } else {
            // 无效状态或非登录的添加购物车失败原因(失效商品)
            if (that.data.goodsdetail.goodsTag == 'video') {
              // 视频情况下
              that.setData({
                showVideo: false,
                showVideonum: 1,
                ispaly: false,
                isClickBind: false,//还原点击事件
              })
              that.getPromptPark(data.data.message.descript)
            } else {
              // 轮播图情况下
              that.getPromptPark(data.data.message.descript)
              that.setData({ isClickBind: false });//还原点击事件
            }
          }
        } else {
          that.closebuys();//关闭购买弹窗
          that.changeAllPriceAndAllNum(buyGood.goods_price, buyGood.goods_num, "add");
          that.setData({ isClickBind: false });
          console.info("购物车从零开始添加商品")
          wx.hideLoading();
        }
        // ******************token无效时提醒 end********************
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  //添加购物车前判断库存方法
  getJudgmentOfStock: function (haveCartNum) {
    var that = this;
    var nowCartNum = haveCartNum + that.data.buyGood.goods_num;//购物车原有相同商品的数量加上现在的数量
    // 判断有无规格
    if (that.data.goodsdetail.goods_spec == '' || typeof (that.data.goodsdetail.goods_spec) == 'undefined') {
      // 判断是否库存不足(无规格)
      if (nowCartNum > that.data.goodsdetail.goods_storage) {
        // 库存不足
        that.setData({ isPrompt: !that.data.isPrompt, promptTit: '库存不足，无法加入购物车' })
        setTimeout(function () {
          that.setData({ isPrompt: !that.data.isPrompt })
        }, 2000);
        return 1;
      } else {
        return 0;
      }
    } else {
      // 判断是否库存不足(有规格)
      if (nowCartNum > that.data.buyGood.stock) {
        // 库存不足
        that.setData({ isPrompt: !that.data.isPrompt, promptTit: '库存不足，无法加入购物车' })
        setTimeout(function () {
          that.setData({ isPrompt: !that.data.isPrompt })
        }, 2000);
        return 1;
      } else {
        return 0;
      }
    }
  },
  //添加购物车（点击加入购物车）
  addCartLRH: function (e) {
    var that = this;
    var cartList = this.data.cartList;
    var buyGood = this.data.buyGood;
    // ************禁止多次点击**************
    if (that.data.isClickBind) {
      return;
    }
    that.setData({ isClickBind: true });
    // ************禁止多次点击 end**************
    // 判断是否选择了规格
    if (buyGood.spec_key == undefined) {
      that.setData({ isPrompt: !that.data.isPrompt, promptTit: '请选择商品规格！' })
      setTimeout(function () {
        that.setData({
          isPrompt: !that.data.isPrompt,
          isClickBind: false,//还原点击事件
        })
      }, 2000)
      return;
    }
    if (appUtil.appUtils.getTokenData() == null || appUtil.appUtils.getTokenData() == "") {//判断是否登陆，即判断能否获取到用户的token
      wx.navigateTo({
        url: '/pages/newLogin/newLogin',
      })
      that.setData({ isgetShow: -1 })//开启onshow
    } else {
      // 已经登录的情况下
      // 判断商品是否已经下架
      if (that.data.goodsdetail.goods_state != 1) {
        that.getPromptPark('该商品已下架')
        that.setData({ isClickBind: false });//还原点击事件
        return;
      }
      // 判断商品是否已经失效
      if (that.data.isInvalid == 1) {
        that.getPromptPark('该商品已删除')
        that.setData({ isClickBind: false });//还原点击事件
        return;
      }
      that.closebuys();//关闭购买弹窗
      var num = this.data.buyGood.goods_num;
      var goods_spec3 = this.data.goods_spec3;
      this.setData({
        gotoBuy: false, goods_spec: goods_spec3,
        isSelect: false,
      });
      var buyGood = this.data.buyGood;
      var cartList = this.data.cartList;
      var flag = false;
      for (var i in cartList) {
        if (cartList[i].goods_id == buyGood.goods_id && cartList[i].spec_key == buyGood.spec_key) {
          console.log("原来的购物车有现在的商品了");
          var changeNum = buyGood.goods_num;
          buyGood.goods_num = cartList[i].goods_num + buyGood.goods_num;
          buyGood.cart_id = cartList[i].cart_id;
          console.log(changeNum + "增加的数量");
          var haveCartNum = cartList[i].goods_num;//购物已有相同的商品的数量
          // this.changeAllPriceAndAllNum(buyGood.goods_price, changeNum, "add");
          flag = true;
          break;
        }
      }
      if (flag) {
        //购物车中原来有相同的商品
        console.log(buyGood.goods_num + "最后购物车商品数量");
        var getJudgmentOfStock = that.getJudgmentOfStock(haveCartNum);
        console.log("getJudgmentOfStock:" + getJudgmentOfStock + " haveCartNum:" + haveCartNum);
        if (getJudgmentOfStock == 1) {//库存不足则返回1
          that.setData({ isClickBind: false });//还原点击事件
          return;
        }

        this.changeAllPriceAndAllNum(buyGood.goods_price, changeNum, "add");
        this.substractFromServer(buyGood);//购物车原来已经有了，继续添加数量
      } else {
        var getJudgmentOfStock = that.getJudgmentOfStock(0);
        console.log("getJudgmentOfStock:" + getJudgmentOfStock)
        if (getJudgmentOfStock == 1) {//库存不足则返回1
          that.setData({ isClickBind: false });//还原点击事件
          return
        }
        // this.changeAllPriceAndAllNum(buyGood.goods_price, buyGood.goods_num, "add");
        this.insertGoodToCart(buyGood);//添加商品到购物车，从无到有
      }
    }
  },
  //去购买----购物车添加数量
  addCartNum: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.my
    var buyGood = this.data.buyGood;
    var specValue = this.data.specValue;
    // var thatchooseKey = e.currentTarget.dataset.skes;
    var thatchooseKey = that.data.chooseKey;
    if (flag == "add") {
      console.log(that.data)
      if (that.data.goodsdetail.goods_spec == '' || typeof (that.data.goodsdetail.goods_spec) == 'undefined') {
        //无规格
        if (buyGood.goods_num < that.data.goodsdetail.goods_storage) {
          buyGood.goods_num = buyGood.goods_num + 1;
        } else {
          //库存不足
          that.setData({ isPrompt: !that.data.isPrompt, promptTit: '库存不足' })
          setTimeout(function () {
            that.setData({ isPrompt: !that.data.isPrompt })
          }, 2000);
        }
      } else {
        //有规格
        for (var key in specValue) {
          console.log(thatchooseKey + "----" + key);
          if (thatchooseKey == key) {
            var buyGood = this.data.buyGood;
            var stocklist = specValue[key].stock;//获取本条数据的库存
          }
        }
        console.log("有规格的库存量：" + stocklist)
        if (buyGood.goods_num < stocklist) {
          buyGood.goods_num = buyGood.goods_num + 1;
        } else {
          //库存不足
          that.setData({ isPrompt: !that.data.isPrompt, promptTit: '库存不足' })
          setTimeout(function () {
            that.setData({ isPrompt: !that.data.isPrompt })
          }, 2000);
        }
      }
    } else {
      if (buyGood.goods_num > 1) {
        buyGood.goods_num = buyGood.goods_num - 1;
      }
    }
    this.setData({ buyGood: buyGood, cartNum: buyGood.goods_num });
  },
  // 1111从购物车里修改数量---add
  AddTheNumberOfShoppingCart: function (e) {
    var that = this;
    // var specValue = this.data.specValue;
    var thatchooseKey = e.currentTarget.dataset.skes;
    var flag = e.currentTarget.dataset.my;
    var id = e.currentTarget.id;
    var cartList = this.data.cartList;
    // 
    for (var i in cartList) {

      if (cartList[i].cart_id == id) {
        // 判断库存
        console.log(thatchooseKey)
        if (typeof (cartList[i].spec_key) == 'undefined' || cartList[i].spec_key == '') {
          //无规格
          console.log("cartList[i].goods_num:" + cartList[i].goods_num + "cartList[i].goods_storage:" + cartList[i].goods_storage)
          if (cartList[i].goods_num < cartList[i].goods_storage) {//判断库存
            cartList[i].goods_num = cartList[i].goods_num + 1;
            this.changeAllPriceAndAllNum(cartList[i].goods_price, 1, "add");
          } else {
            // 无规格之库存不足
            that.setData({ isPrompt: !that.data.isPrompt, promptTit: '库存不足' })
            setTimeout(function () {
              that.setData({ isPrompt: !that.data.isPrompt })
            }, 2000);
            this.changeAllPriceAndAllNum(cartList[i].goods_price, 0, "add");
          }
        } else {//有规格
          var specValue = JSON.parse(cartList[i].goods_specValue);
          for (var key in specValue) {
            console.log(thatchooseKey + "----" + key);
            if (thatchooseKey == key) {
              var buyGood = this.data.buyGood;
              var stocklist = specValue[key].stock;//获取本条数据的库存
            }
          }
          if (cartList[i].goods_num < stocklist) {//判断库存
            cartList[i].goods_num = cartList[i].goods_num + 1;
            this.changeAllPriceAndAllNum(cartList[i].goods_price, 1, "add");
          } else {
            // 有规格之库存不足
            that.setData({ isPrompt: !that.data.isPrompt, promptTit: '库存不足' })
            setTimeout(function () {
              that.setData({ isPrompt: !that.data.isPrompt })
            }, 2000)
            this.changeAllPriceAndAllNum(cartList[i].goods_price, 0, "add");
          }
        }
        console.log("*************+*******************")
        console.log(cartList[i])
        // this.changeAllPriceAndAllNum(cartList[i].goods_price, 1, "add");
        this.substractFromServer(cartList[i]);
        var listPricepr = parseFloat(cartList[i].goods_num * cartList[i].goods_price).toFixed(2);//每条购物车的价格
        cartList[i].listPricepr = listPricepr;
      }
    }

  },
  //1111从购物车里修改数量
  changeCartNumLRH: function (e) {
    var that = this;
    // var specValue = this.data.specValue;
    // var thatchooseKey = e.currentTarget.dataset.skes;
    var flag = e.currentTarget.dataset.my;
    var id = e.currentTarget.id;
    var cartList = this.data.cartList;
    if (flag == "add") {
      // ************add 添加数量***************
      that.AddTheNumberOfShoppingCart(e);
      // **************add****************
    } else {
      // 1111从购物车里修改数量---reduce
      for (var i in cartList) {
        if (cartList[i].cart_id == id) {
          cartList[i].goods_num = cartList[i].goods_num - 1;
          if (cartList[i].goods_num == 0) {
            this.setData({ cartList: cartList })
          }
          console.log("****************-****************")
          console.log(cartList[i])
          this.changeAllPriceAndAllNum(cartList[i].goods_price, 1, "substract");
          this.substractFromServer(cartList[i]);
          var listPricepr = parseFloat(cartList[i].goods_num * cartList[i].goods_price).toFixed(2);//每条购物车的价格
          cartList[i].listPricepr = listPricepr;
        }
      }
    }
    that.getDiscount(1);//满减包邮
    this.setData({ cartList: cartList })
  },
  //总价&&总数量（当点击添加购物车，原来购物车没有时候或者在购物车里操作的时候调用）
  changeAllPriceAndAllNum: function (changePrice, changeNum, flag) {
    var that = this;
    var allCartNum = this.data.allCartNum;
    // var allPrice = parseFloat(this.data.allPrice);
    // var allCartNum =0;
    var allPrice = 0;
    var cartlist = this.data.cartList;
    var packagingFee = 0;
    console.log(this.data.cartList)
    for (var key in cartlist) {
      packagingFee += cartlist[key].packagingFee * cartlist[key].goods_num;
      allPrice = allPrice + parseFloat(cartlist[key].goods_num * cartlist[key].goods_price);
    }
    console.log("packagingFee:" + packagingFee)
    if (flag == "add") {
      allCartNum = allCartNum + changeNum;
      // allPrice = allPrice + parseFloat(changePrice * changeNum);
    } else {
      allCartNum = allCartNum - changeNum;
      // allPrice = allPrice - parseFloat(changePrice * changeNum);
    }
    // 如果数量为0，则关闭弹窗
    if (allCartNum == 0) {
      that.closeCarts();//关闭弹窗
    }
    console.log("allCartNum:" + allCartNum)
    allPrice = parseFloat(allPrice + packagingFee).toFixed(2);
    this.setData({ allPrice: allPrice, allCartNum: allCartNum, packagingFee: packagingFee });
  },
  //点击购物车后刷新数据
  getCartDataAfterAddGood: function (num) {
    var that = this;
    wx.request({
      //url: appUtil.ajaxUrls().getStoreCartData, //
      url: appUtil.ajaxUrls().getStoreCartData + "/" + that.data.memberId + "/" + that.data.storeId,
      data: {
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        // 'androidApi': '3.3.8',
        'api': 'web'
      },
      success: function (res) {
        console.log(that.data.memberId + "得到店铺购物车返回" + that.data.storeId);
        console.log(res)
        var packagingFee = 0;
        if (res.data.message.type == "success") {
          var cartList = res.data.data.cartList;
          for (var i in cartList) {
            var listPricepr = parseFloat(cartList[i].goods_num * cartList[i].goods_price).toFixed(2);//每条购物车的价格
            cartList[i].listPricepr = listPricepr;
            packagingFee += cartList[i].packagingFee * cartList[i].goods_num;
          }
          console.log("packagingFee:" + packagingFee)
          that.setData({
            packagingFee: packagingFee,
            cartList: cartList,
            allCartNum: res.data.data.allCartNum,
            allPrice: parseFloat(res.data.data.cartTotalPrice + packagingFee).toFixed(2)
          })
        }
        if (num == 1) {
          // 如果num==1，则需要用到优惠信息，如果num==0,则不需要用到优惠信息方法，因为在弹出购买弹窗时就调用了该方法
          that.getDiscount(1);
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
  //清空购物车
  clearCart: function () {
    var that = this;
    //clearCart
    wx.request({
      url: appUtil.ajaxUrls().clearShopncCartByCartIdStr, //
      data: {
        "memberId": that.data.memberId,
        "storeId": that.data.storeId,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log("清空购物车返回");
        console.log(res)
        if (res.data.message.type == "success") {
          that.setData({ cartList: [], allCartNum: 0, allPrice: parseFloat(0).toFixed(2) });
          that.closeCarts();
          that.getDiscount(1);//刷新满减包邮
        } else {
          if (res.data.error.code == '401') {
            // 登录信息失效，请重新登录
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          } else {
            that.getPromptPark(res.data.message.descript);
          }
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
  // 解析specValue数据
  setSpecValue: function (goodsdetail) {
    if (goodsdetail.goods_specValue != "" && goodsdetail.goods_specValue != undefined && goodsdetail.goods_specValue != null) {
      var goods_specValue = goodsdetail.goods_specValue;
      var specValue = JSON.parse(goods_specValue);
      this.setData({ specValue: specValue });
    }
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
    var that = this;
    var buyGood = this.data.buyGood;
    var chooseGoodTmp = buyGood;
    var goods_spec = buyGood.goods_spec;//商品规格数组
    var id = e.currentTarget.id;//
    var specKey = e.currentTarget.dataset.speckey;//
    var specValue = buyGood.goods_specValue;
    if (specKey == goods_spec[id].arrIndex) {
      return;
    }
    goods_spec[id].arrIndex = specKey;
    buyGood.goods_spec = goods_spec;
    //选规格时候，要判断最大库存

    // chooseGood.cartNum = wx.getStorageSync("chooseGoodNum") == '' ? 11 : wx.getStorageSync("chooseGoodNum");
    this.setData({ buyGood: buyGood });//设置一组规格里面，选择哪个商品

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
          buyGood.goods_num = wx.getStorageSync("chooseGoodNum") == '' ? 1 : wx.getStorageSync("chooseGoodNum");
          //debugger
          if (parseInt(buyGood.goods_num) > parseInt(specValue[key].stock)) {
            buyGood.goods_num = specValue[key].stock;
            wx.setStorageSync("chooseGoodNum", parseInt(specValue[key].stock));
            this.setData({ buyGood: buyGood });//重新根据最大库存设置所选商品的数量
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
            if (stock < buyGood.goods_num) {
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
      buyGood.goods_spec = goods_spec;
      this.setData({ buyGood: buyGood });
    } else if (specChooseNum == 0) {//都选了的情况,且当前选的key里面没有灰色状态的key同一行
      var obj = this.checkIsSameColumn(specKey, goods_spec);
      var arrChoosed = goods_spec[id];
      var specKeyNowArr = specKey;//当前选择的此组的规格
      var haveSetStateKeys = [];
      for (var key in specValue) {//遍历所有规格,以当前选择的规格为根节点进行判断分类
        console.info("组合", key + "--" + specValue[key].stock + "--" + buyGood.goods_num);
        if (key.indexOf(specKeyNowArr) > -1 && parseInt(specValue[key].stock) < parseInt(buyGood.goods_num)) {//对库存不足组合做处理
          //当规格组合中包含当前点击的那个组合、差最后一个没有选的、库存不足的就把那个没有选的设为不可选
          //chooseAllSpec 是当前选的全部规格的组合
          //key是可能选的库存不足的组合
          //判断chooseAllSpec是否有包含只差最后一个规格的组合
          // debugger
          console.info("可能库存不足组合", key + "--" + specValue[key].stock + "--" + buyGood.goods_num);
          var checkValue = this.checkChooseAllSpecIsNotLastSameWhithKey(chooseAllSpec, key);
          if (checkValue.flag) {//如果是true就设置noChooseKey为灰色状态
            haveSetStateKeys.push(checkValue.noChooseKey);
            this.setHaveChooseSpecState(0, checkValue.noChooseKey, buyGood);
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
                that.setHaveChooseSpecState(1, item, buyGood);
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
          if (buyGood.goods_price = Number(Number(specValue[key].price) * (Number(buyGood.price_discount) / 10)).toFixed(2) > 0) {
            buyGood.goods_price = Number(Number(specValue[key].price) * (Number(buyGood.price_discount) / 10)).toFixed(2);
          } else {
            buyGood.goods_price = Number(specValue[key].price).toFixed(2);
          }
          buyGood.spec_key = key;
          buyGood.stock = specValue[key].stock;
          console.info("chooseKey---", chooseKey)
          this.setData({
            buyGood: buyGood, chooseKey: chooseKey,
          });
          if (that.data.goodsdetail.ruleList.length > 0 || that.data.goodsdetail.packageMallList.length > 0) {
            // 当满减优惠，和满减包邮信息不为空时执行
            that.setData({
              ischooseKey: true,//显示满减优惠提示
            })
            that.getDiscount(0);//调用满减优惠信息方法
          }
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
  checkGoodStorageBeforeChangeChooseNum: function (buyGood, toBeCartNum) {
    var goods_spec = buyGood.goods_spec;//商品规格数组
    var specValue = buyGood.goods_specValue;
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
  updateSpeciStateBeforeChangeChooseNum: function (buyGood, toBeCartNum) {
    var goods_spec = buyGood.goods_spec;//商品规格数组
    var specValue = buyGood.goods_specValue;
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
      buyGood.goods_spec = goods_spec;
      this.setData({ buyGood: buyGood });
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
      buyGood.goods_spec = goods_spec;
      this.setData({ buyGood: buyGood });
    }
  },
  // 购物车数量的修改LDY
  changeChooseNum: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.my;
    var buyGood = this.data.buyGood;
    if (flag == "add") { // 数量添加
      //  根据有无规格区别判断是否库存不足
      if (that.data.goodsdetail.goods_spec == '' || typeof (that.data.goodsdetail.goods_spec) == 'undefined') {
        // 无规格
        if (buyGood.goods_num >= that.data.goodsdetail.goods_storage) {
          //库存不足
          that.getPromptPark('库存不足，无法购买')
          return;
        }
      } else {
        // 有规格
        if (this.checkGoodStorageBeforeChangeChooseNum(buyGood, buyGood.goods_num + 1)) {
          this.getPromptPark('库存不足，无法购买');
          return;
        }
      }
      var goods_num = parseInt(buyGood.goods_num);
      buyGood.goods_num = goods_num + 1;
      wx.setStorageSync("chooseGoodNum", buyGood.goods_num);
    } else {
      // 数量减少
      var goods_num = buyGood.goods_num;
      if (goods_num != 1 && goods_num != 0) {
        buyGood.goods_num = goods_num - 1;
        this.updateSpeciStateBeforeChangeChooseNum(buyGood, buyGood.goods_num);
        wx.setStorageSync("chooseGoodNum", buyGood.goods_num);
      }
    }
    this.setData({ buyGood: buyGood, cartNum: buyGood.goods_num });
    that.getDiscount(0);//调用满减优惠信息方法
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
  setHaveChooseSpecState: function (state, key, buyGood) {
    var goods_spec = buyGood.goods_spec;
    for (var i = 0; i < goods_spec.length; i++) {
      for (var j = 0; j < goods_spec[i].vals.length; j++) {
        if (goods_spec[i].vals[j].specKey == key) {
          goods_spec[i].vals[j].stockEnough = state;
        }
      }
    }
    buyGood.goods_spec = goods_spec;
    this.setData({ buyGood: buyGood });
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
  closebuys: function () {//关闭购买弹窗
    if (this.data.goodsdetail.goodsTag == 'video') {
      if (this.data.ispaly || (typeof (this.data.ispalyVideo) != 'undefined' && this.data.ispalyVideo)) {
        //打开弹窗时为播放状态
        this.setData({
          showVideo: true,
          showVideonum: 0,
          ispalyVideo: false//删除判断视频正在播放的状态
        })
        console.log("购买播放")
      } else {
        //打开弹窗时为关闭状态
        this.setData({
          showVideo: false,
          showVideonum: 1
        })
        console.log("购买非播放")
      }
    }
    console.log("**********************cartNum:***************************")
    this.setData({
      gotoBuy: false,
      isSelect: false,
      cartNum: 1,
      ischooseKey: false,//隐藏满减优惠提示
      // showVideo: true,
      // showVideonum: 0
    });
    console.info("关闭购买弹窗")
  },
  //点击购买
  tobuy: function () {//弹出购买弹窗
    var that = this;
    wx.setStorageSync("chooseGoodNum", "");
    this.getCartDataAfterAddGood(0);
    var goodsdetail = this.data.goodsdetail;
    var goods_spec = that.goodsSpec(goodsdetail);
    // ******************当主图为视频时，进行视频的隐藏与显示********************
    if (this.data.goodsdetail.goodsTag == 'video') {
      if (this.data.ispaly || (typeof (this.data.ispalyVideo) != 'undefined' && this.data.ispalyVideo)) {
        // 是播放状态打开弹窗
        this.setData({
          showVideo: false,
          showVideonum: 1,
          ispalyVideo: true//保存判断视频正在播放的状态
        })
        console.log("购买播放")
      } else {
        // 关闭状态下打开弹窗
        this.setData({
          showVideo: false,
          showVideonum: 1
        })
        console.log("购买非播放")
      }
    }
    // ******************当主图为视频时，进行视频的隐藏与显示 end********************
    if (this.data.showHideCart == true) {
      this.setData({
        showHideCart: false
      });
    }
    if (goodsdetail.goods_specValue == "" || goodsdetail.goods_specValue == undefined || goodsdetail.goods_specValue == null) {
      // 无规格
      this.setData({
        gotoBuy: !this.data.gotoBuy,
        //初始化购买商品的值
        buyGood: {
          goods_id: goodsdetail.goods_id,
          goods_num: 1,
          goods_name: goodsdetail.goods_name,
          goods_marketprice: goodsdetail.goodsPriceStr,//市场价
          goods_price: goodsdetail.discountPriceStr,//折扣价
          goods_specOld: goodsdetail.goods_specOld,
          goods_specValueOld: goodsdetail.goods_specValue,
          // goods_spec: this.data.goods_spec,
          // goods_specValue: this.data.specValue,
          goods_spec: '',
          goods_specValue: '',
          spec_key: ''
        },
      });
      if (goodsdetail.ruleList.length > 0 || goodsdetail.packageMallList.length > 0) {
        // 当满减优惠，和满减包邮信息不为空时执行
        that.setData({
          ischooseKey: true,//显示满减优惠提示
        })
        that.getDiscount(0);//调用满减优惠信息方法
      }

    } else {
      this.setData({
        gotoBuy: !this.data.gotoBuy,
        //初始化购买商品的值
        buyGood: {
          goods_id: goodsdetail.goods_id,
          goods_num: 1,
          goods_name: goodsdetail.goods_name,
          goods_marketprice: goodsdetail.goodsPriceStr,//市场价
          goods_price: goodsdetail.discountPriceStr,//折扣价
          goods_specOld: goodsdetail.goods_specOld,
          goods_specValueOld: goodsdetail.goods_specValue,
          // goods_spec: this.data.goods_spec,
          goods_spec: goods_spec,
          goods_specValue: this.data.specValue,
        }
      });
    }
  },
  // 扫码进到详情后弹出选中相对应规格的弹窗
  getSpecWindows: function (scan_source, goodsdetail, goods_spec, barcodeKey, isload) {
    var that = this;
    if (scan_source == 3 && isload == 1) {
      wx.setStorageSync("chooseGoodNum", "");
      // 是扫码进来的商品
      if (goodsdetail.goods_specValue == "" || goodsdetail.goods_specValue == undefined || goodsdetail.goods_specValue == null || typeof (barcodeKey) == 'undefined') {
        // 无规格
        console.log("getSpecWindows11111")
      } else {
        // 有规格
        var barcodeKeyArr = barcodeKey.split(',');
        console.info("getSpecWindows22222", "---barcodeKey", barcodeKey)
        var spec_Value = JSON.parse(goodsdetail.goods_specValue);

        for (var v in spec_Value) {
          if (v.indexOf(barcodeKey) != -1 && barcodeKey != '') {
            var vaStock = parseInt(spec_Value[v].stock);//得到对应规格的库存
            var vaprice = spec_Value[v].price;//得到对应规格的价格
            console.info("扫码后得到的spec_Value", v)
          }
        }
        console.info("spec_Value", spec_Value, "vaStock", vaStock)
        // 自动选择规格前判断库存
        if (vaStock > 0) {
          for (var v in goods_spec) {
            goods_spec[v].arrIndex = barcodeKeyArr[v];
          }
          // 库存大于0
          that.setData({
            gotoBuy: true,
            //初始化购买商品的值
            isSelect: true,
            chooseKey: barcodeKey,
            buyGood: {
              goods_id: goodsdetail.goods_id,
              goods_num: 1,
              goods_name: goodsdetail.goods_name,
              goods_marketprice: goodsdetail.goodsPriceStr,//市场价
              // goods_price: goodsdetail.discountPriceStr,//折扣价
              goods_price: typeof (vaprice) == 'undefined' || vaprice == '' || vaprice == null ? goodsdetail.discountPriceStr : vaprice,//得到选中相对应规格的价格
              goods_spec: goods_spec,
              goods_specValue: this.data.specValue,
              spec_key: barcodeKey,
              goods_specOld: goodsdetail.goods_specOld,
              goods_specValueOld: goodsdetail.goods_specValue,
            }
          });
          if ((goodsdetail.ruleList.length > 0 || goodsdetail.packageMallList.length > 0) && barcodeKey != '') {
            // 当满减优惠，和满减包邮信息不为空时执行
            console.info("没选规格不执行", barcodeKey, "goods_spec", goods_spec)
            setTimeout(function () {
              that.setData({
                ischooseKey: true,//显示满减优惠提示
              })
              that.getDiscount(0);//调用满减优惠信息方法
            }, 600)
          }
        } else {
          // 库存等于0
          that.setData({
            gotoBuy: true,
            //初始化购买商品的值
            isSelect: true,
            chooseKey: '',
            buyGood: {
              goods_id: goodsdetail.goods_id,
              goods_num: 1,
              goods_name: goodsdetail.goods_name,
              goods_marketprice: goodsdetail.goodsPriceStr,//市场价
              goods_price: goodsdetail.discountPriceStr,//折扣价
              goods_spec: goods_spec,
              goods_specValue: this.data.specValue,
              spec_key: '',
              goods_specOld: goodsdetail.goods_specOld,
              goods_specValueOld: goodsdetail.goods_specValue,
            }
          });
        }
      }
    }
  },
  //分解规格
  goodsSpec: function (goodsdetail) {
    var that = this;
    /***规格解析***/
    console.log(goodsdetail.goods_spec)
    if (goodsdetail.goods_spec != '' && goodsdetail.goods_spec != null) {
      var specValue = JSON.parse(goodsdetail.goods_specValue);
      var goodsSpec = JSON.parse(goodsdetail.goods_spec);
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
      console.log(greantArr)
    }
    /***规格***/
    return greantArr;
  },
  myReplaceAll: function (str, mode, replace) {//处理富文本
    if (str != null) {
      while (str.indexOf(mode) != -1) {
        str = str.replace(mode, replace);
      }
      while (str.indexOf('imgmy') != -1) {
        str = str.replace('imgmy', 'img');
      }
      return str;
    }
  },
  //初始化页面数据
  getgooodsDetail: function (goods_id, scan_source, barcodeKey, isload) {
    var that = this;
    appUtil.controllerUtil.getgoodsDetail({
      goodsId: goods_id,
      // goodsId: 89008,//,//,//多规格,无规格84731
      scan_source: scan_source,//扫码进入传3，正常进入不传或传0
      latitude: 0,
      longitude: 0,//(typeof (options.cartId) == "undefined") 
      memberId: that.data.memberId,
    }, function (res) {
      if (res.data.succeeded == true) {
        var goodsdetail = res.data.data;
        console.log(goodsdetail);
        var nodes = that.myReplaceAll(goodsdetail.mobile_body, "<img ", "<imgmy style=\"width:100%;\" mode=\"widthFix\" ");
        var cartList = goodsdetail.cartList;
        var goods_spec = goodsdetail.goods_spec;
        // var priceDiscount = (goodsdetail.price_discount) / 10;//打折参数
        // if (priceDiscount > 0) {//打折后价格处理
        //   goodsdetail.goodsPriceStr = parseFloat(goodsdetail.goodsPriceStr * priceDiscount).toFixed(2);
        // } else {
        //   goodsdetail.goodsPriceStr = goodsdetail.goodsPriceStr;
        // }
        wx.setNavigationBarTitle({//标题文字		
          title: goodsdetail.goods_name
        })
        goodsdetail.goods_specOld = goods_spec;
        var goods_spec = that.goodsSpec(goodsdetail);//规格
        // goodsdetail.goods_spec = goods_spec;
        that.setData({ goods_spec: goods_spec, goods_spec3: goods_spec });//goods_spec3用于将选择的规则归默认
        that.handleImgAndData(goodsdetail);//处理日期和评论区图片
        that.setSpecValue(goodsdetail);
        that.getSpecWindows(scan_source, goodsdetail, goods_spec, barcodeKey, isload)
        // if (scan_source == 3) {(条形码码传参优化)
        //   that.getSpecWindows(scan_source, goodsdetail, goods_spec, barcodeKey)
        // }
        if (goodsdetail != '' && goodsdetail != null && typeof (goodsdetail) != 'undefined') {
          that.setData({
            goodsDetailShow: true
          })
        }
        that.setData({
          goodsdetail: goodsdetail,
          nodes: nodes,
          collectionImg: goodsdetail.favorites,
          imgUrls: goodsdetail.imageOrVideo,
          cartList: cartList,
          goods_price: goodsdetail.goods_price,//立即购买中的实际价格
          speceNum: 0,
          storeId: goodsdetail.store_id,
          isSelect: scan_source == 3 ? true : true,
          scollTopHeihgt: -1,
          opacityChild: 0.8,//跟随导航1
          opacityParent: 0, //跟随导航2,
          showVideo: false,
          navShowImg: 0,
          ispaly: false,//视频的播放状态
          showVideonum: 0,//判断是否显示视频0为img,1为视频
          goodsId: goods_id,
          scan_source: scan_source,
          isInvalid: goodsdetail.isDel,//判断是否为失效商品0为正常，1为失效
        })
        wx.hideLoading();
        that.getCartDataAfterAddGood(0);
        setTimeout(function () {
          that.getDetailContent();//获取详情内容的高度
        }, 600)
      } else {
        console.log(res.data)
        if (res.data.error.descript == '系统繁忙，请稍候' || res.data.message.descript == '系统繁忙，请稍候') {
          wx.hideLoading();
          that.getPromptPark('商品没找着')
          setTimeout(function () { wx.navigateBack({}); }, 1500)
        } else if (res.data.message.descript == '商品不存在') {
          wx.hideLoading();
          that.getPromptPark('商品没找着')
          setTimeout(function () { wx.navigateBack({}); }, 1500)
        } else {
          console.log("错误提示：" + res.data.message.descript);
          that.getPromptPark(res.data.message.descript);
          setTimeout(function () { wx.navigateBack({}); }, 1500)
        }
      }
    })
  },
  //视频替换图片点击复原视频
  bannerShowVideo: function () {
    this.setData({
      showVideo: true,
      showVideonum: 0
    })
  },
  // 当开始/继续播放时触发play事件
  getstartPlay: function () {
    this.setData({
      ispaly: true,
    })
    console.log("paly")
  },
  // 当暂停播放时触发 pause 事件
  getstopPause: function () {
    this.setData({
      ispaly: false,
    })
    console.log("pause")
  },
  //弹出购物车弹窗----购物车中含有商品
  getHandleIsVideo: function () {
    var that = this;
// -------------------------------------------------
    //购物车中含有商品
    if (this.data.goodsdetail.goodsTag == 'video') {
      if (this.data.ispaly || (typeof (this.data.ispalyVideo) != 'undefined' && this.data.ispalyVideo)) {
        // 是播放状态打开弹窗
        console.log(this.data.showVideonum)
        if (this.data.showVideonum == 1) {//如果showVideonum=1则显示视频
          this.setData({
            showVideo: true,
            showVideonum: 0,
            ispalyVideo: false//删除判断视频正在播放的状态
          })
        } else {
          this.setData({
            showVideo: false,
            showVideonum: 1,
            ispalyVideo: true//保存判断视频正在播放的状态
          })
        }
        console.log("播放")
      } else {
        // 关闭状态下打开弹窗
        this.setData({
          showVideo: false,
          showVideonum: 1
        })
        console.log("非播放")
      }
    }
    if (this.data.gotoBuy == true) {
      this.setData({
        gotoBuy: false
      });
    }
     // -------------------------------------------
    // 动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    })
    this.animation = animation
    this.setData({
      showHideCart: !this.data.showHideCart
    })
    if (this.data.showHideCart) {
      animation.translateY(-397).step()
    } else {
      animation.translateY(0).step()
    }
    this.setData({
      animationData: animation.export()
    })

  },
  // 弹出购物车弹窗----购物车中没有商品
  getHandleNotVideo: function () {
    var that = this;
    //购物车中没有商品
    setTimeout(function () { wx.hideLoading(); }, 300)
    if (this.data.goodsdetail.goodsTag == 'video') {
      //视频下的提示框
      setTimeout(function () {
        wx.showToast({
          title: '购物车为空！',
          image: that.data.icon.emptyCart,
          duration: 1500
        })
      }, 300)
    } else {
      // 普通图片
      setTimeout(function () { that.getPromptPark('购物车空空如也，请添加商品！'); }, 300)
    }
    that.setData({
      showHideCart: false
    })
  },
  //弹出购物车弹窗
  addcarts: function () {
    var that = this;
    this.getCartDataAfterAddGood(1);
    // console.log(this.data.allCartNum)
    if (this.data.allCartNum > 0) {
      //弹出购物车弹窗----购物车中含有商品
      that.getHandleIsVideo();
      // *********************
    } else {
      // 弹出购物车弹窗----购物车中没有商品
      that.getHandleNotVideo();
      // that.setData({ isClickBind: false });
    }

  },
  //关闭购物车弹窗
  closeCarts: function () {
    if (this.data.goodsdetail.goodsTag == 'video') {
      if (this.data.ispaly || (typeof (this.data.ispalyVideo) != 'undefined' && this.data.ispalyVideo)) {
        //打开弹窗时为播放状态
        this.setData({
          showVideo: true,
          showVideonum: 0,
          ispalyVideo: false//删除判断视频正在播放的状态
        })
      } else {
        //打开弹窗时为关闭状态
        this.setData({
          showVideo: false,
          showVideonum: 1
        })
      }
    }
    // 动画
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-in-out',
      delay: 0
    })
    this.setData({
      showHideCart: false
    });
    this.animation = animation;
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // (appUtil.appUtils.getMemberIdData() == 'undefined' || appUtil.appUtils.getMemberIdData() == null || appUtil.appUtils.getMemberIdData() == "") ? 0 : appUtil.appUtils.getMemberIdData().memberData.member_id //获取用户的member_id
    // var storeId = 4895;
    var memberId = (appUtil.appUtils.getMemberIdData() == 'undefined' || appUtil.appUtils.getMemberIdData() == null || appUtil.appUtils.getMemberIdData() == "") ? 0 : appUtil.appUtils.getMemberIdData().memberData.member_id;
    // this.setData({ storeId: storeId,  });
    var q = options.q;
    var value = "";
    var isload = 1;
    // options.goodId = 117224;
    if (q != undefined) {
      // 扫描进入详情
      q = decodeURIComponent(options.q);//对二维码进来的链接进行转码
      var strIndex = q.lastIndexOf("/");//获取转码之后的goodsid
      var barcodeKey = options.barcodeKey;//获取条形码的规格key
      value = q.substring(strIndex + 1, q.length);
      var scan_source = 3;//扫码进来的商品
      console.log("barcodeKey:" + barcodeKey)
      this.setData({ scan_source: scan_source, goodId: value, memberId: memberId, barcodeKey: barcodeKey });
    } else {
      // 非扫码进入详情
      var scan_source = 0;
      var barcodeKey = '';//获取条形码的规格key
      value = options.goodId;
      this.setData({ scan_source: scan_source, goodId: options.goodId, memberId: memberId, barcodeKey: barcodeKey });
    }
    this.getgooodsDetail(value, scan_source, barcodeKey, isload);
    this.setData({ isgetShow: 1 })
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.getGoodsDetailAndEvaluate();
    }, 600)

  },
  onShow: function () {
    var that = this;
    var isload = -1;
    var memberId = (appUtil.appUtils.getMemberIdData() == 'undefined' || appUtil.appUtils.getMemberIdData() == null || appUtil.appUtils.getMemberIdData() == "") ? 0 : appUtil.appUtils.getMemberIdData().memberData.member_id;
    if (this.data.isgetShow == -1) {
      this.getgooodsDetail(this.data.goodId, this.data.scan_source, this.data.barcodeKey, isload);
      // this.getCartDataAfterAddGood();//重新刷新购物车数据
      this.setData({ isClickBind: false, memberId: memberId });
    }
    // setTimeout(function () {
    //   that.getGoodsDetailHeight();//获取商品详情部分的内容
    // }, 800)
  },
  onHide: function () {
    console.log("---------------onHide-----------------")
    this.setData({
      barcodeKey: ''
    })
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  // onShareAppMessage: function () {
  // },
  /****优惠信息----满减优惠****/
  getFullReduction: function (Pricerulpric) {
    var that = this;
    // var Pricerulpric = parseFloat(this.data.allPrice);
    var greater_rulpric = 0, greater_package = 0;
    var less_rulpric = 0, less_package = 0;
    var last_rulpric = 0, last_package = 0;//最大优惠值
    var goodsdetail = this.data.goodsdetail;
    var ruleList = goodsdetail.ruleList;//满减优惠
    var packageMallList = goodsdetail.packageMallList;//满减减邮
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
      // priceDifference: parseFloat(greater_rulpric - this.data.allPrice).toFixed(2),
      priceDifference: parseFloat(greater_rulpric - Pricerulpric).toFixed(2),
      rulpric_discount: rulpric_discount,//再买可优惠的金额
      already_discount: already_discount,//已经满足了的优惠金额
    })
    // console.log("最小值：" + less_rulpric + ' 最大值：' + greater_rulpric + " last_rulpric:" + last_rulpric + " rulpric_discount:" + rulpric_discount)
  },
  /****优惠信息----买满包邮费****/
  getBuyAFullPackage: function (Pricerulpric) {
    var that = this;
    // var Pricerulpric = parseFloat(this.data.allPrice);
    var greater_rulpric = 0, greater_package = 0;
    var less_rulpric = 0, less_package = 0;
    var last_rulpric = 0, last_package = 0;//最大优惠值
    var goodsdetail = this.data.goodsdetail;
    var ruleList = goodsdetail.ruleList;//满减优惠
    var packageMallList = goodsdetail.packageMallList;//满减减邮
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
        } else {//如果没有上一条数据
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
          // 当价格满足最大的包邮条件
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
      // packageDifference: parseFloat(greater_package - this.data.allPrice).toFixed(2),//还差多少
      packageDifference: parseFloat(greater_package - Pricerulpric).toFixed(2),//还差多少
      rulpric_discount_package: rulpric_discount_package,//再买可包送的里程
      already_discount_package: already_discount_package,//已经满足了的包送里程
      carriageFee: carriageFee,//配送费
    })
  },
  /****优惠信息****/
  getDiscount: function (num) {
    var that = this;
    // num=1为购物车的优惠信息，num=0为去购买的优惠信息
    if (num == 0) {
      var goodsdetail = this.data.goodsdetail;
      var goods_Prices = that.data.buyGood.goods_price;//去购买的实时价格
      var goods_Nums = that.data.buyGood.goods_num;//去购买的实时数量
      var packaging_Fee = that.data.goodsdetail.packagingFee;//去购买的实时打包费
      if (goodsdetail.goods_specValue == "" || goodsdetail.goods_specValue == undefined || goodsdetail.goods_specValue == null) {
        // 无规格
        var Pricerulpric = parseFloat(goodsdetail.discountPriceStr * goods_Nums) + parseFloat(packaging_Fee * goods_Nums);//折扣价
      } else {
        // 存在规格
        var Pricerulpric = parseFloat(goods_Prices * goods_Nums) + parseFloat(packaging_Fee * goods_Nums);
      }
      console.info("Pricerulpric1", Pricerulpric)
    } else {
      var Pricerulpric = parseFloat(this.data.allPrice);
      console.info("Pricerulpric2", Pricerulpric)
    }
    console.info("打印优惠信息", Pricerulpric)
    that.getFullReduction(Pricerulpric);
    that.getBuyAFullPackage(Pricerulpric);
  },
  // 获取商品详情内容高度
  getDetailContent: function () {
    var that = this;
    setTimeout(function () {
      wx.createSelectorQuery().select('#hash2').fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (rect) {
        // console.info("********rect.height scrollY**********", rect.height)
        that.setData({
          contenthash2: rect.height == null || rect.height == '' || typeof (rect.height) == 'undefined' ? 0 : rect.height
        })
      }).exec()
      // wx.createSelectorQuery().select('#hash2').boundingClientRect(function (rect) {
      //   // console.log("******************第二阶段内容************************")
      //   that.setData({
      //     contenthash2: rect.height
      //   })
      //   console.info("********rect.height**********", rect.height)
      // }).exec();
    }, 600)
  },
})
 //选择规格LRH
  // chooseSpec: function (e) {
  //   var goods_spec = this.data.goods_spec;
  //   var id = e.currentTarget.id;//
  //   var specKey = e.currentTarget.dataset.speckey;//
  //   var specValue = this.data.specValue;
  //   goods_spec[id].arrIndex = specKey;
  //   this.setData({ goods_spec: goods_spec, isSelect: true });
  //   var flag = true;
  //   for (var i in goods_spec) {
  //     if (goods_spec[i].arrIndex == -1) {
  //       flag = false;
  //     }
  //   }
  //   if (flag) {
  //     var chooseKey = "";
  //     for (var i in goods_spec) {
  //       var chooseSpecIndex = goods_spec[i].arrIndex;
  //       console.log(i + "chooseSpecIndex--------------" + chooseSpecIndex);
  //       chooseKey = chooseKey + "," + chooseSpecIndex;
  //     }
  //     var len = chooseKey.length;
  //     if (chooseKey.indexOf(",") > -1) {
  //       chooseKey = chooseKey.substring(1, len);
  //     }
  //     var priceDiscount = (this.data.goodsdetail.price_discount) / 10;//打折参数
  //     console.log(chooseKey);
  //     console.log("priceDiscount:" + priceDiscount);
  //     for (var key in specValue) {
  //       console.log(chooseKey + "----" + key);
  //       if (chooseKey == key) {
  //         var buyGood = this.data.buyGood;
  //         if (priceDiscount > 0) {
  //           buyGood.goods_price = parseFloat(specValue[key].price * priceDiscount).toFixed(2);
  //         } else {
  //           buyGood.goods_price = parseFloat(specValue[key].price).toFixed(2);
  //         }
  //         // buyGood.goods_price = parseFloat(specValue[key].price * priceDiscount).toFixed(2);
  //         buyGood.spec_key = key;
  //         buyGood.stock = specValue[key].stock;
  //         this.setData({ buyGood: buyGood, chooseKey: chooseKey });
  //       }
  //     }
  //   }

  // },
// *****************************************
// 条形码(条形码码传参优化)
// getSearchStoreGoodsBarcode: function (urls) {
//   var that = this;
//   // 扫描的是条形码
//   appUtil.controllerUtil.getSearchStoreGoodsBarcode({
//     store_id: typeof (that.data.goodsdetail) != 'undefined' && that.data.goodsdetail != '' && that.data.goodsdetail != null ? that.data.goodsdetail.store_id : '',
//     // store_id: 4887,
//     barcode: urls
//   }, function (goodsBarcode) {
//     if (goodsBarcode.data.succeeded == true) {
//       var storeGoodsBarcode = goodsBarcode.data.data;
//       // 判断条形码是否合法
//       if (storeGoodsBarcode != '' && storeGoodsBarcode != null) {
//         var goodsId = goodsBarcode.data.data.goods_id;
//         // ----------------------------------------
//         wx.showLoading({
//           title: '加载中',
//           mask: true,
//           success: function () {
//             wx.redirectTo({//关闭当前页面，跳转到应用内的某个页面
//               // url: '/pages/detail/goodsdetail?goodId=' + value,
//               url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + goodsId + '&barcodeKey=' + urls,
//             })
//           }
//         })
//         setTimeout(function () {
//           wx.hideLoading()
//         }, 2000)
//         // ----------------------------------------

//         // if (storeGoodsBarcode.goods_specValue != "" && storeGoodsBarcode.goods_specValue != undefined && storeGoodsBarcode.goods_specValue != null) {
//         //   // 含有规格
//         //   var codeSpecValue = storeGoodsBarcode.goods_specValue;//获取code规格值
//         //   var codeSpecValue = JSON.parse(codeSpecValue);
//         //   // 分解codeSpecValue
//         //   for (var co in codeSpecValue) {
//         //     console.info("co", co, "codeSpecValue", codeSpecValue[co])
//         //     // 与当前扫描的条形码与规格中的code码相匹配
//         //     if (codeSpecValue[co].barcode == urls) {
//         //       var barcodeKey = co;
//         //       break;
//         //     }
//         //   }
//         //   console.info("codeSpecValue-barcodeKey***************", barcodeKey)
//         //   // 条形码合法
//         //   wx.showLoading({
//         //     title: '加载中',
//         //     mask: true,
//         //     success: function () {
//         //       wx.redirectTo({//关闭当前页面，跳转到应用内的某个页面
//         //         // url: '/pages/detail/goodsdetail?goodId=' + value,
//         //         url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + goodsId + '&barcodeKey=' + barcodeKey,
//         //       })
//         //     }
//         //   })
//         // } else {
//         //   // 无规格
//         //   // 条形码合法
//         //   wx.showLoading({
//         //     title: '加载中',
//         //     mask: true,
//         //     success: function () {
//         //       wx.redirectTo({//关闭当前页面，跳转到应用内的某个页面
//         //         // url: '/pages/detail/goodsdetail?goodId=' + value,
//         //         url: '/pages/detail/goodsdetail?q=' + 'https://api.xiaoguikuaipao.com/goods/' + goodsId + '&barcodeKey=' + '',
//         //       })
//         //     }
//         //   })
//         // }
//         // setTimeout(function () {
//         //   wx.hideLoading()
//         // }, 2000)


//       } else {
//         //条形码非法
//         that.getPromptPark('暂无该商品信息');
//       }
//     } else {
//       // 店铺没有该商品
//       that.getPromptPark('暂无该商品信息');
//     }
//   })
// },
// 扫码进到详情后弹出选中相对应规格的弹窗(条形码码传参优化)
// getSpecWindows: function (scan_source, goodsdetail, goods_spec, barcodeKey) {
//   var that = this;
//   // 是扫码进来的商品
//   if (goodsdetail.goods_specValue == "" || goodsdetail.goods_specValue == undefined || goodsdetail.goods_specValue == null) {
//     // 无规格
//     console.log("getSpecWindows11111")
//   } else {
//     // 有规格
//     var codeSpecValue = goodsdetail.goods_specValue;//获取code规格值
//     var codeSpecValue = JSON.parse(codeSpecValue);
//     // 分解codeSpecValue
//     for (var co in codeSpecValue) {
//       console.info("co", co, "codeSpecValue", codeSpecValue[co])
//       // 与当前扫描的条形码与规格中的code码相匹配
//       if (codeSpecValue[co].barcode == barcodeKey) {
//         var barcodeKeyVal = co;
//         break;
//       }
//     }
//     var barcodeKeyArr = barcodeKeyVal.split(',');//将获取到的当前规格转换成数组
//     console.info("getSpecWindows22222", "---barcodeKey", barcodeKey)
//     this.setData({
//       gotoBuy: true,
//       //初始化购买商品的值
//       isSelect: true,
//       buyGood: {
//         goods_id: goodsdetail.goods_id,
//         goods_num: 1,
//         goods_name: goodsdetail.goods_name,
//         goods_marketprice: goodsdetail.goods_price,
//         goods_price: goodsdetail.goodsPriceStr,
//         goods_spec: goodsdetail.goods_specOld,
//         goods_specValue: goodsdetail.goods_specValue,
//         spec_key: barcodeKey
//       }
//     });
//     for (var v in goods_spec) {
//       goods_spec[v].arrIndex = barcodeKeyArr[v];
//     }
//     console.info("goods_spec************", goods_spec)
//     that.setData({
//       goods_spec: goods_spec,
//       chooseKey: barcodeKey
//     })
//   }
// },