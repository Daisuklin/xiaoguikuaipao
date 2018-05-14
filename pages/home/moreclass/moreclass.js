var appUtil = require('../../../utils/appUtil.js');
Page({
  data: {
    checkAllHiden: false,
    animationData: {},
    arrstmp: [1, 2, 4, 5,5, 5, 6], 
    // icon: {
    //   ms: "../../../image/index/ms.png",
    //   cs: "../../../image/index/cs.png",
    //   mz: "../../../image/index/mz.png",
    //   bh: "../../../image/index/bh.png",
    //   fs: "../../../image/index/fs.png",
    //   my: "../../../image/index/my.png",
    //   jd: "../../../image/index/jd.png",
    //   hc: "../../../image/index/hc.png",
    //   jj: "../../../image/index/jj.png",
    //   fl: "../../../image/index/fl.png",
    // },
    targetId:0,
  },
  //查询分类里面的产品
  checkClassGoods: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/home/search/resultforgood/resultforgood?classId=' + id,
    })
  },
  //选择二级分类
  chooseGoodClass:function(e){
    console.log(e);
    var id = e.currentTarget.id;

    var len = id.length;
    var classId = id.substring(1,len);
    this.setData({ classId: classId, targetId:id, checkAllHiden: false});
    this.getClassByBigClassId();
  },
  //让灰蒙层关闭显示
  setMaskHidden:function(){
    this.setData({ checkAllHiden:false});
  },
  moreClass: function () {
    var checkAllHiden = this.data.checkAllHiden;
    this.setData({ checkAllHiden: !checkAllHiden });
  },
  transDataFromServer: function (data) {
    console.log(data);
    
  },
  //获取三级分类标签
  getClassByBigClassId: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().getClassByBigClassId + "/"+that.data.classId,
      //url: "http://112.74.28.99:8080/api/v1/getAllClass/" + that.data.classId,
      data: {
        
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'api': 'web',
      },
      success: function (res) {
        console.log("得到二级分类内容");
        if (res.data.message.type == "success") {
          that.setData({ classes: res.data.data});
          that.transDataFromServer(res.data.data);
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
  ///处理从服务器返回的数据
  setAllClassStyle2Data: function (goodsClassList){
    var labLen = goodsClassList.length;
    var arrsSize = Math.ceil(labLen / 5);
    console.log("数组大小：" + arrsSize);
    var arrs = [];//二位数组，存放标签，里面每个一位数组大小为5
    if (arrsSize != 0) {
      for (var i = 0; i < goodsClassList.length; i = i + 5) {
        var arr = [];//一行标签
        for (var j = 0; j < 5; j++) {//一行标签放五个标签
          arr.push(goodsClassList[i + j]);
        }
        arrs.push(arr);
      }
    }
    this.setData({ arrs: arrs });
  },
  onLoad: function (options) {
    //var classId = "3638";
    var allClass = wx.getStorageSync("allClass");
    this.setData({ allClass: allClass });
    if (options.classId==undefined){
      this.setData({ classId: allClass[0].gc_id });
    }else{
      this.setData({ classId: options.classId});
    }
    this.getClassByBigClassId();
    this.setAllClassStyle2Data(allClass);
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