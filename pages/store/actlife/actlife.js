var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    goodsInfo: -1,
    q: -1,
    storeInfo:-1,
  },
  checkProduct: function (e) {
    var goodId = e.currentTarget.id;
    if (this.data.q != -1) {//扫码进来的
      wx.navigateTo({
        url: '/pages/detail/goodsdetail?goodId=' + goodId,
      })
    } else {
      wx.redirectTo({
        url: '/pages/detail/goodsdetail?goodId=' + goodId,
      })
    }

  },
  myReplaceAll: function (str, mode, replace) {
    while (str.indexOf(mode) != -1) {
      str = str.replace(mode, replace);
    }

    while (str.indexOf('imgmy') != -1) {
      str = str.replace('imgmy', 'img');
    }
    return str;
  },
  checkTheme: function (special_id) {
    //getSingleActLife
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getDissertation, //
      data: {
        special_id: special_id,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log(special_id + "得到专题返回" + appUtil.ajaxUrls().getDissertation);
        console.log(res)
        var theme = res.data.data
        wx.hideLoading();
        if (res.data.message.type == "success") {
          var singleAct = theme;
          if (singleAct.goodsList != undefined) {
            var goodsInfo = singleAct.goodsList;
            that.setData({ goodsInfo: goodsInfo });
          }
          var nodes = singleAct.special_body;
          if (nodes == null) {

          } else {
            nodes = that.myReplaceAll(nodes, "<img ", "<imgmy style=\"width:100%;\" mode=\"widthFix\" ");
          }

          that.setData({ nodes: nodes });
        }

      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  checkActLife: function (geval_id) {
    //getSingleActLife
    console.log("查看专题");
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().getSingleActLife, //
      data: {
        geval_id: geval_id,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到单挑动态生活返回");
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          var singleAct = res.data.data;
          console.log(singleAct);
          var goodsInfo = singleAct.goodsInfo;
          that.setData({ goodsInfo: goodsInfo });
          if (singleAct.geval_body!=null){
            var nodes = singleAct.geval_body;
            nodes = that.myReplaceAll(nodes, "<img ", "<imgmy style=\"width:100%;\" mode=\"widthFix\" ");
            that.setData({ nodes: nodes });
          }
         
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  getAndSetLogoAndName: function (storeId) {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getLogoAndName + storeId, //
      data: {

      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到logo和店铺名字");
        console.log(res)
        wx.hideLoading();
        if (res.data.message.type == "success") {
          var storeInfo = res.data.data;
          storeInfo.storeId = storeId;
          that.setData({ storeInfo: storeInfo });
        }
      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
        wx.hideLoading();
      }
    })
  },
  checkTheme2: function (special_id) {
    //getSingleActLife
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().getDissertation, //
      data: {
        special_id: special_id,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log(special_id + "得到专题返回" + appUtil.ajaxUrls().getDissertation);
        console.log(res)

        if (res.data.message.type == "success") {
          var theme = res.data.data
          var singleAct = theme;
          var nodes = singleAct.special_body;
          nodes = that.myReplaceAll(nodes, "<img ", "<imgmy style=\"width:100%;\" mode=\"widthFix\" ");
          that.setData({ nodes: nodes });
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
  checkActLife2: function (id) {
    console.log("查看专题");
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().getSingleActLife, //
      data: {
        geval_id: id,
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到单挑动态生活返回");
        console.log(res)
        if (res.data.message.type == "success") {
          //wx.setStorageSync("singleAct", res.data.data);
          var singleAct = res.data.data;//wx.getStorageSync("singleAct");
          console.log(singleAct);
          var goodsInfo = singleAct.goodsInfo;
          that.setData({ goodsInfo: goodsInfo });
          if (singleAct.geval_body != null) {
            var nodes = singleAct.geval_body;
            nodes = that.myReplaceAll(nodes, "<img ", "<imgmy style=\"width:100%;\" mode=\"widthFix\" ");
            that.setData({ nodes: nodes });
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
  checkStore: function (e) {
    var jumpType = e.currentTarget.dataset.jumptype;
    var storeId = e.currentTarget.id;
    console.log(jumpType);
    if (this.data.q != -1) {//扫码进来的
      if (jumpType == 2) {
        wx.navigateTo({
          url: '/pages/store/index?storeId=' + storeId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/store/glspecial/glspecial?storeId=' + storeId,
        })
      }
    } else {//店铺里面跳过来的
      if (jumpType == 2) {
        wx.navigateTo({
          url: '/pages/store/index?storeId=' + storeId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/store/glspecial/glspecial?storeId=' + storeId,
        })
      }
    }

  },
  onLoad: function (options) {
    //options.q = "https://api.xiaoguikuaipao.com/activity/5031?geval_id=32532";
    //-options.q = "https://api.xiaoguikuaipao.com/activity/5031?special_id=43";
    //options.q = "https://dev-api.xiaoguikuaipao.com/activity/5011?special_id=45";
    //options.q = "https://api.xiaoguikuaipao.com/activity/5011?geval_id=32573";
    if (options.q != undefined) {
      this.setData({ q: options.q });
      var q = decodeURIComponent(options.q);//对二维码进来的链接进行转码
      var ganIndex = q.lastIndexOf("/");//
      var wenIndex = q.lastIndexOf("?");//
      var denIndex = q.lastIndexOf("=");
      var storeId = q.substring(ganIndex + 1, wenIndex);
      var flagStr = q.substring(wenIndex + 1, denIndex);
      var actId = q.substring(denIndex + 1, q.length);
      console.log(storeId + "---" + flagStr + "---" + actId);
      this.getAndSetLogoAndName(storeId);
      if (flagStr == "special_id") {
        this.checkTheme(actId);
      } else if (flagStr == "geval_id") {
        this.checkActLife(actId);
      }
    } else {
      var storeInfoStr = options.storeInfo;
      var storeInfo = JSON.parse(storeInfoStr);
      this.setData({ storeInfo: storeInfo });
      if (storeInfo.theme != undefined) {
        this.setData({ special_id: options.special_id });
        this.checkTheme2(options.special_id);
      } else {
        this.setData({ geval_id: options.geval_id });
        this.checkActLife2(options.geval_id);
      }
    }
  },

  onShareAppMessage: function () {
    if (this.data.q != -1) {
      var storeInfo = this.data.storeInfo;
      var q = this.data.q;
      return {
        title: '' + storeInfo.store_name,
        path: 'pages/store/actlife/actlife?q=' + q
      }
    } else {
      var storeInfo = this.data.storeInfo;
      if (storeInfo.theme != undefined) {
        var special_id = this.data.special_id;
        return {
          title: '' + storeInfo.store_name,
          path: 'pages/store/actlife/actlife?storeInfo=' + JSON.stringify(storeInfo) + '&special_id=' + special_id,
        }
      } else {
        var geval_id = this.data.geval_id;
        return {
          title: '' + storeInfo.store_name,
          path: 'pages/store/actlife/actlife?storeInfo=' + JSON.stringify(storeInfo) + '&geval_id=' + geval_id,
        }
      }
    }

  },
  onReady: function () {

  },
  onShow: function () {

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
