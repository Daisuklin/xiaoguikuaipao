
Page({
  data: {

  },
  onLoad: function (options) {
    var storeDataStr = options.storeData;
    var storeData = JSON.parse(storeDataStr);
    var storeDataTime =( storeData.run_timeStr != "" && storeData.run_timeStr!=null)?JSON.parse(storeData.run_timeStr):"";
    if (storeDataTime!=""&&storeDataTime.length > 0){
      storeData.run_timeStr =  storeDataTime[0].beginTime+"--"+storeDataTime[0].endTime;
    }
    
    this.setData({ storeData: storeData });
    this.setData({ len: storeData.store_address.length});
    // if (storeData.run_timeStr != undefined && storeData.run_timeStr != "") {
    //   var run_timeStr_obj = JSON.parse(storeData.run_timeStr);
    //   storeData.time = run_timeStr_obj;
    // }
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
  callPhone:function(e){
    if (e.currentTarget.dataset.phone != "" && typeof (e.currentTarget.dataset.phone)!='undefined'){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone,
      })
    }
  }
})