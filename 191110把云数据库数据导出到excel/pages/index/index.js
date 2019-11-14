Page({
  //点击了导出按钮
  daochu() {
    let that = this;
    wx.cloud.database().collection("users").get({
      success(res) {
        console.log("请求数据成功", res)
        that.savaExcel(res.data)
      },
      fail(res) {
        console.log("请求数据失败", res)
      }
    })
  },
  //把数据保存到excel里，并把excel保存到云存储
  savaExcel(dataList) {
    let that = this
    wx.cloud.callFunction({
      name: "excel20191113",
      data: {
        dataList: dataList
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl(res.result.fileID)
      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        console.log("文件下载失败", err)
      }
    })
  },
  //复制excel文件下载链接
  copyFileUrl() {
    let that = this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制成功", res.data) // data
          }
        })
      }
    })
  }
})