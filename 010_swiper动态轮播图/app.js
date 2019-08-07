//app.js
App({
  onLaunch: function() {
    wx.cloud.init({
      env: "prod-924a3b"
    })
  }
})