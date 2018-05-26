// pages/my/wallet/receiptcode/receiptcode.js
var iconsUtils = require("../../../../image/icons.js");
var publicEnvironment = require("../../../../utils/publicEnvironment.js");
var walletUtil = require("../../../../utils/walletUtil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // bgImg: "https://qnimg.xiaoguikuaipao.com/emEpT1Q7LTdqafb4e88b58bbbfb72dacc67",//二维码背景图
    bgImg: "https://qnimg.xiaoguikuaipao.com/mA15SWBvXAYx4ac1ccd679745b6a286ac82",
  },
  // 获取商家二维码数据
  getcodeData: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    let getuserMessage = walletUtil.appUtils.getUserData();
    let courierData = getuserMessage.userData;
    let getUserStoreData = walletUtil.appUtils.getUserData().mallData;//获取用户店铺信息
    console.info(walletUtil.appUtils.getUserData())
    let types = 'user';
    // let profileId = 'f68c5359850c4e17bf181cad607719c6';
    let profileId = courierData.id;//获取user的profileId
    // https://dev-logistics.xiaoguikuaipao.com/onePay/qrcode/employee/f68c5359850c4e17bf181cad607719c6
    console.info("logisticsUrl--", walletUtil.requestUrlList().logisticsUrl)
    var url = walletUtil.requestUrlList().logisticsUrl + '/onePay/qrcode/' + types + '/' + profileId + '?profileOnePayId=' + walletUtil.appUtils.getShopIdData() 
    if (!publicEnvironment.isTest){
      url = url+"&env=dev";
    }
   
    that.setData({
      imgurl: url
    })
    that.downloadImg(url)
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // icon 图标
    console.info("图标", iconsUtils.getIcons().walletIcons);
    this.setData({ icons: iconsUtils.getIcons().walletIcons });
    this.getcodeData(options);
    // canvas画店铺收款码
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info("res",res);
        console.info("res.model",res.model)
        console.info("res.pixelRatio",res.pixelRatio)
        console.info("res.windowWidth",res.windowWidth)
        console.info("res.windowHeight",res.windowHeight)
        console.info("res.language",res.language)
        console.info("res.version",res.version)
        that.setData({ w4: res.windowWidth, h4: res.windowHeight, pixelRatio: res.pixelRatio });
      }
    })
  },
  /*
  *canvas画店铺收款码
  */
  //将姓名绘制到canvas的固定
  // setName: function (context) {
  //   var name ='你是猪';
  //   context.setFontSize(20);
  //   context.setFillStyle("#ff0000");
  //   context.save();
  //   // context.translate(170, 506);//必须先将旋转原点平移到文字位置
  //   context.rotate(-5 * Math.PI / 180);
  //   context.fillText(name, 0, 0);//必须为（0,0）原点
  //   context.restore();
  //   context.stroke();
  // },
  getlongtapsaveimg:function(){
    let that =this;
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
                }, fail(){
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
      canvasId: 'firstCanvas',
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
            wx.showToast({
              title: '保存失败',
              image: "../../../../image/evaluate/cry.png"
            })
          }
        })
        // wx.previewImage({
        //   urls: [res.tempFilePath],
        // })
      }
    })
  },

  //下载图片
  downloadImg: function (url) {
    var that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        if (res.statusCode === 200) {
          console.info("下载后的资源", res);
          var twoCode = res.tempFilePath;
          wx.downloadFile({
            url: that.data.bgImg,
            success: function (res) {
              that.drawCard(twoCode, res.tempFilePath);
            }
          })

        }
      }
    })
  },
  //画海报
  drawCard: function (imgUrl, bgImg) {
    console.info(this.data.w + "本地临时文件" + this.data.h, imgUrl, bgImg);
    const ctx = wx.createCanvasContext('firstCanvas')
    // ctx.drawImage(bgImg, 0, 0, 750, 1334, 0, 0, 375, 667);
    //ctx.drawImage(bgImg, 0, 0, 750, 1334, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, this.data.w, this.data.h, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, this.data.w2, this.data.h2, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, this.data.w3, this.data.h3, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, 750,1334, 0, 0, 320, 504);//正常
    var pixelRatio = this.data.pixelRatio;
    console.info(this.data.h4)
    ctx.drawImage(bgImg, 0, 0, this.data.w4, this.data.h4, 0, 0);

    // ctx.setFillStyle('red')
    // ctx.fillRect(0, 0, this.data.w4-20, this.data.h4);
    var left = (this.data.w4 - 180) / 2;
    var top = (this.data.h4 - 100) / 2;
    ctx.drawImage(imgUrl, left, top, 180, 180);
    ctx.draw()
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
    // this.getFromServer();
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


})