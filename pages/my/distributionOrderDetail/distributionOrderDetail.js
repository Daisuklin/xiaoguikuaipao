// pages/my/distributionOrderDetail/distributionOrderDetail.js
var appUtil = require('../../../utils/appUtil.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '我不想寄件了', value: '我不想寄件了' },
      { name: '信息填写错误,重新下单', value: '信息填写错误,重新下单' },
      { name: '快递员很久才上门', value: '快递员很久才上门' },
      { name: '付款遇到问题', value: '付款遇到问题' },
      { name: '很久没人接单', value: '很久没人接单' },
      { name: '其他原因', value: '其他原因' },
    ],
    info:"",
    noteNowLen: 0,//当前评论字数
    noteMaxLen:250,//评论最大字数
    leveId:0,//等级
    userSelectVal:"",//取消原因
    isShowPingjia: false,//是否点击显示评价
    isShowCommodityStr:false,//是否点击查看订单详情
    isShowClearOrderBtn:false,
    showClearOrderSelect:false,//点击取消订单中的取消按钮
    showPingjiaBtn: false,//点击显示评价按钮
  
    pageInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  radioChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      userSelectVal: e.detail.value
    })
  },
  onLoad: function (options) {
      var  thisPage=this;
      wx.showToast({
        icon: "loading", title: "加载中...", mask: true,
      })
      var commentS={
        orderId: options.id
      }
      appUtil.controllerUtil.getUserCommentState(commentS,function(res){
        if (res.data.succeeded) {
          thisPage.setData({ showPingjiaBtn: !res.data.data, isShowPingjia: !res.data.data })
        }
      },function(res){

      })
      appUtil.controllerUtil.DistributionOrderDetail(options.id,function(res){
        //console.info(res)
        if (res.data.succeeded){
          var pageinfo= res.data.data;
          pageinfo.commodityStr = ""; //订单内容字符串
          pageinfo.commodityCount = 0;//订单内容个数
          pageinfo.createdAt = util.formatTime(new Date(pageinfo.createdAt));
          var year = (pageinfo.signedAt == null ? "" : new Date(pageinfo.signedAt).getFullYear() + "".substr(2, 3));
          if(year!=""){
            year = year.substr(2, 3);
          }
         
          var month = (pageinfo.signedAt == null ? "" : new Date(pageinfo.signedAt).getMonth() + 1)
          var day = (pageinfo.signedAt == null ? "" :new Date(pageinfo.signedAt).getDate())
          var hour = (pageinfo.signedAt == null ? "" : new Date(pageinfo.signedAt).getHours())
          var minute = (pageinfo.signedAt == null ? "" : new Date(pageinfo.signedAt).getMinutes())
          var second = (pageinfo.signedAt == null ? "" : new Date(pageinfo.signedAt).getSeconds())
          pageinfo.signedAt = year + "-" + month + "-" + day + "  " + hour + ":" + minute;
          //订单内容
          pageinfo.commodityList.forEach(function(commodity){
            pageinfo.commodityCount += Number(commodity.count)
            pageinfo.commodityStr+= commodity.name+","
          })
          if (pageinfo.commodityStr != "") {
            pageinfo.commodityStr = pageinfo.commodityStr.substr(0, pageinfo.commodityStr.length - 1)
          }  

          //支付类型
          pageinfo.payWay = (
            "wechat" == pageinfo.payWay ? "微信支付" : (
              "alipay" == pageinfo.payWay ? "支付宝支付" : (
                "payBalance" == pageinfo.payWay ? "支付余额" : "小龟支付"
                )
              )
          )
          //状态判断
          pageinfo.status.forEach(function (statu) {
            if (pageinfo.state == statu.state) {
              pageinfo.itemState = statu.name;
            }
          })

          pageinfo.memo = (pageinfo.memo == null ? "" : pageinfo.memo)
          pageinfo.weatherCharge = (pageinfo.weatherCharge == null ? "0.0" : pageinfo.weatherCharge)
          pageinfo.festivalCharge = (pageinfo.festivalCharge == null ? "0.0" : pageinfo.festivalCharge)
          var　loginUser=appUtil.appUtils.getBlackUser()
          thisPage.setData({
            isShowClearOrderBtn: (pageinfo.sendUserId == loginUser.userData.id),
            pageInfo: pageinfo
          })  
        }else{
          wx.showToast({
            icon: "loading", title: "无法查询该订单！", mask: true,
          })
        }
      },function(res){

      },function(res){
         wx.hideToast() 
      })
  },
  showCommodityStr:function(){
    this.setData({
      isShowCommodityStr : !this.data.isShowCommodityStr,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  callUserNum:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  },
  cancelOrder:function (e) {
    console.info(e.currentTarget.id);
    var thisPage = this;
    wx.showToast({
      icon: "loading", title: "提交中...", mask: true,
    })
    if (thisPage.data.userSelectVal == "" || thisPage.data.userSelectVal ==null){
      wx.showToast({
        icon: "loading", title: "请选择原因", mask: true,
      })
      return false;
    }
    appUtil.controllerUtil.CancelOrderDetail(e.currentTarget.id,{
      prompting: thisPage.data.userSelectVal
    }, function (res) {

      if (res.data.succeeded) {
        wx.showToast({
          icon: "loading", title: "取消成功！", mask: true,
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          icon: "loading", title: "取消失败！", mask: true,
        })
      }
    }, function (res) {
      console.info(res)
    })
  },
  closeClearOrderSelect:function(){
    this.setData({
      showClearOrderSelect: !this.data.showClearOrderSelect,
     
    })
  },
  pingjiaBtn:function(){
    this.setData({
      isShowPingjia: !this.data.isShowPingjia,

    })
  },
  closePingjiaBg: function () {
    this.setData({
      leveId:0,
      isShowPingjia: !this.data.isShowPingjia,

    })
  },
  changeLeve:function(e){
    this.setData({
      leveId: Number(e.currentTarget.dataset.leve),
    })
  }
  ,//字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value, len = parseInt(value.length);
    if (len > that.data.noteMaxLen) return;
    that.setData({ info: value, noteNowLen: len })
  },
 
  sendPingLun:function(){
    var datas = {
      "description": this.data.info,
      "orderId": this.data.pageInfo.id,
      "score": this.data.leveId,
      "targetId": this.data.pageInfo.acceptUser.id,
      "targetType": "expressCourier"
    }
    appUtil.controllerUtil.setUserComments(datas,function(res){
      if (res.data.succeeded) {
        wx.showToast({
           icon: "loading"
          ,title: "评价成功！"
          , mask: true
          , duration: 2000
          , complete:function(){
            wx.navigateBack()
          }
        })
        
      }
    },function(res){

    },function(res){

    })
  }

})