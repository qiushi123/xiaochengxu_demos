import QR from '../../utils/qrcode.js' // es6的方式引入qrcode.js工具类
Page({
    data: {
        url: "https://blog.csdn.net/qiushi_1990"
    },

    //获取输入的url
    inputUrl(event) {
        console.log("输入内容", event.detail.value)
    },
    //生成二维码的点击事件
    getQr() {
        let url = this.data.url
        this.createQrCode(url, 300, 300)
    },

    createQrCode: function (content, cavW, cavH) {
        let canvasId = 'mycanvas'
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(content, canvasId, cavW, cavH);
        this.canvasToTempImage(canvasId);
    },

    //获取临时缓存图片路径，存入data中
    canvasToTempImage: function (canvasId) {
        let that = this;
        wx.canvasToTempFilePath({
            canvasId, // 这里canvasId即之前创建的canvas-id
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                that.setData({
                    imagePath: tempFilePath,
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    }
})