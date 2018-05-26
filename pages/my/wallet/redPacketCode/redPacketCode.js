// pages/my/wallet/redPacketCode/redPacketCode.js
var iconsUtils = require("../../../../image/icons.js");
var walletUtil = require("../../../../utils/walletUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    failImg: "https://qnimg.xiaoguikuaipao.com/mXfQ4Bob12Eife88f4be379377e52d9e244",//保存失败图标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getredPacketCode();
    // var imgbg = "https://qnimg.xiaoguikuaipao.com/eudsGySxF4FS805628c88b90089de68e890";//canvas 背景图
    // var imgbg = "https://qnimg.xiaoguikuaipao.com/C2LcUHEfVcW4a23e0488d90e658c72a4417";
    var imgbg = "https://qnimg.xiaoguikuaipao.com/uebQUbxvZ8XT5757f6760f963406bb9c477"
    var qrcode = "https://logistics.xiaoguikuaipao.com/onePay/qrcode/user/1f5721f21eb740b5995d3a03e0b9bf3a";
    this.setData({
      iconImg: iconsUtils.getIcons().baseImages,
      iconbase: iconsUtils.getIcons().baseIcons,
      // imgurl: qrcode,
      imgbg: imgbg
    })
    // this.getSystemMessage(qrcode)
  },
  // 获取本机信息
  getSystemMessage: function (qrcode) {
    var that = this;
    // 获取本机信息
    wx.getSystemInfo({
      success: function (res) {
        console.info("res", res);
        console.info("res.pixelRatio", res.pixelRatio)
        console.info("res.windowWidth", res.windowWidth)
        console.info("res.windowHeight", res.windowHeight)
        let screenWidth = res.screenWidth;//屏幕宽度
        let screenHeight = res.screenHeight;//屏幕高度
        let windowWidth = res.windowWidth;//可使用窗口宽度
        let windowHeight = res.windowHeight;//可使用窗口高度
        let pixelRatio = res.pixelRatio;//设备像素比
        let rpxs = screenWidth / 750;//rpx换算成px的公式是
        that.setData({
          w4: res.windowWidth,
          h4: res.windowHeight,
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          pixelRatio: pixelRatio,
          rpxs: rpxs
        });
      }
    })
    that.isandroidorios();
    that.downloadImg(qrcode);//图片路径转换
  },
  // 判断是安卓还是ios系统
  isandroidorios: function () {
    var that = this;
    var platformsval = '';
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "devtools") {
          // pc
          console.info("机型：", res.platform)
          platformsval = res.platform;
        } else if (res.platform == "ios") {
          console.info("机型：", res.platform)
          platformsval = res.platform;
        } else if (res.platform == "android") {
          console.info("机型：", res.platform)
          platformsval = res.platform;
        }
        that.setData({
          platformsval: platformsval
        })
      }
    })
  },
  //图片路径转换
  downloadImg: function (url) {
    var that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        if (res.statusCode === 200) {
          console.info("下载后的资源", res);
          // 二维码图片地址
          var twoCode = res.tempFilePath;
          wx.downloadFile({
            url: that.data.imgbg,
            success: function (imgbgres) {
              // 背景图片地址
              that.drawCard(twoCode, imgbgres.tempFilePath);
            }
          })
        }
      }
    })
  },
  //画海报
  drawCard: function (imgUrl, bgImg) {
    let that = this;
    let windowWidth = that.data.windowWidth;//可使用窗口宽度
    let windowHeight = that.data.windowHeight;//可使用窗口高度
    let pixelRatio = that.data.pixelRatio; //设备像素比
    let rpxs = that.data.rpxs;//rpx换算成px的比例
    let packerdata = that.data.redpacketData;//接口获取的数据
    console.info("windowWidth", windowWidth, windowHeight, pixelRatio, rpxs)
    //使用wx.createContext获取绘图上下文context  
    var context = wx.createContext()
    var left = (this.data.w4 - 140) / 2;
    var top = (this.data.h4) / 2;
    var name = '新用户专享优惠';//价格上面的标题
    var bigTitle = '新用户专享优惠';
    var secTitle = packerdata.context;//top第二行文字
    console.info("packerdata", packerdata)
    context.stroke();
    context.drawImage(bgImg, 0, 0, this.data.w4, this.data.h4, 0, 0);//背景图
    context.drawImage(imgUrl, left, top, 140, 140);//二维码的位置
    // 绘制区域背景色
    var bgheight = windowHeight * (2.2 / 10);
    context.beginPath()
    context.setLineCap('round');
    context.setStrokeStyle('#BD152D');
    context.setLineWidth(30);
    context.moveTo(windowWidth * (2.5 / 10), bgheight);
    context.lineTo(windowWidth * (7.5 / 10), bgheight);
    context.stroke();
    // 绘制区域背景色 end
    // 表头提示 --新用户专享优惠
    var nameLength = name.length;
    context.setFontSize(18);
    context.setFillStyle("#FFCDA5");
    context.save();
    context.fillText(name, (this.data.w4) / 2 - (nameLength * 18 / 2), bgheight + (14 * rpxs));//必须为（0,0）原点
    // 价格
    var discount = packerdata.discount;
    var price = discount.toString();
    var priceLength = price.length;
    if (price.indexOf('.', 0) != -1) {
      console.info("有小数点")
      var priceleft = windowWidth / 2 - (40 * (priceLength - 1) / 2);
      var pricetextleft = windowWidth / 2 + (35 * (priceLength - 1) / 2);
    } else {
      // 价格是整数
      var priceleft = windowWidth / 2 - (35 * priceLength / 2) - 5;
      var pricetextleft = windowWidth / 2 + (30 * (priceLength) / 2) + 5;
    }
    console.info("price长度", price.length, "priceleft", priceleft)
    context.setFontSize(60);
    context.setFillStyle("#CD1233");
    context.fillText(price, priceleft, (this.data.h4) / 2.8);//价格 必须为（0,0）原点
    // 单位
    var pricetext = '元';
    context.setFontSize(22);
    context.setFillStyle("#CD1233");
    context.fillText(pricetext, pricetextleft, (this.data.h4) / 2.8);//价格 必须为（0,0）原点
    // 提示
    var messages = '打开手机扫一扫领红包';
    context.setFontSize(12);
    context.setFillStyle("#ffffff");
    context.fillText(messages, windowWidth / 2 - (12 * 10 / 2), (this.data.h4) / 2 + 155);//价格 必须为（0,0）原点
    //  -----新用户专享优惠
    var titleFontSize = (750 / 2) / bigTitle.length / 2
    //context.setFontSize(titleFontSize);
    context.setFillStyle("#ffffff");
    console.info(Number(titleFontSize * 1.5).toFixed(0))
    context.font = "bold " + Number(titleFontSize * 1.5).toFixed(0) + "px sans-serif";
    context.setTextAlign('center');
    context.fillText(bigTitle, (this.data.w4) / 2, this.data.h4 * (1 / 11));
    context.save();
    //  -----每名新用户绑定手机领取，将获得满10元减5元红包
    context.setFontSize(13);
    context.setFillStyle("#ffffff");
    context.save();
    context.setTextAlign('center');
    context.fillText(secTitle, (this.data.w4) / 2, this.data.h4 * (1 / 7));
    context.restore();
    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为  
    wx.drawCanvas({
      canvasId: 'redPacketqrCode',
      actions: context.getActions() //获取绘图动作数组  
    })
  },
  // 保存图片
  getSaveCodeimg: function () {
    var that = this;
    var context = wx.createContext();
    // this.setName(context)
    //   //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }, fail() {
              console.log('授权失败')
            }
          })
        }
      }
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1334,
      // height:1114-30,
      destWidth: that.data.w4 * 3,
      destHeight: that.data.h4 * 3,
      canvasId: 'redPacketqrCode',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success"
            })
          }, fail(res) {
            console.info(that.data.iconbase.icon_failImg_white_200_200)
            wx.showToast({
              title: '保存失败',
              image: '../../../../image/evaluate/cry.png'
            })
          }
        })
      }
    })
  },
  // 长按保存
  getlongtapsaveimg: function () {
    let that = this;
    wx.showModal({
      title: '保存二维码',
      content: '是否要保存到本地',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.getSaveCodeimg();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 获取红包信息数据
  getredPacketCode: function () {
    let that = this;
    let getuserMessage = walletUtil.appUtils.getUserData();
    let courierData = getuserMessage.userData;
    let profileId = courierData.id;//获取user的profileId
    let shopId = wx.getStorageSync("shopId");
    let id = shopId == '' || shopId == null || typeof (shopId) == 'undefined' ? '0' : shopId;
    walletUtil.controllerUtil.getredqecode(id, profileId, {},
      function (sucData) {
        if (sucData.data.succeeded) {
          console.info("getredPacketCode", sucData.data.data);
          let redpacketData = sucData.data.data;
          let qrCode = redpacketData.qrCode;
          that.setData({
            redpacketData: sucData.data.data,
            imgurl: qrCode,
          })
          that.getSystemMessage(qrCode)
        } else {
          console.info("getredPacketCode", sucData.data.message.descript)
        }
      },
      function (failData) {

      }, function (comdata) { })
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