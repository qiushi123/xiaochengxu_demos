//app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
  },

  //获取用户openid，授权的情况下也可以获取userinfo
  onLaunch: function() {
    //云开发的初始化
    wx.cloud.init({
      env: "zhyp96-3vv54",
      traceUser: "true"
    })
    this.getOpenid();
  },

  // 获取用户openid
  getOpenid: function() {
    var app = this;
    var openidStor = wx.getStorageSync('openid');
    if (openidStor) {
      console.log('本地获取openid:' + openidStor);
      app.globalData.openid = openidStor;
      app._getUserInfo();
    } else {
      //获取openid不需要授权
      wx.cloud.callFunction({
        name: "getOpenid",
        success(res) {
          var openid = res.result.openid;
          app.globalData.openid = openid;
          console.log('请求获取openid:', openid);
          wx.setStorageSync('openid', openid)
          app._getUserInfo();
        },
        fail(res) {
          console.log("获取openid失败", res)
          app._getUserInfo();
        }
      })
    }

  },

  // 获取用户信息，如果用户没有授权，就获取不到
  _getUserInfo: function() {
    var app = this;
    wx.getUserInfo({ //从网络获取最新用户信息
      success: function(res) {
        var user = res.userInfo;
        user.openid = app.globalData.openid;
        app.globalData.userInfo = user;
        console.log('请求获取user成功', user)
        app._saveUserInfo(user);
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(res)
        }
      },
      fail: function(res) { //请求网络失败时，再读本地数据
        console.log('请求获取user失败')
        var userStor = wx.getStorageSync('user');
        if (userStor) {
          console.log('本地获取user', userStor)
          app.globalData.userInfo = userStor;
        }
      }
    })
  },

  // 保存userinfo，到本地和线上
  _saveUserInfo: function(user) {
    let app = this;
    //缓存全局变量
    this.globalData.userInfo = user;
    //缓存到sd卡里
    wx.setStorageSync('user', user);

    let userDB = wx.cloud.database().collection("users");
    // 1，查询数据库里的用户信息
    userDB.where({
      _id: app.globalData.openid
    }).get({
      success(res) {
        
        if (res.data && res.data.length > 0) { //数据库里有这个用户了
          let dbUser = res.data[0].user;
          console.log("get成功", dbUser)
          //用户没有改名，没有换头像
          if (dbUser.avatarUrl == user.avatarUrl && dbUser.nickName == user.nickName) {
            console.log("用户数据没有变")
          } else {
            console.log("用户数据改变了")
            app.uploadUserInfo(user, true)
          }

        } else {
          console.log("get失败", res.data)
          app.uploadUserInfo(user, false)
        }
      },
      fail(res) {
        console.log("get失败", res)
        app.uploadUserInfo(user, false)
      }
    })


  },
  //上传或更新用户信息到数据库
  uploadUserInfo(user, isUpdate) {
    let app = this
    let userDB = wx.cloud.database().collection("users");

    if (isUpdate) { //更新用户数据
      userDB.update({
        data: {
          _id: app.globalData.openid,
          user
        },
        success(res) {
          console.log("更新用户信息成功", res)
        }
      })
    } else { //添加用户数据
      userDB.add({
        data: {
          _id: app.globalData.openid,
          user
        },
        success(res) {
          console.log("上传用户信息成功", res)
        }
      })
    }

  },

  // 错误提示
  showErrorToastUtils: function(e) {
    wx.showModal({
      title: '提示！',
      confirmText: '朕知道了',
      content: e,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },

  // 打开权限设置页提示框
  _showSettingToast: function(e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      content: e,
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },

  //获取当前时间,返回时间格式：2018-09-16 15:43:36
  getNowFormatDate: function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
      " " + date.getHours() + seperator2 + date.getMinutes() +
      seperator2 + date.getSeconds();
    return currentdate;
  },

})