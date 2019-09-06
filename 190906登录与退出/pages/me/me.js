const app = getApp();
let openid;
Page({

  // 页面的初始数据
  data: {
    isShowUserName: false,
    userInfo: null,
    openid: ""
  },

  // button获取用户信息
  onGotUserInfo: function(e) {
    app.getOpenid();
    
    if (e.detail.userInfo) {
      let user = e.detail.userInfo;
      this.setData({
        isShowUserName: true,
        userInfo: e.detail.userInfo,
      })
      user.openid = app.globalData.openid;
      app._saveUserInfo(user);
    } else {
      app._showSettingToast('登陆需要允许授权');
    }

  },
  loginOut() {
    app._saveUserInfo(null)
    this.setData({
      isShowUserName:false
    })
  },


  //生命周期函数--监听页面加载
  onLoad: function(options) {
    openid = app.globalData.openid
    console.log("openid",openid)
    var that = this;
    that.setData({
      openid: openid
    })

    var user = app.globalData.userInfo;
    if (user) {
      that.setData({
        isShowUserName: true,
        userInfo: user,
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          isShowUserName: true
        })
      }
    }

  }
})