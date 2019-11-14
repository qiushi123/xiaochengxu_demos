// pages/test/test.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // new Promise(function(resolve, reject) {
        //   //做一些异步操作
        //   setTimeout(function() {
        //     console.log('执行完成');
        //     resolve('随便什么数据');
        //   }, 2000);
        // })
    },

    yibu() {

        let pArr = []
        let p1 = new Promise((resolve, reject) = > {
            resolve("异步123"
    )
        // reject("错误123")
    })
        ;

        pArr.push(p1)
        Promise.all(pArr).then(res = > {
            console.log("返回的数据", res)
        }
    )
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})