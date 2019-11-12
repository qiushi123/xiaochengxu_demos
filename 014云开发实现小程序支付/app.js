//app.js
App({
    onLaunch: function () {
        wx.cloud.init({
            env: "prod-ayrkn"
        })
    }
})