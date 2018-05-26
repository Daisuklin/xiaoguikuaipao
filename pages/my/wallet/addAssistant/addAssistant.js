// pages/my/wallet/addAssistant/addAssistant.js
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
var publicEnvironment = require("../../../../utils/publicEnvironment.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarks: false,
    remarksitems: '',
    remarkValue: '',
    showDelect: false
  },
  // 刷新列表
  getRefresh: function () {
    let that = this;
    that.getAddAssistants();
  },
  // 添加备注
  addremarks: function (e) {
    let that = this;
    let items = e.currentTarget.dataset.items;
    that.setData({
      remarks: true,
      remarksitems: items,//备注所需的数据
    })
  },
  //获取输入数据
  inputvlaue: function (e) {
    console.info(e.detail.value)
    this.setData({
      remarkValue: e.detail.value
    })
  },
  // 取消备注
  closeRemarks: function () {
    let that = this;
    that.setData({
      remarks: false
    })
  },
  // 确认备注
  confirmRemarks: function () {
    let that = this;
    let remarksitems = that.data.remarksitems;//备注所需的数据
    let remarkValues = that.data.remarkValue;//备注名称
    if (remarkValues == '') {
      wx.showToast({
        title: '备注不能为空',
        icon: 'loading',
        duration: 2000
      })
      return
    }
    walletUtil.controllerUtil.getemployeeUpdate({
      employeeId: remarksitems.id,
      remarkName: remarkValues
    },
      function (sucData) {
        if (sucData.data.succeeded) {
          that.getAddAssistants();
        }
      }, function (failData) {
      }, function (comData) {
      })
    that.setData({
      remarks: false
    })
  },
  // 获取店铺店员列表数据
  getAddAssistants: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    walletUtil.controllerUtil.getAddAssistants({},
      function (sucData) {
        if (sucData.data.succeeded) {
          that.setData({
            adssistantsList: sucData.data.data
          })
          wx.hideLoading()
        }
      }, function (failData) {
      }, function (comData) {
      })
  },
  //添加店员--确认添加
  getemployeeAdd: function (e) {
    let that = this;
    var employeeId = e.currentTarget.id;
    // var employeeId = 'f68c5359850c4e17bf181cad607719c6'
    console.info("e", e)
    walletUtil.controllerUtil.getemployeeAdd(employeeId, {},
      function (sucData) {
        if (sucData.data.succeeded) {
          that.getAddAssistants();
        }
      }, function (failData) {
      }, function (comData) {
      })
  },
  // 删除店员
  getDelectAssistant: function (e) {
    let that = this;
    var employeeId = e.currentTarget.id;
    // 弹出删除层
    that.setData({
      employeeId: employeeId,
      showDelect: true,
    })
  },
  //删除店员--确认删除
  getemployeeDelect: function (e) {
    let that = this;
    var employeeId = that.data.employeeId;
    walletUtil.controllerUtil.getemployeeDel(employeeId, {},
      function (sucData) {
        if (sucData.data.succeeded) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            // adssistantsList: sucData.data.data,
            showDelect: false,
          })
          that.getAddAssistants();//重新刷新数据
        }
      }, function (failData) {
        wx.showToast({
          title: '删除失败',
          icon: 'none',
          duration: 2000
        })
      }, function (comData) {
      })
  },
  //删除店员--取消删除
  getemployeecancel: function () {
    let that = this;
    that.setData({
      showDelect: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // icon 图标
    console.info("图标", iconsUtils.getIcons().walletIcons);
    this.setData({ icons: iconsUtils.getIcons().walletIcons });
    let getuserMessage = walletUtil.appUtils.getUserData();
    let getUserStoreData = getuserMessage.userData;//获取用户店铺信息
    let courierData = getuserMessage.userData;
    let types = 'employee';
    let profileId = courierData.id;//获取user的profileId
    console.info("getuserMessage", getuserMessage, "profileId", profileId)
    // let profileId = 'f68c5359850c4e17bf181cad607719c6'
    //二维码链接
    let url = walletUtil.requestUrlList().logisticsUrl + '/onePay/qrcode/' + types + '/' + profileId + '?profileOnePayId=' + walletUtil.appUtils.getShopIdData()
    if (!publicEnvironment.isTest) {
      url = url + "&env=dev";
    }
    var that =this;
    walletUtil.controllerUtil.getStoreDetail(walletUtil.appUtils.getShopIdData(), {},
      function (sucData) {
        if (sucData.data.succeeded) {
          console.info(sucData.data)
          let editData = sucData.data.data;
          let storeNameVal = editData.nickname;
          let userNameVal = editData.contactName;
          let setPhoneVal = editData.contactNumber;
          let addressVal = editData.addr;
          let setAdressDetailVal = editData.roomNo;
          let tempFilePaths = editData.avatar;
          let incomeAcount = editData.incomeAcount;//支付宝邮箱/手机号码
          let incomeRealName = editData.incomeRealName;//真实姓名
          that.setData({
            shopDetail: {
              editData: editData,
              storeNameVal: storeNameVal,
              userNameVal: userNameVal,
              setPhoneVal: setPhoneVal,
              AddressVal: addressVal,
              setAdressDetailVal: setAdressDetailVal,
              tempFilePaths: tempFilePaths,
              setincomeAcount: incomeAcount,
              setincomeRealName: incomeRealName,
              profileId: profileId,
              loc: editData.loc
            }})
        } else {
          that.getPromptPark(sucData.data.message.descript)
        }


      }, function (faildata) { }, function (comData) { })


    this.getAddAssistants();
    this.setData({
      codeImg: url,
      getUserStoreData: getUserStoreData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})