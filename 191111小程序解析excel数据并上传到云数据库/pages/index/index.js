Page({
  //1，选择excel表格
  chooseExcel() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let path = res.tempFiles[0].path;
        console.log("选择excel成功", path)
        that.uploadExcel(path);
      }
    })
  },

  //2，上传excel表格到云存储
  uploadExcel(path) {
    let that = this
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.xls',
      filePath: path, // 文件路径
      success: res => {
        console.log("上传成功", res.fileID)
        that.jiexi(res.fileID)
      },
      fail: err => {
        console.log("上传失败", err)
      }
    })
  },

  //3，解析excel数据并上传到云数据库
  jiexi(fileId) {
    wx.cloud.callFunction({
      name: "excel",
      data: {
        fileID: fileId
      },
      success(res) {
        console.log("解析并上传结果", res)
      },
      fail(res) {
        console.log("解析失败", res)
      }
    })
  }
})