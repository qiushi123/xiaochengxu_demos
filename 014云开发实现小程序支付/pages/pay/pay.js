// pages/pay/pay.js
Page({
    //提交订单
    formSubmit: function (e) {
        let that = this;
        let formData = e.detail.value
        console.log('form发生了submit事件，携带数据为：', formData)
        wx.cloud.callFunction({
            name: "pay",
            data: {
                orderid: "" + formData.orderid,
                money: formData.money
            },
            success(res) {
                console.log("提交成功", res.result)
                that.pay(res.result)
            },
            fail(res) {
                console.log("提交失败", res)
            }
        })
    },

    //实现小程序支付
    pay(payData) {
        //官方标准的支付方法
        wx.requestPayment({
            timeStamp: payData.timeStamp,
            nonceStr: payData.nonceStr,
            package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
            signType: 'MD5',
            paySign: payData.paySign, //签名
            success(res) {
                console.log("支付成功", res)
            },
            fail(res) {
                console.log("支付失败", res)
            },
            complete(res) {
                console.log("支付完成", res)
            }
        })
    }
})