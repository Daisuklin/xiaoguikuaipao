var amapFile = require('../../../utils/amap-wx.js');
Page({
  data: {
    times:1,
    opacity:1,
  },
  transFromServer:function(data){
    var poiTmp = data.tips;
    var poi = [];
    for(var i in poiTmp){
      if (poiTmp[i].location.length!=0){
        poi.push(poiTmp[i]);
      }
    }
    this.setData({poi:poi});
  },
  changeImagState:function(){
    var that = this;
    
    setInterval(function () {
      var times = that.data.times;
      if (times%2==1){
        that.setData({opacity:0.6});
      }else{
        that.setData({ opacity: 1 });
      }
      that.setData({times:times+1});
    }, 300);
  },
  setAtNowAddr:function(){
    //高德地图key
    this.changeImagState();
    var myAmapFun = new amapFile.AMapWX({
      key: 'd0063cd5d8e04b14dfe98eae69dc9617'
    });
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        console.log("获取的位置信息1");
        console.log(data);   
        // var areaCode = "440114";
        // var latitude = "23.12911";
        // var longitude = "113.264385";
        var areaCode = data[0].regeocodeData.addressComponent.adcode;
        var addr = {
          location: data["0"].longitude + "," + data["0"].latitude,
          name:data["0"].desc,
          adcode:data[0].regeocodeData.addressComponent.adcode
        };
        wx.setStorageSync("addrLRH", addr);
        wx.navigateBack({
          delta: 1,
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
  searchAddr: function (e) {
    var key = 'd0063cd5d8e04b14dfe98eae69dc9617';
    var keywords = e.detail.value;
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: "",
      success: function (data) {
        console.log(data);
        that.transFromServer(data);
      }
    })
  },
  checkAddr: function (e) {
    console.log(e);
    var addr = e.currentTarget.dataset.my;
    wx.setStorageSync("addrLRH", addr);
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function (options) {
    var poi = wx.getStorageSync("poi");
    this.setData({ poi: poi });
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
