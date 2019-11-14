const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: "prod-924a3b" //一定要用你自己的云开发环境id
})

const xlsx = require('node-xlsx');

exports.main = async(event, context) => {
  try {
    let {
      dataList
    } = event

    //1,定义excel表格名
    let dataCVS = 'test.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['姓名', '微信']; //表属性
    alldata.push(row);

    dataList.forEach(item => {
      let arr = [];
      console.log("数据", item)
      arr.push(item.name);
      arr.push(item.weixin);
      alldata.push(arr)
    })

    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.error(e)
    return e
  }
}