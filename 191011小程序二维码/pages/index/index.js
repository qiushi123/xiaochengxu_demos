import QR from '../../utils/qrcode.js' // es6的方式
Page({
    data: {},
    onLoad: function () {

    },

    //生成普通二维码
    goQrCode() {
        wx.navigateTo({
            url: '../qrcode/qrcode',
        })
    },
    //生成小程序码
    goWxApp() {
        wx.cloud.callFunction({
            name: 'getWXACode',
            data: {
                page: 'pages/index/index',
                scene: "name=qcl",
            },
            success: res = > {
            console.log("生成成功", res)
            this.setData({
                wxAcode: res.result
            })
        },
            fail
    :
        error =
    >
        {
            console.log("生成失败", res)
        }
    })
        ;
    }

})