var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    tags: [],
    value:null
  },
  setKeyWord:function(e){
    var value = e.currentTarget.id;
    this.setData({value:value});
    wx.navigateTo({
      url: './result/result?keyword=' + value,
    })
  },
  clearHistory: function () {
    wx.setStorageSync("searchHistory", []);
    this.setData({history:[]});
  },
  setKeyWords:function(e){
    var value = e.detail.value;
    this.setData({value:value});
  },
  search: function () {
    var value = this.data.value;
    console.log("搜索词："+value);
    if (value == "" || value == null){
      wx.showToast({
        title: '请输入关键词',
        duration:1000,
        icon:'loading'
      })
      return;
    }
    var history = wx.getStorageSync("searchHistory");
    if(history==""){
      history = [value];
      wx.setStorageSync("searchHistory", history);
    }else{
      var flag = false;
      for(var i in history){
        if(history[i]==value){
          flag = true;
          break;
        }
      }
      if(!flag){
        history.push(value);
        wx.setStorageSync("searchHistory", history);
      }
    }

    wx.navigateTo({
      url: './result/result?keyword=' + value,
    })
  },
  getHotWords: function () {
    var that = this;
    wx.request({
      url: appUtil.ajaxUrls().getHotWords,
      //url:"https://dev-api.xiaoguikuaipao.com/api/v1/getShopncKeyWordHotFlag",
      data: {
        
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("获取热门搜索关键词返回" + appUtil.ajaxUrls().getHotWords);
        console.log(res.data.data)
        if (res.data.message.type == "success") {
          that.setData({ tags:res.data.data});
          
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("获取热门搜索关键词返回" + appUtil.ajaxUrls().getHotWords);
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  onLoad: function (options) {
    
  },
  
  onReady: function () {

  },
  onShow: function () {
    var history = wx.getStorageSync("searchHistory");
    this.setData({ history: history });
    this.getHotWords();
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