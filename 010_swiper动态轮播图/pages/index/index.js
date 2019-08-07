// pages/index/index.js
Page({
  data: {
    imgUrls: [
      "../../images/img1.png",
      "../../images/img2.png"
    ]
  },

  getImages() {
    let that=this;
    let imgArr = [];
    wx.cloud.database().collection("images").get({
      success(res) {
        console.log("请求成功", res.data)
        let dataList = res.data;
        for (let i = 0; i < dataList.length; i++) {
          imgArr.push(dataList[i].url)
        }
        console.log("imgArr的数据", imgArr)
        that.setData({
          imgUrls: imgArr
        })
      },
      fail(res) {
        console.log("请求失败", res)
      }
    })

  }
})