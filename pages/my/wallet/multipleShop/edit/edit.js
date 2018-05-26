// pages/my/wallet/multipleShop/edit/edit.js
var iconsUtils = require("../../../../../image/icons.js");
var walletUtil = require("../../../../../utils/walletUtil.js");
var qiniuUploader = require("../../../../../utils/qiniuUploader");
var appUtil = require('../../../../../utils/appUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isstorephoto: false,
    storeNameVal: '',
    userNameVal: '',
    setPhoneVal: '',
    setAdressDetailVal: '',
    tempFilePaths: '',
    setincomeAcount: '',
    setincomeRealName: '',
    isMoreClick: false,//防止多次点击
  },
  // 公共提示语
  getPromptPark: function (promptTit) {
    var that = this;
    that.setData({ isPrompt: !that.data.isPrompt, promptTit: promptTit })
    setTimeout(function () {
      that.setData({ isPrompt: !that.data.isPrompt })
    }, 1500)
  },
  // 弹出选择头像悬窗
  takeStorePhoto: function () {
    let that = this;
    that.setData({
      isstorephoto: true
    })
  },
  // 关闭选择头像悬窗
  bindClosePark: function () {
    let that = this;
    that.setData({
      isstorephoto: false
    })
  },
  // 输入店铺名称
  setStoreName: function (e) {
    let that = this;
    console.info(e.detail.value)
    that.setData({
      storeNameVal: e.detail.value
    })
  },
  // 输入联系人姓名
  setUserName: function (e) {
    let that = this;
    console.info(e.detail.value)
    that.setData({
      userNameVal: e.detail.value
    })
  },
  // 输入联系方式
  setPhone: function (e) {
    let that = this;
    console.info(e.detail.value)
    that.setData({
      setPhoneVal: e.detail.value
    })
  },
  // 输入详细地址
  setAdressDetail: function (e) {
    let that = this;
    console.info(e.detail.value)
    that.setData({
      setAdressDetailVal: e.detail.value
    })
  },
  // 输入支付宝邮箱/手机号码
  setincomeAcount: function (e) {
    let that = this;
    let storeData = that.data.storeData;
    console.info(e.detail.value)
    // storeData.incomeAcount = e.detail.value;
    that.setData({
      // storeData: storeData,
      setincomeAcount: e.detail.value
    })
  },
  // 输入支付宝真实姓名
  setincomeRealName: function (e) {
    let that = this;
    let storeData = that.data.storeData;
    // storeData.incomeRealName = e.detail.value;
    console.info(e.detail.value)
    that.setData({
      // storeData: storeData,
      setincomeRealName: e.detail.value
    })
  },
  // 选择地址
  getAdress: function () {
    this.setData({
      isMoreClick: true
    })
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        // success  
        console.info(res)
        var getAddressVal = res;
        var address = res.address;
        that.setData({
          getAddressVal: getAddressVal,
          AddressVal: getAddressVal.address,
          isMoreClick: false,
        })
      },
      fail: function () {
        // fail  
        that.setData({
          isMoreClick: false,
        })
      },
      complete: function () {
        // complete  
      }
    })
  },
  // 拍照
  getPhotograph: function (e) {
    let that = this;
    let num = e.currentTarget.id;//1为拍照，2为相册获取
    console.info("e", e.currentTarget.id)
    if (num == 1) {
      // 1为拍照
      var sourceType = 'camera';
    } else {
      var sourceType = 'album';
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [sourceType], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.info("tempFilePaths", tempFilePaths)
        // 上传到七牛 begin
        var filePath = tempFilePaths[0];
        var imgName = JSON.stringify(filePath).substr(60, 35);
        var uploadToken = appUtil.appUtils.getBlackUser().commonData.shopncUploadToken
        qiniuUploader.upload(filePath, function (res) {
          that.setData({
            'imageURL': res.imageURL,
          });
          var images = res.imageURL;
          console.info("images", images)
          that.setData({
            tempFilePaths: images
          })
          that.bindClosePark();
        }, function (error) {
          console.log('error: ' + error);
          wx.showLoading({
            title: '添加失败',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1500)
        }, {
            region: 'ECN',
            domain: 'https://qnimg.xiaoguikuaipao.com', // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
            key: imgName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
            uptoken: uploadToken, // 由其他程序生成七牛 uptoken
          })
        // 上传到七牛 end
      }
    })
  },
  // 确认按钮
  getNewBranchStore: function (e) {
    let that = this;
    let storeNameVal = that.data.storeNameVal;
    let userNameVal = that.data.userNameVal;
    let setPhoneVal = that.data.setPhoneVal;
    let addressVal = that.data.AddressVal;
    let setAdressDetailVal = that.data.setAdressDetailVal;
    let tempFilePaths = that.data.tempFilePaths;
    let getAddressVal = that.data.getAddressVal;
    var incomeAcount = that.data.setincomeAcount;//支付宝邮箱/手机号码
    let incomeRealName = that.data.setincomeRealName;//真实姓名
    var myregphone = /^[1][0-9]{10}$/;
    if (storeNameVal == '') {
      that.getPromptPark('请输入店铺名称');
      return
    }
    if (userNameVal == '') {
      that.getPromptPark('请输入联系人！');
      return
    }
    if (setPhoneVal == '') {
      that.getPromptPark('请输入联系方式！');
      return false;
    } else if (!myregphone.test(setPhoneVal)) {
      that.getPromptPark('请输入正确的联系方式！');
      return false;
    }
    if (addressVal == '' || addressVal == null) {
      that.getPromptPark('请选择地址！');
      return
    }
    if (tempFilePaths == '' || tempFilePaths == null) {
      that.getPromptPark('请选择头像！');
      return
    }
    // 判断邮箱
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (incomeAcount == '' || incomeAcount == null) {
      that.getPromptPark('实时到账账号不能为空！');
      return false;
    } else {
      // 判断是手机号还是邮箱
      if (incomeAcount.indexOf('@') == -1) {
        // 是手机
        if (!myregphone.test(incomeAcount)) {
          that.getPromptPark('请输入有效的支付宝手机号！');
          return false;
        }
      } else {
        if (!myreg.test(incomeAcount)) {
          that.getPromptPark('请输入有效的支付宝E_mail！');
          return false;
        }
      }
    }
    if (incomeRealName == '' || incomeRealName == null) {
      that.getPromptPark('真实姓名不能为空');
      return
    }
    that.setData({
      isMoreClick: true
    })
    console.info("e.currentTarget.id", e.currentTarget.id)
    var childData = {}
    childData.nickname = storeNameVal;
    childData.contactName = userNameVal;
    childData.contactNumber = setPhoneVal
    childData.addr = addressVal;
    childData.roomNo = setAdressDetailVal;
    childData.avatar = tempFilePaths;
    childData.incomeAcount = incomeAcount
    childData.incomeRealName = incomeRealName;
    console.info(getAddressVal);
    if (e.currentTarget.id == 1) {
      // 新增分店
      childData.loc = [getAddressVal.latitude, getAddressVal.longitude];
      that.addChildStore(childData);
    } else {
      // 编辑分店
      childData.profileOnePayId = that.data.profileId;
      childData.loc = getAddressVal == '' || getAddressVal == null ? that.data.loc : [getAddressVal.latitude, getAddressVal.longitude];
      that.updateChildStore(childData);
    }
  },
  // 调用添加分店接口
  addChildStore: function (childData) {
    let that = this;
    walletUtil.controllerUtil.getnewbranchStore(
      childData,
      function (sucData) {
        if (sucData.data.succeeded) {
          wx.showToast({
            title: '添加分店成功',
          })
          that.setData({
            indexs: 3,
            isMoreClick: false,
          })
        } else {
          if (sucData.data.error.descript == '系统繁忙，请稍候' || sucData.data.message.descript == '系统繁忙，请稍候') {
            that.getPromptPark('小龟正在路上，请稍后！');
          } else {
            that.getPromptPark(sucData.data.message.descript)
          }
          that.setData({
            isMoreClick: false,
          })

        }
      }, function (failData) {
        that.setData({
          isMoreClick: false,
        })
      }, function (comData) { })
  },
  // 调用修改店铺接口
  updateChildStore: function (childData) {
    let that = this;
    walletUtil.controllerUtil.getupdateEditStore(childData,
      function (sucData) {
        console.info("修改", sucData)
        if (sucData.data.succeeded) {
          that.getPromptPark('修改成功')
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
          that.setData({
            isMoreClick: false,
          })
        } else {
          if (sucData.data.error.descript == '系统繁忙，请稍候' || sucData.data.message.descript == '系统繁忙，请稍候') {
            that.getPromptPark('小龟正在路上，请稍后！');
          } else {
            that.getPromptPark(sucData.data.message.descript)
          }

          that.setData({
            isMoreClick: false,
          })
        }

      }, function (failData) {
        that.setData({
          isMoreClick: false,
        })
      }, function (comData) { })

  },
  // 创建分店的时候调用获取填充的信息
  getstoreMain: function () {
    let that = this;
    walletUtil.controllerUtil.getstoreMain({},
      function (sucData) {
        console.info(sucData.data)
        if (sucData.data.succeeded) {
          that.setData({
            storeData: sucData.data.data,
            setincomeAcount: sucData.data.data.incomeAcount,
            setincomeRealName: sucData.data.data.incomeRealName
          })
        } else {
          that.getPromptPark(sucData.data.message.descript)
        }
      }, function (failData) { }, function (comData) {
      })
  },
  // 新增成功之后返回分店列表
  returnList: function () {
    wx.navigateBack({
      delta: 1
    })
    // wx.redirectTo({
    //   url: '/pages/my/wallet/multipleShop/list/list',
    // })
  },
  // ------------------------------
  // 编辑分店--获取店铺详情
  getUpdateData: function (profileId) {

    let that = this;
    walletUtil.controllerUtil.getStoreDetail(profileId, {},
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
            loc: editData.loc,
          })
        } else {
          if (sucData.data.error.descript == '系统繁忙，请稍候' || sucData.data.message.descript == '系统繁忙，请稍候') {
            that.getPromptPark('小龟正在路上，请稍后！');
          } else {
            that.getPromptPark(sucData.data.message.descript)
          }
        }
      }, function (faildata) {
      }, function (comData) { })
  },
  // getUpdateBranchStore
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(iconsUtils.getIcons().baseIcons)
    wx.setStorageSync("addressVal", '');//初始化地址
    this.setData({
      icon_img: iconsUtils.getIcons().baseIcons,
      indexs: options.indexs,//1为新增分店，2为编辑分店,3新增分店成功
      AddressVal: ''
    })
    console.info("options", options.profileId)
    if (options.profileId == '' || options.profileId == null) {
      // 新增分店
      this.getstoreMain();
    } else {
      // 编辑分店
      this.getUpdateData(options.profileId);
    }
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
    wx.hideLoading()
    if (this.data.indexs == 2) {
      wx.setNavigationBarTitle({
        title: '编辑分店',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增分店',
      })
    }
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