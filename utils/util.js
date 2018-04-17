// Page({
//   data: {

//   },
//   onLoad: function (options) {

//   },
//   onReady: function () {

//   },
//   onShow: function () {


//   },
//   onHide: function () {

//   },
//   onUnload: function () {

//   },
//   onPullDownRefresh: function () {

//   },
//   onReachBottom: function () {

//   },
// })


// onShareAppMessage: function () {

// }





function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
} 