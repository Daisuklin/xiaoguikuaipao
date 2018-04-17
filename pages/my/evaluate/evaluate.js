// pages/my/evaluate/evaluate.js
var app = getApp();
var appUtil = require('../../../utils/appUtil.js');
var qiniuUploader = require("../../../utils/qiniuUploader");


Page({
  /**
   * 页面的初始数据
   */
  data: {
    glans: '',
    distribution: '',
    quantum: '',
    noteMaxLen: 250,//备注最多字数
    info: "",
    tempFilePaths: '',
    tempFilePaths1: '',
    tempFilePaths2: '',
    noteNowLen: 0,//备注当前字数
    glans1: '',
    smiling1: '../../../image/evaluate/asterastrstar.png',
    smiling2: '../../../image/evaluate/star.png',
    stars: ['../../../image/evaluate/star.png', '../../../image/evaluate/asterastrstar.png'],
    array: ['../../../image/evaluate/asterastrstar.png', '../../../image/evaluate/star.png'],
    smile: ['https://qnimg.xiaoguikuaipao.com/FnwpSk4ss-yD1Qwbi4g0OBO5ZNNS', '../../../image/evaluate/cry.png', 'https://qnimg.xiaoguikuaipao.com/FhnAZ1Hx9JT4oM_sWZzSGAr-bCpF'],
    isShow: 0, //配送员中的笑脸id
    isHide: 0, //店铺中的笑脸id
    isOk: 0,   //店铺中的星星id
    tick: '../../../image/evaluate/cancel.png',
    circle: '../../../image/evaluate/circle.png',
    click: 0,
    commodity: [],
    isBug: true,
    isBug1: false,
    imageURL: '',
  },


  //循环出的列表中对应的星星变色
  setStar: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    var rec_id = e.currentTarget.dataset.rec_id;
    var commodity = this.data.commodity;
    for (var i in commodity) {
      if (rec_id == commodity[i].rec_id) {
        commodity[i].starNum = parseInt(id);
        break;
      }
    }
    this.setData({
      commodity: commodity
    })
  },


  //点击笑脸显示笑脸
  press(e) {
    console.log(e);
    var id = e.currentTarget.id;
    this.setData({
      isShow: id
    })
  },

  //餐店点击笑脸显示笑脸
  press1(e) {
    console.log(e);
    var id = e.currentTarget.id;
    this.setData({
      isHide: id
    })

  },

  //点击星星换色
  press2(e) {
    console.log(e);
    var id = e.currentTarget.id;
    this.setData({
      isOk: id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId;
    this.setData({
      orderId: orderId
    })
    this.evaluateList();//评价列表
    //获取七牛中的uploadToken
    var uploadToken = appUtil.appUtils.getBlackUser().commonData.shopncUploadToken
    console.log(uploadToken)
    this.setData({
      uploadToken: uploadToken
    })
  },

  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value, len = parseInt(value.length);
    if (len > that.data.noteMaxLen) return;
    that.setData({ info: value, noteNowLen: len })
  },

  //评价商品表
  bindTextAreaChange1: function (e) {
    console.log(e);
    var that = this;
    //分开输入
    var goods_id = e.currentTarget.id;
    console.log(goods_id)
    var commodity = this.data.commodity;
    var content = e.detail.value;
    // console.log(content)
    for (var i in commodity) {
      if (goods_id == commodity[i].goods_id) {
        commodity[i].document = content;
        var extent = commodity[i].document.length;
        commodity[i].len = parseInt(extent);
      }
    }
    this.setData({
      commodity: commodity,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //拍摄照片1
  photograph(e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.id;
    var rec_id = e.currentTarget.dataset.rec_id;
    var commodity = that.data.commodity;
    for (var i in commodity) {
      if (rec_id == commodity[i].rec_id) {
        commodity[i].material = parseInt(id) //把点击到的id赋值给列表中，进行缓存
      }
    }
    var uptoken = that.data.uploadToken;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '图片上传中',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: res.tempFiles["0"].path,
        })
        var commodity = that.data.commodity;
        var image = that.data.tempFilePaths;
        console.log(JSON.stringify(image) + "我是图片哦")
        var imgName = JSON.stringify(image).substr(60, 35);
        for (var i = 0; i < commodity.length; i++) {
          if (rec_id == commodity[i].rec_id) {
            var flagIndex = i;
            var filePath = image;
            //图片上传七牛
            qiniuUploader.upload(filePath, (res) => {
              that.setData({
                'imageURL': res.imageURL,
              });
              var images = that.data.imageURL
              if (images == undefined || images == null || images == 0) {

              } else {
                commodity[flagIndex].picture = images;
                that.setData({
                  commodity: commodity,
                })
                wx.hideLoading()
              }
            },
              (error) => {
                console.log('error: ' + error);
                wx.showLoading({
                  title: '添加失败',
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 1500)
              }
              ,
              {
                region: 'ECN',
                domain
                :
                'https://qnimg.xiaoguikuaipao.com', // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                key
                :
                imgName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                uptoken
                :
                uptoken, // 由其他程序生成七牛 uptoken
              }
            )
              ;
          }
        }

      },
    })
  },

  //删除图片
  icon(e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.id;
    var rec_id = e.currentTarget.dataset.rec_id;
    var commodity = that.data.commodity;
    for (var i in commodity) {
      if (rec_id == commodity[i].rec_id) {
        commodity[i].material = parseInt(id) //把点击到的id赋值给列表中，进行缓存
        commodity[i].picture = [];
      }
    }
    that.setData({
      commodity: commodity, //存入表中
    })

  },


  //拍摄照片2
  photograph1(e) {
    var that = this;
    var id = e.currentTarget.id;
    var rec_id = e.currentTarget.dataset.rec_id;
    var commodity = that.data.commodity;
    for (var i in commodity) {
      if (rec_id == commodity[i].rec_id) {
        commodity[i].piss = parseInt(id) //把点击到的id赋值给列表中，进行缓存
      }
    }
    var uptoken = that.data.uploadToken;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '图片上传中',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths1: res.tempFiles["0"].path,
        })
        var commodity = that.data.commodity;
        var image = that.data.tempFilePaths1;
        var imgName = JSON.stringify(image).substr(60, 35);
        for (var i in commodity) {
          if (rec_id == commodity[i].rec_id) {
            var flagIndex = i;
            var filePath = image;
            //图片上传七牛
            qiniuUploader.upload(filePath, (res) => {
              that.setData({
                'imageURL': res.imageURL,
              });
              var images = that.data.imageURL
              if (images == undefined || images == null || images == 0) {

              } else {
                commodity[flagIndex].graphic = images;
                that.setData({
                  commodity: commodity,
                })
                wx.hideLoading()
              }
            },
              (error) => {
                console.log('error: ' + error);
                wx.showLoading({
                  title: '添加失败',
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 1500)
              }
              ,
              {
                region: 'ECN',
                domain
                :
                'https://qnimg.xiaoguikuaipao.com', // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                key
                :
                imgName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                uptoken
                :
                uptoken, // 由其他程序生成七牛 uptoken
              }
            )
              ;
          }
        }
      },
    })
  },

  //删除图片
  icon1(e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.id;
    var rec_id = e.currentTarget.dataset.rec_id;
    var commodity = that.data.commodity;
    for (var i in commodity) {
      if (rec_id == commodity[i].rec_id) {
        commodity[i].piss = parseInt(id) //把点击到的id赋值给列表中，进行缓存
        commodity[i].graphic = [];
      }
    }
    that.setData({
      commodity: commodity, //存入表中
    })
  },


  //拍摄照片3
  photograph2(e) {
    var that = this;
    var id = e.currentTarget.id;
    var rec_id = e.currentTarget.dataset.rec_id;
    var commodity = that.data.commodity;
    for (var i in commodity) {
      if (rec_id == commodity[i].rec_id) {
        commodity[i].medicine = parseInt(id) //把点击到的id赋值给列表中，进行缓存
      }
    }
    var uptoken = that.data.uploadToken;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '图片上传中',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths2: res.tempFiles["0"].path,
        })
        var commodity = that.data.commodity;
        var image = that.data.tempFilePaths2;
        var imgName = JSON.stringify(image).substr(60, 35);
        for (var i in commodity) {
          if (rec_id == commodity[i].rec_id) {
            var flagIndex = i;
            var filePath = image;
            //图片上传七牛
            qiniuUploader.upload(filePath, (res) => {
              that.setData({
                'imageURL': res.imageURL,
              });
              var images = that.data.imageURL
              if (images == undefined || images == null || images == 0) {

              } else {
                commodity[flagIndex].print = images;
                that.setData({
                  commodity: commodity,
                })
                wx.hideLoading()
              }
            },
              (error) => {
                console.log('error: ' + error);
                wx.showLoading({
                  title: '添加失败',
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 1500)
              }
              ,
              {
                region: 'ECN',
                domain
                :
                'https://qnimg.xiaoguikuaipao.com', // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                key
                :
                imgName, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                uptoken
                :
                uptoken, // 由其他程序生成七牛 uptoken
              }
            )
              ;
          }
        }
      }
    })
  },

  //删除图片
  icon2(e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.id;
    var rec_id = e.currentTarget.dataset.rec_id;
    var commodity = that.data.commodity;
    for (var i in commodity) {
      if (rec_id == commodity[i].rec_id) {
        commodity[i].medicine = parseInt(id) //把点击到的id赋值给列表中，进行缓存
        commodity[i].print = [];
      }
    }
    that.setData({
      commodity: commodity, //存入表中
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //判断匿名
  dot() {
    var id = 0;
    this.setData({
      isBug: true,
      isBug1: false,
      click: id
    })
  },
  dot1() {
    var id = 1;
    this.setData({
      isBug: false,
      isBug1: true,
      click: id,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  //提交评价
  evaluate(e) {
    console.log(e)
    var that = this;
    //获取参数
    //订单id
    var orderId = that.data.orderId;
    console.log(orderId + 'orderId')

    //评价人memberid
    var memberid = appUtil.appUtils.getBlackUser().memberData.member_id;
    console.log(memberid + 'memberid')

    //评价人昵称userInfo
    var name = appUtil.appUtils.getStorageUser().nickName;
    console.log(name + 'name')

    //概览评分
    var storeGrade = that.data.isHide;
    console.log(storeGrade + '我是店铺中的笑脸id')

    //相符评分
    var agreeGrade = that.data.isOk;
    console.log(agreeGrade + '我是店铺中的星星id')

    //匿名获取
    var anonymity = that.data.click;
    console.log(anonymity + 'anonymity')

    //物流订单id
    var logisticsId = that.data.logisticsId;
    console.log(logisticsId + '你是谁啊')

    //目标id
    var profileId = that.data.profileId;
    console.log(profileId + 'profileId')

    //物流评分
    var logisticsGrade = that.data.isShow;
    console.log(logisticsGrade + '我是配送员中的笑脸id')

    //物流评分内容
    var content = typeof (that.data.info) == "undefined" ? "" : that.data.info;
    console.log(content + 'content')

    //列表循环
    var commodity = that.data.commodity;
    // console.log(commodity)


    //创建数组
    var kfc = [];
    for (var i = 0; i < commodity.length; i++) {
      //创建对象
      var str = {};
      //订单商品id
      str.geval_ordergoodsid = commodity[i].rec_id;
      //1 - 5分
      str.geval_scores = commodity[i].starNum;
      // 评价内容
      str.geval_content = typeof (commodity[i].document) == "undefined" ? "" : commodity[i].document;
      //商品规格
      str.geval_goods_spec_keyValue = commodity[i].goods_spec;
      //订单ID
      str.geval_orderid = orderId
      //晒单图片多个
      var a = JSON.stringify(commodity[i].picture);
      var b = JSON.stringify(commodity[i].graphic);
      var c = JSON.stringify(commodity[i].print);
      if ((typeof (a) == "undefined" && typeof (b) == "undefined" && typeof (c) == "undefined") || (a == "[]" && b == "[]" && c == "[]")) {
        str.geval_image = '';
      } else if ((typeof (c) == "undefined" && typeof (a) == "undefined") || (a == "[]" && c == "[]")) {
        str.geval_image = b;
      } else if ((typeof (a) == "undefined" && typeof (b) == "undefined") || (a == "[]" && b == "[]")) {
        str.geval_image = c;
      } else if ((typeof (b) == "undefined" && typeof (c) == "undefined") || (b == "[]" && c == "[]")) {
        str.geval_image = a;
      } else if (typeof (a) == "undefined" || a == "[]") {
        str.geval_image = b + ',' + c;
      } else if (typeof (b) == "undefined" || b == "[]") {
        str.geval_image = a + ',' + c;
      } else if (typeof (c) == "undefined" || c == "[]") {
        str.geval_image = a + ',' + b;
      } else {
        str.geval_image = a + ',' + b + ',' + c;
      }
      str.geval_image = str.geval_image.replace(/"([^"]*)"/g, "'$1'");
      //封装进去
      kfc.push(str)
    }
    console.log(kfc)

    //调用评价接口
    wx.request({
      url: appUtil.ajaxUrls().evaluateUrl,
      method: "POST",
      data: {
        "geval_orderid": orderId, //订单id,
        "geval_frommemberid": memberid,//评价人memberid,
        "geval_frommembername": name,//评价人姓名
        "shop_seval_servicecredit": storeGrade, //概览评分,
        "shop_seval_desccredit": agreeGrade, //相符评分,
        "geval_isanonymous": anonymity,//0表示不是，1表示匿名,
        "orderId": logisticsId,//物流订单id
        "targetType": 'expressCourier',//目标类型
        "targetId": profileId,//目标id,
        "score": logisticsGrade,//物流评分,
        "description": content,//物流评分内容,
        "shopncEvaluateGoods": kfc, //商品里的参数
      },
      header: {
        "content-type": "application/json",//默认值
        'api': 'web',
        'Authorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.succeeded == true) {
          wx.showToast({
            title: '评价成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)

        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        } else {
          wx.showLoading({
            title: '该订单不能评价',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1500)
        }
      },
      fail: function (res) {
        wx.showLoading({
          title: '订单评价有误',
        })

      },
      complete: function (res) {
      },
    })

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  //列表显示
  evaluateList() {
    var that = this;
    var orderId = that.data.orderId;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: appUtil.ajaxUrls().evaluatelistUrl, //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        "order_id": Number(orderId),
      },
      header: {
        "Content-Type": "application/json",//默认值
        'api': 'web',
        'shopMcAuthorization': appUtil.appUtils.getTokenData(),
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.succeeded == true){
          var list = res.data;
          var evaluateList = list.data;
          //判断配送员是否存在
          var courier = evaluateList.since_hand;
          console.log(courier + '我是配送员')
          if (courier == 0) {

            if (evaluateList.extend_logistics == null) {
              that.setData({
                profileId: null
              })
            } else {
              var glans = evaluateList.extend_logistics.member_avatar;//配送员头像链接
              var distribution = evaluateList.extend_logistics.member_name;//配送员姓名
              var quantum1 = evaluateList.extend_logistics.signedAt;//时间戳，秒为单位

              //判断时间戳为0的情况下，不显示
              if (quantum1 == 0) {
                that.setData({
                  quantum: '',
                })
              } else {
                var quantum = that.getNowTiem(quantum1);
                that.setData({
                  quantum: quantum + '左右送达',
                })
              }

              //物流订单id
              var logisticsId = evaluateList.extend_logistics.id;

              //配送员id
              var profileId = evaluateList.extend_logistics.profileId;
            }
          }

          var glans1 = evaluateList.extend_store.store_avatar;
          var snack = evaluateList.extend_store.store_name;

          //商品模块
          var commodity = evaluateList.extend_order_goods;
          for (var i in commodity) {
            commodity[i].starNum = 0;
            commodity[i].len = 0;
          }

          //订单id
          var orderId = evaluateList.order_id;

          that.setData({
            glans: glans,
            distribution: distribution,
            glans1: glans1,
            snack: snack,
            commodity: commodity,
            logisticsId: logisticsId,
            orderId: orderId,
            profileId: profileId,
          })
          wx.hideLoading()

          var array = that.data.array;
          for (var i = 0; i < array.length; i++) {
            var arr = array[i];
            break
          }
          that.setData({
            smiling3: arr,
          })
        } else if (res.data.error.code == 401) {
          appUtil.appUtils.setShowMessage();
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '加载失败',
        })
        wx.hideLoading()
      }
    })

  },
  //换算时间戳(换算成月.日.时.分)
  getNowTiem: function (time) {//转换时间格式
    //获取当前时间
    var n = time * 1000;
    var date = new Date(n);
    //月
    var Mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var Dates = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var hours = date.getHours();
    //分
    var mint = date.getMinutes();
    if (mint < 10) {
      mint = "0" + mint;
    } else {
      mint = mint;
    }
    //秒
    var s = date.getSeconds();
    var orderTime = Mon + "月" + Dates + "日 " + hours + ":" + mint;//订单时间格式
    return orderTime;
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.evaluateList();
    wx.stopPullDownRefresh()
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