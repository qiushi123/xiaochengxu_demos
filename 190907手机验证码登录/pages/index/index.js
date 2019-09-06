//老师微信2501902696
let timeNum = 6 //60秒倒计时
let countDownTime = timeNum
let timer; //计时器
Page({
  data: {
    codeColor: "#0271c1",
    codeText: "获取验证码"
  },
  //获取验证码
  getCode() {
    if (countDownTime == timeNum) {
      this.setInterval()
      this.setData({
        codeColor: "#e6252b",
        codeText: countDownTime + "s"
      })
    } else {
      wx.showToast({
        title: '请等待验证码',
        icon: "none"
      })
    }
  },

  // 计时器,老师微信2501902696
  setInterval: function() {
    const that = this
    timer = setInterval(function() { // 设置定时器
      countDownTime--
      if (countDownTime < 2) {
        clearInterval(timer)
        that.setData({
          codeColor: "#0271c1",
          codeText: "获取验证码"
        })
        countDownTime = timeNum
      } else {
        that.setData({
          codeColor: "#e6252b",
          codeText: countDownTime + "s"
        })
      }
      console.log(countDownTime + "s")
    }, 1000)
  },
})