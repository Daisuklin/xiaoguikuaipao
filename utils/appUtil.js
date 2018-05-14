var PE = require("./publicEnvironment");
const requestUrlList = () => {
  var isTest = PE.isTest
  if (isTest) {
    var logisticsUrl = "https://logistics.xiaoguikuaipao.com";
    var requestUrl = 'https://api.xiaoguikuaipao.com';
    var devrequestUrl = "https://api.xiaoguikuaipao.com"
  } else {
    var devrequestUrl = "https://dev-api.xiaoguikuaipao.com"
    var logisticsUrl = "https://dev-logistics.xiaoguikuaipao.com";
    var requestUrl = 'https://dev-api.xiaoguikuaipao.com';
  }
  var requestUrlt = requestUrl//'http://112.74.28.99:8080'; //测试服务器
  var requestTXM = requestUrl;//"http://112.74.28.99:8080"
  var requestUrl3 = requestUrl;//'https://api.xiaoguikuaipao.com/api/v1/';
  var test = requestUrl;//'http://112.74.28.99:8081'; //测试服务器
  var login = logisticsUrl + "/api/v1/users/auth/unionLogin";  //登陆接口 post password username
  var loginUrl = logisticsUrl + "/api/v1/login/login"; //登陆接口 post password username
  var captcha = logisticsUrl + "/api/v1/captcha";  //短信验证码接口
  var bindMobile = logisticsUrl + "/api/v1/users/bind/mobile";  /*绑定手机接口 { "code": "string", "mobile": "string", "openId": "string","unionId": "string" }*/

  var goodsList = requestUrl + "/api/v1/good/list"; //登陆商品列表接口 
  var code2session = requestUrl + "/api/v1/wxapp/code2session"; //得到用户 unionid 
  var goodsDetail = requestUrl + "/api/v1/getGoodsByGoodId2";  //商品详情接口 goodsId 、latitude,   longitude,  memberId

  var userInfoByEncryptedDataUrl = requestUrl + "/api/v1/wxapp/userInfo";  //解密获取用户信息EncryptedData
  var tokenUrl = requestUrl + "/api/v1/shopMc/memberInfo";  //商店信息
  var goodsList = requestUrl + "/api/v1/good/list";  //登陆商品列表接口 

  var code2session = requestUrl + "/api/v1/wxapp/code2session";  //得到用户 unionid 

  //林锐宏 start
  var getHomeData = requestUrl + "/api/v1/selectShopncStoreByCommendVersion2" //获取平台店铺首页数据
  var newStoreInfo = requestUrl + "/api/v1/selectShopncStorePageInfo" //获取店铺主题列表，商品
  var getStoreBaseInfo = requestUrl + "/api/v1/selectShopncStoreInfoByStoreId" //得到店铺基本信息
  var getStoreGoods = requestUrl + "/api/v1/selectGoodsByStore" //得到店铺商品
  var getShopncCartByMemberId = requestUrl + "/api/v1/getShopncCartByMemberId" //获取平台购物车
  // var getFruitStores = requestUrl + "/api/v1/selectShopncStoreByThemeIdActicity" //获取水果主题列表店铺
  var getFruitStores = requestUrl + "/api/v1/selectStoreByThemeId" //获取水果主题列表店铺
  var getActLife = requestUrl + "/api/v1/selectShopncEvaluateGoodsByStoreIdForShopnc" //获取动态生活
  var getStoreClass = requestUrl + "/api/v1/getAllStoreGoodsClassListByStoreId" //获取店铺分类
  // var getClassContent = requestUrl + "/api/v1/selectShopncStoreAndLabelByGcIdVersion1"//获取具体分类内容
  var getClassContent = requestUrl + "/api/v1/getStoreByCommend"//获取具体分类内容
  var getClassByBigClassId = requestUrl + "/api/v1/getAllClass"//获取二级分类的下属分类
  var getHotWords = requestUrl + "/api/v1/getShopncKeyWordHotFlag"//获取热门搜索关键词
  //var getSearchList = requestUrl + "/api/v1/selectShopnStoreZhongheToliufeng"//获取搜索列表
  var getSearchList = requestUrl + "/api/v1/selectShopnStoreComplex"//获取搜索列表
  // var getImgClassStores = requestUrl + "/api/v1/selectShopnStoreZhongheToStorePageToliuFeng"//点击二级分类图片查询店铺
  var getImgClassStores = requestUrl + "/api/v1/selectShopnStoreComplexToStore"//点击二级分类图片查询店铺
  var getSearchGood = requestUrl + "/api/v1/selectShopncGoodsZhonghe"//获取搜索商品列表
  var getSingleActLife = requestUrl + "/api/v1/selectShopncEvaluateGoodsInfoByEvalId"//获取单条动态详情
  var getScanGoods = requestUrl + "/api/v1/selectScanGoods"//获取已扫商品
  var getSpecialStore = requestUrl + "/api/v1/selectShopncStoreById" //获取店铺信息（美食类）
  var getStoreCartData = requestUrl + "/api/v1/getShopncCartByMemberIdAndStoreId"//获取美食类购物车信息
  var addCart = requestUrl + "/api/v1/shopCart/addCart"//--lrh--"/api/v1/insertShopncCart"//添加购物车
  var substractCart = requestUrl + "/api/v1/shopCart/addCart"//--lrh--"/api/v1/subtractShopncCart"//修改（增加减少）购物车
  var clearCart = requestUrl + "/api/v1/clearShopncCartByCartIdStr"//清空购物车
  var focusStore = requestUrl + "/api/v1/focuson"//关注店铺
  var collectGood = requestUrl + "/api/v1/insertShopncFavorites"//收藏商品
  var getDissertation = requestUrl + "/api/v1/selectShopncStorePageOneInfo"//获取活动专题图文信息
  var setRaise = requestUrl + "/api/v1/shopMc/updateThumbUp"//点赞
  var getSingleStoreCart = requestUrl + "/api/v1/getShopncCartByMemberIdStoreId"//单独得到非左右模板店铺的购物车
  var getThemeGoodList = requestUrl + "/api/v1/shopMc/selectSkipGoods"//得到主题的商品列表
  var updateByCartId = requestUrl + "/api/v1/shopCart/addCart"//--lrh--"/api/v1/shopMc/updateByCartId"//平台购物车修改商品数量
  var getStoreData2 = requestUrlt + "/api/v1/store/getStoreDetail"//获取左右模版店铺内容新方式，来源滔哥
  var getGoodsByCat = requestUrlt + "/api/v1/store/getGooodsByStcids"//按分类分页加载获取商品，来源滔哥
  var getLogoAndName = requestUrl + "/api/v1/shopMc/selectStoreMsg/"

  var getHistories = logisticsUrl + "/api/v1/payBalance/getBalanceList"//获取充值记录
  var getCouponDetail = logisticsUrl + "/api/v1/profiles/detail"
  var getCoupons = logisticsUrl + "/api/v1/areaConfig/getGiveRule"
  var setPayState = logisticsUrl + "/api/v1/profiles"
  var payCoupon = logisticsUrl + "/api/v1/pays/paybalance/mobile"
  var getCouponById = logisticsUrl + "/api/v1/areaGiveRule/getGiveRule/"
  var getSpecByTXM = requestTXM + "/api/v1/searchStoreGoodsBarcode"//根据条形码获取商品
  var delCartsNew = requestUrl + "/api/v1/deleteShopncCart"
  var getPopularStores = devrequestUrl + "/api/v1/selectStoreByPopular";
  //林锐宏 end


  //罗伟星begin

  var mailUrl = logisticsUrl + '/api/v1/expressOrders/create' //预约寄件接口
  var alwaysUrl = logisticsUrl + '/api/v1/addresses/list'//联系地址总管理接口
  var addressUrl = logisticsUrl + '/api/v1/addresses/sender/list'//寄件人地址管理接口
  var consigneeUrl = logisticsUrl + '/api/v1/addresses/receiver/list'//收货人地址管理接口
  var orderListUrl = logisticsUrl + "/api/v1/shopMc/selectOrderList" //订单列表接口
  var addressesUrl = logisticsUrl + '/api/v1/addresses'//创建地址
  var removeUrl = logisticsUrl + '/api/v1/addresses'//删除地址
  var commodityUrl = requestUrl + '/api/v1/selectShopncGoodsByFavorites'//商品列表
  var storeUrl = requestUrl + '/api/v1/getShopncStoreByFocus'//查询关注店铺
  var deleteUrl = requestUrl + '/api/v1/focuson'//取消收藏店铺
  var cancelUrl = requestUrl + '/api/v1/insertShopncFavorites'//取消收藏商品
  var modificationUrl = logisticsUrl + '/api/v1/addresses'//修改地址
  var locationUrl = logisticsUrl + '/api/v1/addresses'//编辑原地址
  var defaultUrl = logisticsUrl + '/api/v1/addresses/default'//设置默认接口
  var gainUrl = logisticsUrl + '/api/v1/addresses'//获取地址
  var freightUrl = logisticsUrl + '/api/v1/expressOrders/calculateCarriageFee'//计算运费接口
  var evaluateUrl = requestUrl + '/api/v1/insertshopncEvaluateGoods2'//新增订单评价
  var evaluatelistUrl = requestUrl + '/api/v1/shopMc/selectOrderDetails'//评价订单
  var areaUrl = logisticsUrl + '/api/v1/serviceCharge' //区域服务费(夜间和天气)
  var paymentUrl = logisticsUrl + '/api/v1/pays/wechat/express/mobile'//统一支付入口(new)
  //罗伟星 end

  // 林德有 begin
  var goodsDetail = requestUrl + "/api/v1/getGoodsByGoodId2" //商品详情接口 goodsId 、latitude, longitude, memberId
  var insertShopncFavorites = requestUrl + "/api/v1/insertShopncFavorites" //收藏接口store_id，goodsId，memberId
  var selectShopncEvaluate = requestUrl + "/api/v1/selectShopncEvaluateGoodsBygoodsId" //获取商品评价列表 goodsId， pageIndex
  var insertShopncCart = requestUrl + "/api/v1/shopCart/addCart"//--ldy--"/api/v1/insertShopncCart" //详情页添加购物车
  // var subtractShopncCart = requestUrl + "/api/v1/updateByCartId"; //修改购物车
  var subtractShopncCart = requestUrl + "/api/v1/shopCart/addCart"//--ldy--"/api/v1/subtractShopncCart"; //修改购物车
  var selectDownOrders = requestUrl + "/api/v1/shopMc/selectDownOrders" //确认订单接口{goods, pintuan, cart_id, ifcart,spec_key}
  var submitOrder = requestUrl + "/api/v1/shopMc/submitOrder" //提交订单

  var clearShopncCartByCartIdStr = requestUrl + "/api/v1/clearShopncCartByCartIdStr" //清空购物车接口memberId、 storeId
  var selectOrderDetails = requestUrl + "/api/v1/shopMc/selectOrderDetails" //订单详情
  var applyPay = requestUrl + '/api/v1/pay/applyPay'//支付接口
  var getStoreCartData = requestUrl + "/api/v1/getShopncCartByMemberIdAndStoreId"//获取美食类购物车信息
  var addCart = requestUrl + "/api/v1/insertShopncCart"//添加购物车
  var cancellationOfOrder = requestUrl + "/api/v1/shopMc/updateCancellationOrder" //取消订单 必传order_id
  var urgeOrder = requestUrl + "/api/v1/shopMc/urgeOrder" //催单
  var insertorderRefund = requestUrl + "/api/v1/shopMc/insertorderRefund" //退款接口 必传参：order_id，reason_info
  var insertBuyerReturns = requestUrl + "/api/v1/shopMc/insertBuyerReturns" //退货接口
  var searchStoreGoodsBarcode = requestUrl + "/api/v1/searchStoreGoodsBarcode" //扫描条形码处理接口 "store_id":4895,arcode":"5435345345345"
  var selectShopncStoreByCommendVersion3 = devrequestUrl + '/api/v1/selectStoreByCommend' //新版首页接口 参数:areaCode、memberId
  var getaddresses = logisticsUrl + '/api/v1/addresses/' //得到地址id后重新处理地址接口 +addressId
  // 林德有 end

  //曹智攀 begin
  var localUrl = requestUrl; //'http://127.0.0.1:8080';
  // test
  /* var code2session = localUrl + "/api/v1/wxapp/code2session"  //得到用户 unionid
   var userInfoByEncryptedDataUrl = localUrl + "/api/v1/wxapp/userInfo";  //解密获取用户信息EncryptedData
   var login = localUrl + "/api/v1/users/auth/unionLogin";  //登陆接口 post password username*/


  var isPass = localUrl + "/api/v1/isPass"; //版本判断借口
  var orderListUrl = localUrl + "/api/v1/shopMc/selectShopOrderList"; //订单列表接口
  var orderOnceMoreById = localUrl + "/api/v1/shopMc/orderOnceMoreById/";//买家再来一单
  var selectRefundReason = localUrl + "/api/v1/shopMc/selectRefundReason";//退货原因
  var selectRefundMoneyReason = localUrl + "/api/v1/shopMc/selectRefundMoneyReason";//退款原因
  var insertorderRefundUrl = localUrl + "/api/v1/shopMc/insertorderRefund";//POST 买家订单------退款 必传参：order_id，reason_info
  var urgeOrder = localUrl + "/api/v1/shopMc/urgeOrder";//POST 买家------催单 必传参：order_id，reason_info
  var insertBuyerReturns = localUrl + "/api/v1/shopMc/insertBuyerReturns";//POST 买家订单------退货 必传参：必传参：order_id，reason_id（可不传），reason_info，buyer_message
  var updateorderCompletion = localUrl + "/api/v1/shopMc/updateorderCompletion";//POST 买家------确认收货 必传参：order_id，reason_info
  var updateCancellationOrder = localUrl + "/api/v1/shopMc/updateCancellationOrder";//POST 买家------取消订单 必传参：order_id，reason_info
  var updateCancellationOrder = localUrl + "/api/v1/shopMc/updateCancellationOrder";//POST 买家------取消订单 必传参：order_id，reason_info
  //var DistributionOrderListUrl = localUrl + "/api/v1/expressOrders/views";//POST 查看用户订单列表 必传参：{"pageIndex": "string","type": "all"}
  var DistributionOrderListUrl = logisticsUrl + "/api/v1/expressOrders/views";//POST 查看用户配送列表 必传参：{"pageIndex": "string","type": "all"}
  var DistributionOrderDetailUrl = logisticsUrl + "/api/v1/expressOrders/view/";//POST 查看订单详情 必传参：id
  var cancelOrderDetailUrl = logisticsUrl + "/api/v1/expressOrders/cancel/"   //支付前取消订单,配送员信息确认前取消
  //评论接口
  var userCommentsUrl = logisticsUrl + "/api/v1/comments"; //添加评论
  //评论状态接口
  var userCommentStateUrl = logisticsUrl + "/api/v1/comments/state"; //评论状态
  //曹智攀 end


  return {
    userInfoByEncryptedDataUrl: userInfoByEncryptedDataUrl,
    loginUrl: login,
    goodsListUrl: goodsList,
    captchaUrl: captcha,
    code2sessionUrl: code2session,
    bindMobileUrl: bindMobile,

    goodsList: goodsList,
    captcha: captcha,
    code2session: code2session,
    goodsDetail: goodsDetail,

    //林锐宏 start
    getHomeData: getHomeData,
    newStoreInfo: newStoreInfo,
    getStoreBaseInfo: getStoreBaseInfo,
    getStoreGoods: getStoreGoods,
    getShopncCartByMemberId: getShopncCartByMemberId,
    getFruitStores: getFruitStores,
    tokenUrl: tokenUrl,
    getActLife: getActLife,
    getStoreClass: getStoreClass,
    getClassContent: getClassContent,
    getClassByBigClassId: getClassByBigClassId,
    getHotWords: getHotWords,
    getSearchList: getSearchList,
    getImgClassStores: getImgClassStores,
    getSpecialStore: getSpecialStore,
    getStoreCartData: getStoreCartData,
    getSingleActLife: getSingleActLife,
    getScanGoods: getScanGoods,
    addCart: addCart,
    substractCart: substractCart,
    clearCart: clearCart,
    collectGood: collectGood,
    focusStore: focusStore,
    getDissertation: getDissertation,
    setRaise: setRaise,
    getSearchGood: getSearchGood,
    getSingleStoreCart: getSingleStoreCart,
    getThemeGoodList: getThemeGoodList,
    updateByCartId: updateByCartId,
    getStoreData2: getStoreData2,
    getGoodsByCat: getGoodsByCat,
    getLogoAndName: getLogoAndName,
    getHistories: getHistories,
    getCouponDetail: getCouponDetail,
    getCoupons: getCoupons,
    setPayState: setPayState,
    payCoupon: payCoupon,
    getCouponById: getCouponById,
    getSpecByTXM: getSpecByTXM,
    delCartsNew: delCartsNew,

    getPopularStores: getPopularStores,
    //林锐宏 end

    // 林德有begin
    goodsDetail: goodsDetail,
    insertShopncFavorites: insertShopncFavorites,
    selectShopncEvaluate: selectShopncEvaluate,
    insertShopncCart: insertShopncCart,
    subtractShopncCart: subtractShopncCart,
    selectDownOrders: selectDownOrders,
    submitOrder: submitOrder,
    clearShopncCartByCartIdStr: clearShopncCartByCartIdStr,
    selectOrderDetails: selectOrderDetails,
    applyPay: applyPay,
    getStoreCartData: getStoreCartData,
    addCart: addCart,
    cancellationOfOrder: cancellationOfOrder,
    urgeOrder: urgeOrder,
    insertorderRefund: insertorderRefund,
    insertBuyerReturns: insertBuyerReturns,
    searchStoreGoodsBarcode: searchStoreGoodsBarcode,
    frontPageInterface: selectShopncStoreByCommendVersion3,
    getaddresses: getaddresses,
    //林德有end
    //星星start
    removeUrl: removeUrl,
    addressUrl: addressUrl,
    consigneeUrl: consigneeUrl,
    orderListUrl: orderListUrl,
    alwaysUrl: alwaysUrl,
    mailUrl: mailUrl,
    addressesUrl: addressesUrl,
    commodityUrl: commodityUrl,
    storeUrl: storeUrl,
    deleteUrl: deleteUrl,
    cancelUrl: cancelUrl,
    modificationUrl: modificationUrl,
    locationUrl: locationUrl,
    defaultUrl: defaultUrl,
    gainUrl: gainUrl,
    evaluateUrl: evaluateUrl,
    freightUrl: freightUrl,
    evaluatelistUrl: evaluatelistUrl,
    areaUrl: areaUrl,
    paymentUrl: paymentUrl,
    //星星end

    //曹智攀begin
    isPassUrl: isPass,
    orderOnceMoreByIdUrl: orderOnceMoreById,
    selectRefundReasonUrl: selectRefundReason,
    selectRefundMoneyReasonUrl: selectRefundMoneyReason,
    insertorderRefundUrl: insertorderRefundUrl,
    urgeOrder: urgeOrder,
    updateCancellationOrder: updateCancellationOrder,
    updateorderCompletion: updateorderCompletion,
    insertBuyerReturnsUrl: insertBuyerReturns,
    DistributionOrderListUrl: DistributionOrderListUrl,
    DistributionOrderDetailUrl: DistributionOrderDetailUrl,
    cancelOrderDetailUrl: cancelOrderDetailUrl,
    userCommentsUrl: userCommentsUrl,
    userCommentStateUrl: userCommentStateUrl,
    //曹智攀end
  }

}
var changePageState = true;
const lrhMethods = {
  initPageState: function () {
    changePageState = true;
  },
  checkPageState: function () {
    console.log(changePageState);
    var flag = undefined;
    flag = changePageState;
    if (changePageState) {
      changePageState = false;
    }
    return flag;
    // appUtil.lrhMethods.initPageState();
  },
  getMemberId: () => {
    return ('undefined' != typeof (wx.getStorageSync("blackUserInfo")) && wx.getStorageSync("blackUserInfo") != null && 'undefined' != typeof (wx.getStorageSync("blackUserInfo").memberData) && null != wx.getStorageSync("blackUserInfo").memberData && 'undefined' != typeof (wx.getStorageSync("blackUserInfo").memberData.member_id) && null != wx.getStorageSync("blackUserInfo").memberData.member_id) ? wx.getStorageSync("blackUserInfo").memberData.member_id : null;
  },
  getMemberIdUser: () => {
    //得到的用户blackUserInfo
    if (undefined == typeof (wx.getStorageSync("blackUserInfo")) || wx.getStorageSync("blackUserInfo") == null || wx.getStorageSync("blackUserInfo") == "") {
      wx.showToast({
        title: '请您先登录',
        icon: "loading",
        duration: 800,
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/newLogin/newLogin',
        })
      }, 1000);

      return null;
    }
    return wx.getStorageSync("blackUserInfo").memberData.member_id;
  },
}
const controllerUtil = {
  // 林德有begin
  getaddresses: (addressId, paras, callback)=>{//根据地址id重新处理地址信息
    wx.request({
      url: requestUrlList().getaddresses + addressId,
      data: paras,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 退货
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  getFrontPageInterface: (paras, callback) => {//新版首页接口
    wx.request({
      url: requestUrlList().frontPageInterface,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 退货
        // 'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  getSearchStoreGoodsBarcode: (paras, callback) => {//扫描条形码接口
    wx.request({
      url: requestUrlList().searchStoreGoodsBarcode,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 退货
        // 'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  getinsertBuyerReturns: (paras, callback) => {
    wx.request({
      url: requestUrlList().insertBuyerReturns,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 退货
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  insertorderRefund: (paras, callback) => {
    wx.request({
      url: requestUrlList().insertorderRefund,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 退款
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  toDoUrgeOrder: (paras, callback) => {
    wx.request({
      url: requestUrlList().urgeOrder,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 催单
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  cancellationOfOrder: (paras, callback) => {
    wx.request({
      url: requestUrlList().cancellationOfOrder,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 取消订单
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  gotoApplyPay: (paras, callback) => {
    wx.request({
      url: requestUrlList().applyPay,
      data: paras,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 去支付接口
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },

  getInsertShopncCart: (paras, callback) => {
    wx.request({
      url: requestUrlList().insertShopncCart,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 详情添加购物车
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  getSelectDownOrders: (paras, callback) =>//订单确认页面数据接口
  {
    wx.request({
      url: requestUrlList().selectDownOrders,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  onSubmitOrder: (paras, callback, callfail) => {//提交订单
    wx.request({
      url: requestUrlList().submitOrder,
      data: paras,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        callback(data);
      },
      fail: function (data) {
        callfail(data);
      }
    })
  },
  getgoodsDetail: (paras, callback) => {
    wx.request({
      url: requestUrlList().goodsDetail,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json', // 详情页数据
        'api': 'web'
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  clearShopncCart: (paras, callback) => {
    wx.request({
      url: requestUrlList().clearShopncCartByCartIdStr,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json', // 清空购物车
        'api': 'web',
        'Authorization': appUtils.getTokenData(),
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  getselectOrderDetails: (paras, callback) => {
    wx.request({
      url: requestUrlList().selectOrderDetails,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json', // 订单详情
        'api': 'web',
        'shopMcAuthorization': appUtils.getTokenData(),
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  getSelectRefundMoneyReason: (successCallback, failCallback, completeCallback) => {//申请退款原因
    wx.request({
      url: requestUrlList().selectRefundMoneyReasonUrl,
      data: null,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        successCallback(data)
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  // 林德有end
  getUserTokenController: (paras, callback) => {
    //请求token
    wx.request({
      url: requestUrlList().tokenUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  login: (paras, callback) => {
    //请求登陆接口
    wx.request({
      url: requestUrlList().loginUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (data) {
        callback(data);
      }
    })
  },
  sendValidate: (paras, callback) => {
    //发送验证码
    wx.request({
      url: requestUrlList().captchaUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (res) {
        callback(res.data);
      }
    })
  },
  getDemodifier: (paras, callback, errorCallback) => {
    //解码Unicode
    wx.request({
      url: requestUrlList().userInfoByEncryptedDataUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (res) {
        callback(res.data);
      }, fail: function (res) {
        errorCallback(res);
      }
    })
  },
  bindMobile: (paras, callback) => {
    //解码Unicode
    wx.request({
      url: requestUrlList().bindMobileUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (res) {
        callback(res.data);
      }
    })
  }, getUserOpenIdController: (paras, callback) => {
    wx.request({
      url: requestUrlList().code2sessionUrl,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web'
      },
      success: function (res) {
        callback(res)
      }
    });
  },
  //曹智攀 begin
  //首页-审核代码判断
  isPassCode: (successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().isPassUrl,
      data: {},
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'api': 'web',
      },
      success: function (data) {

        successCallback(data)
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--商家订单--全部
  orderListByUserCenter: (paras, successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().orderListUrl,
      data: paras,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--商家订单--退款
  insertorderRefund: (paras, successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().insertorderRefundUrl,
      data: paras,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--商家订单--退货
  insertBuyerReturns: (paras, successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().insertBuyerReturnsUrl,
      data: paras,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--商家订单--催单
  urgeOrder: (paras, successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().urgeOrder,
      data: paras,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },

  //个人中心--订单模块--商家订单--再来一单
  getOrderOnceMoreById: (orderId, successCallback, failCallback, completeCallback) => {

    wx.request({
      url: requestUrlList().orderOnceMoreByIdUrl + orderId,
      data: null,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--商家订单--取消订单
  updateCancellationOrder: (paras, successCallback, failCallback, completeCallback) => {

    wx.request({
      url: requestUrlList().updateCancellationOrder,
      data: paras,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--配送列表
  DistributionOrderList: (paras, successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().DistributionOrderListUrl,
      data: paras,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--配送列表--配送订单详情
  DistributionOrderDetail: (id, successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().DistributionOrderDetailUrl + "/" + id,
      data: {},
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--配送列表--配送订单详情--取消订单
  CancelOrderDetail: (id, pare, successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().cancelOrderDetailUrl + id,
      data: pare,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  //个人中心--订单模块--商家订单--确认收货
  updateorderCompletion: (parem, successCallback, failCallback, completeCallback) => {

    wx.request({
      url: requestUrlList().updateorderCompletion,
      data: parem,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  getSelectRefundReason: (successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().selectRefundReasonUrl,
      data: null,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  getSelectRefundMoneyReason: (successCallback, failCallback, completeCallback) => {
    wx.request({
      url: requestUrlList().selectRefundMoneyReasonUrl,
      data: null,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'shopMcAuthorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        if (typeof (data.data.error) != 'undefined' && data.data.error != null && data.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/newLogin/newLogin',
            })
          }, 1000);
        } else {
          successCallback(data)
        }
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  setUserComments: (datas, successCallback, failCallback, completeCallback) => {
    //评论
    wx.request({
      url: requestUrlList().userCommentsUrl,
      data: datas,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        successCallback(data)
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  },
  getUserCommentState: (datas, successCallback, failCallback, completeCallback) => {
    //评论状态
    wx.request({
      url: requestUrlList().userCommentStateUrl,
      data: datas,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': appUtils.getTokenData(),
        'api': 'web',
      },
      success: function (data) {
        successCallback(data)
      }, fail: function (e) {
        if (typeof (failCallback) != "undefined" && null != failCallback) {
          failCallback(e)
        }
      }, complete: function (e) {
        if (typeof (completeCallback) != "undefined" && null != completeCallback) {
          completeCallback(e)
        }
      }
    })
  }
  //曹智攀 end

}


const appUtils = {
  getMemberId: () => {
    return ('undefined' != typeof (wx.getStorageSync("blackUserInfo")) && wx.getStorageSync("blackUserInfo") != null && 'undefined' != typeof (wx.getStorageSync("blackUserInfo").memberData) && null != wx.getStorageSync("blackUserInfo").memberData && 'undefined' != typeof (wx.getStorageSync("blackUserInfo").memberData.member_id) && null != wx.getStorageSync("blackUserInfo").memberData.member_id) ? wx.getStorageSync("blackUserInfo").memberData.member_id : null;
  },
  getBlackUser: () => {
    //返回平台用户信息
    return (undefined != typeof (wx.getStorageSync("blackUserInfo")) && wx.getStorageSync("blackUserInfo") != null) ? wx.getStorageSync("blackUserInfo") : null;
  },
  setBlackUser: val => {
    //设置平台用户信息
    wx.setStorageSync("blackUserInfo", val);
  }
  ,
  getStorageUser: () => {
    //得到本地保存的用户信息，拿去不到为null
    return (undefined != typeof (wx.getStorageSync("userInfo")) && wx.getStorageSync("userInfo") != null) ? wx.getStorageSync("userInfo") : null;
  },
  setStorageUser: val => {
    //保存的用户信息
    wx.setStorageSync("userInfo", val);
  }
  , setEncryptedData: val => {
    //保存的用户加密信息 
    wx.setStorageSync("encryptedData", val);
  }
  , getEncryptedData: () => {
    //得到的用户加密信息
    return (undefined != typeof (wx.getStorageSync("encryptedData")) && wx.getStorageSync("encryptedData") != null) ? wx.getStorageSync("encryptedData") : null;
  }
  , setUnionIdData: val => {
    //保存的unionid
    wx.setStorageSync("unionid", val);
  }
  , getUnionIdData: () => {
    //得到的用户unionid
    return (undefined != typeof (wx.getStorageSync("unionid")) && wx.getStorageSync("unionid") != null) ? wx.getStorageSync("unionid") : null;
  }
  , setOpenIdData: val => {
    //保存的openid
    wx.setStorageSync("openid", val);
  }
  , getOpenIdData: () => {
    //得到的用户openid
    return (undefined != typeof (wx.getStorageSync("openid")) && wx.getStorageSync("openid") != null) ? wx.getStorageSync("openid") : null;
  },
  setSessionkeyData: val => {
    //保存的sessionkey
    wx.setStorageSync("sessionkey", val);
  }
  , getSessionkeyData: () => {
    //得到的用户sessionkey
    return (undefined != typeof (wx.getStorageSync("sessionkey")) && wx.getStorageSync("sessionkey") != null) ? wx.getStorageSync("sessionkey") : null;
  },
  setTokenData: val => {
    //保存的sessionkey
    wx.setStorageSync("token", val);
  }
  , getTokenData: () => {
    //得到的用户sessionkey
    return (undefined != typeof (wx.getStorageSync("token")) && wx.getStorageSync("token") != null) ? wx.getStorageSync("token") : null;
  },
  //林锐宏 start
  setShowMessage: () => {
    wx.showToast({
      title: '登录失效',
      icon: "loading",
      duration: 800,
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/newLogin/newLogin',
      })
    }, 1000);
  },
  getTokenDataUser: () => {
    //得到的用户sessionkey
    if (undefined == typeof (wx.getStorageSync("token")) || wx.getStorageSync("token") == null || wx.getStorageSync("token") == "") {
      wx.showToast({
        title: '请您先登录',
        icon: "loading",
        duration: 800,
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/newLogin/newLogin',
        })
      }, 1000);

      return null;
    }
    return wx.getStorageSync("token");
  },
  //林锐宏 end
  // 林德有begin
  getMemberIdData: () => {
    //得到的用户blackUserInfo
    return (undefined != typeof (wx.getStorageSync("blackUserInfo")) && wx.getStorageSync("blackUserInfo") != null) ? wx.getStorageSync("blackUserInfo") : null;
  },
  getDefaltId: () => {
    //得到的用户blackUserInfo
    return (undefined != typeof (wx.getStorageSync("defaltId")) && wx.getStorageSync("defaltId") != null) ? wx.getStorageSync("defaltId") : null;
  },
  //林德有end

  //星星begin
  getmakeJudgData: () => {
    //得到本地保存的判断信息,拿到指定id
    return (undefined != typeof (wx.getStorageSync("makeJudgment")) && wx.getStorageSync("makeJudgment") != null) ? wx.getStorageSync("makeJudgment") : null;
  },
  getmailIdData: () => {
    //获取本地mailId
    return (undefined != typeof (wx.getStorageSync("mailId")) && wx.getStorageSync("mailId") != null) ? wx.getStorageSync("mailId") : null;
  },
  getaddresseeIdData: () => {
    //获取本地addresseeId
    return (undefined != typeof (wx.getStorageSync("addresseeId")) && wx.getStorageSync("addresseeId") != null) ? wx.getStorageSync("addresseeId") : null;
  },
  getareaCodeData: () => {
    //获取本地的区域码areaCode
    return (undefined != typeof (wx.getStorageSync("areaCode")) && wx.getStorageSync("areaCode") != null) ? wx.getStorageSync("areaCode") : null;
  },
  getassignmentData: () => {
    //获取评价列表本地缓存中的assignment
    return (undefined != typeof (wx.getStorageSync("assignment")) && wx.getStorageSync("assignment") != null) ? wx.getStorageSync("assignment") : null;
  },
  getoptionalData: () => {
    //获取缓存中的寄件备注信息
    return (undefined != typeof (wx.getStorageSync("optional")) && wx.getStorageSync("optional") != null) ? wx.getStorageSync("optional") : null;
  },
  getelseData: () => {
    //获取缓存中的寄件其他选项信息
    return (undefined != typeof (wx.getStorageSync("else")) && wx.getStorageSync("else") != null) ? wx.getStorageSync("else") : null;
  },
  getdisputeData: () => {
    //获取缓存中寄件地址列表中的默认地址id
    return (undefined != typeof (wx.getStorageSync("dispute")) && wx.getStorageSync("dispute") != null) ? wx.getStorageSync("dispute") : null;
  },
  getdisputeNoData: () => {
    //获取缓存中收货地址列表中的默认地址id
    return (undefined != typeof (wx.getStorageSync("disputeNo")) && wx.getStorageSync("disputeNo") != null) ? wx.getStorageSync("disputeNo") : null;
  },
  getregionCodeData: () => {
    //获取缓存中立即寄件的寄件地址areaCode
    return (undefined != typeof (wx.getStorageSync("regionCode")) && wx.getStorageSync("regionCode") != null) ? wx.getStorageSync("regionCode") : null;
  },
  //星星end
}
module.exports = {
  appUtils: appUtils,
  ajaxUrls: requestUrlList,
  controllerUtil: controllerUtil,
  lrhMethods: lrhMethods
}