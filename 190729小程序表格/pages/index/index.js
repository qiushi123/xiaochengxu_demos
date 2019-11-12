Page({

    /**
     * 页面的初始数据
     */
    data: {},

    // 检测是否为零
    check0: function () {
        wx.showModal({
            title: "被除数不能为零!",
            showCancel: "ture",
            confirmText: "重新输入",
            confirmcolor: "#ccc",
        })
    },

    // 表单计算
    formSubmit: function (e) {
        var that = this;
        //获取输入值
        var massA1 = e.detail.value.massA1;
        var massB1 = e.detail.value.massB1;
        var massA2 = e.detail.value.massA2;
        var massB2 = e.detail.value.massB2;

        var massSum1 = 0.0;//求和
        var massSum2 = 0.0;//除法的结果

        if (massB2 == 0) {
            this.check0();
            return false;
        }

        massSum1 = parseInt(massA1) + parseInt(massB1);
        massSum2 = parseInt(massA2) / parseInt(massB2);

        console.log("massSum1:" + massSum1);
        console.log("massSum2:" + massSum2);
        this.setData({
            massSum1: massSum1 + "",
            massSum2: massSum2 + ""
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})