Page({
  data: {
    bgImg: "https://qnimg.xiaoguikuaipao.com/1bhJiOBKpqNCebffabb4de23f0f583ed9cd"
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        that.setData({ w4: res.windowWidth, h4: res.windowHeight, pixelRatio: res.pixelRatio});
      }
    })
  },
  onReady: function () {
    
  },
  save: function () {
    var that = this; 
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1334,
      destWidth: that.data.w4*3,
      destHeight: that.data.h4*3,
      canvasId: 'firstCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon:"success"
            })
          }
        })
        // wx.previewImage({
        //   urls: [res.tempFilePath],
        // })
      }
    })
  },
  getFromServer: function () {
    var that = this;
    wx.request({
      url: "https://dev-api.xiaoguikuaipao.com/api/v1/store/getWxaCode",
      data: {
        page: "pages/store/index",
        scene: 5969,
        width: 430,
        auto_color: false,
        type: "store",
        line_color: { "r": "0", "g": "0", "b": "0" }
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
        //'androidApi': '3.3.8'
        'api': 'web',
      },
      success: function (res) {
        console.log("得到二维码返回");
        console.log(res)
        if (res.data.message.type == "success") {
          that.downloadImg(res.data.data);
        }

      },
      fail: function (res) {
        console.log("请求失败返回");
        console.log(res);
      },
      complete: function (res) {
        wx.hideLoading();
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
              that.drawCard(twoCode,res.tempFilePath);
            }
          })

        }
      }
    })
  },
  //画海报
  drawCard: function (imgUrl, bgImg) {
    console.info(this.data.w + "本地临时文件" + this.data.h, imgUrl);
    const ctx = wx.createCanvasContext('firstCanvas')

    // ctx.drawImage(bgImg, 0, 0, 750, 1334, 0, 0, 375, 667);
    //ctx.drawImage(bgImg, 0, 0, 750, 1334, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, this.data.w, this.data.h, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, this.data.w2, this.data.h2, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, this.data.w3, this.data.h3, 0, 0, 320, 504);
    // ctx.drawImage(bgImg, 0, 0, 750,1334, 0, 0, 320, 504);//正常
    var pixelRatio = this.data.pixelRatio;
    ctx.drawImage(bgImg, 0, 0, this.data.w4, this.data.h4, 0, 0);

    // ctx.setFillStyle('red')
    // ctx.fillRect(0, 0, this.data.w4-20, this.data.h4);
    var left = (this.data.w4-250)/2;
    var top = (this.data.h4-250)/2-20;
    ctx.drawImage(imgUrl, left, top, 250, 250);
    ctx.draw()
  },
  onShow: function () {
    this.getFromServer();
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