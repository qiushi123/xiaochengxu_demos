# 小程序导出数据到excel表，借助云开发后台实现excel数据的保存

> 我们在做小程序开发的过程中，可能会有这样的需求，就是把我们云数据库里的数据批量导出到excel表里。如果直接在小程序里写是实现不了的，所以我们要借助小程序的云开发功能了。这里需要用到云函数，云存储和云数据库。可以说通过这一个例子，把我们微信小程序云开发相关的知识都用到了。

# 老规矩，先看效果图
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b30437e29a61?w=278&h=274&f=png&s=11822)
上图就是我们保存用户数据到excel生成的excel文件。

# 实现思路
- 1，创建云函数
- 2，在云函数里读取云数据库里的数据
- 3，安装node-xlsx类库（node类库）
- 4，把云数据库里读取到的数据存到excel里
- 5，把excel存到云存储里并返回对应的云文件地址
- 6，通过云文件地址下载excel文件

# 一，创建excel云函数
关于云函数的创建，我这里不多说了。如果你连云函数的创建都不知道，建议你去小程序云开发官方文档去看看。或者看下我录制的云开发入门的视频：https://edu.csdn.net/course/detail/9604

#### 创建云函数时有两点需要注意的，给大家说下
- 1，一定要把app.js里的环境id换成你自己的
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0aec4468662ee?w=1378&h=680&f=png&s=146829)
- 2，你的云函数目录要选择你对应的云开发环境（通常这里默认选中的）
不过你这里的云开发环境要和你app.js里的保持一致
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0aece69f56688?w=684&h=358&f=png&s=67775)

# 二，读取云数据库里的数据
我们第一步创建好云函数以后，可以先在云函数里读取我们的云数据库里的数据。
- 1，先看下我们云数据库里的数据
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0af164f415ddf?w=2236&h=994&f=png&s=156534)
- 2，编写云函数，读取云数据库里的数据（一定要记得部署云函数）
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b27a3c56fab4?w=1806&h=516&f=png&s=127795)
- 3，成功读取到数据
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0afb871213eec?w=1794&h=1112&f=png&s=333570)

把读取user数据表的完整代码给大家贴出来。
```
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "test-vsbkm"
})
// 云函数入口函数
exports.main = async(event, context) => {
  return await cloud.database().collection('users').get();
}
```

# 三，安装生成excel文件的类库 node-xlsx
通过上面第二步可以看到我们已经成功的拿到需要保存到excel的源数据，我们接下来要做的就是把数据保存到excel
- 1，安装node-xlsx类库
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0afefaa0a406a?w=1078&h=832&f=png&s=216578)
这一步需要我们事先安装node,因为我们要用到npm命令，通过命令行
```
npm install node-xlsx
```
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b0082214aa59?w=1630&h=536&f=png&s=127740)

可以看出我们安装完成以后，多了一个package-lock.json的文件
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b01241d6be8e?w=1584&h=502&f=png&s=147468)


# 四，编写把数据保存到excel的代码，
下图是我们的核心代码
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b26ca92b7f05?w=1696&h=1294&f=png&s=352171)
这里的数据是我们查询的users表的数据，然后通过下面代码遍历数组，然后存入excel。这里需要注意我们的id,name,weixin要和users表里的对应。
```
   for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].id);
      arr.push(userdata[key].name);
      arr.push(userdata[key].weixin);
      alldata.push(arr)
    }
```
还有下面这段代码，是把excel保存到云存储用的
```
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })
```
下面把完整的excel里的index.js代码贴给大家,记得把云开发环境id换成你自己的。
```
const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: "test-vsbkm"
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let {userdata} = event
    
    //1,定义excel表格名
    let dataCVS = 'test.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['id', '姓名', '微信号']; //表属性
    alldata.push(row);

    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].id);
      arr.push(userdata[key].name);
      arr.push(userdata[key].weixin);
      alldata.push(arr)
    }
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

```

# 五，把excel存到云存储里并返回对应的云文件地址
我们上面已经成功的把数据存到excel里，并把excel文件存到云存储里。可以看下效果。
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b2e041d4c7cb?w=2372&h=1426&f=png&s=292313)
我们这个时候，就可以通过上图的下载地址下载excel文件了。
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b2f3e9ad8557?w=2546&h=1574&f=png&s=648060)
我们打开下载的excel
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b2ff9794cc4c?w=634&h=656&f=png&s=106916)
其实到这里就差不多实现了基本的把数据保存到excel里的功能了，但是我们要下载excel，总不能每次都去云开发后台吧。所以我们接下来要动态的获取这个下载地址。

# 六，获取云文件地址下载excel文件
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b36131a7e891?w=930&h=494&f=png&s=74404)
通过上图我们可以看出，我们获取下载链接需要用到一个fileID,而这个fileID在我们保存excel到云存储时，有返回，如下图。我们把fileID传给我们获取下载链接的方法即可。
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b376fe0fe6d7?w=642&h=636&f=png&s=84076)
- 1，我们获取到了下载链接，接下来就要把下载链接显示到页面
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b3adab223e87?w=2132&h=1356&f=png&s=441208)
- 2，代码显示到页面以后，我们就要复制这个链接，方便用户粘贴到浏览器或者微信去下载
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b408c12312c4?w=2006&h=1162&f=png&s=307895)

下面把我这个页面的完整代码贴给大家
```
Page({
  onLoad: function(options) {
    let that = this;
    //读取users表数据
    wx.cloud.callFunction({
      name: "getUsers",
      success(res) {
        console.log("读取成功", res.result.data)
        that.savaExcel(res.result.data)
      },
      fail(res) {
        console.log("读取失败", res)
      }
    })
  },

  //把数据保存到excel里，并把excel保存到云存储
  savaExcel(userdata) {
    let that = this
    wx.cloud.callFunction({
      name: "excel",
      data: {
        userdata: userdata
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
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  //复制excel文件下载链接
  copyFileUrl() {
    let that=this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制成功",res.data) // data
          }
        })
      }
    })
  }
})
```
给大家说下上面代码的步骤。
- 1，下通过getUsers云函数去云数据库获取数据
- 2，把获取到的数据通过excel云函数把数据保存到excel，然后把excel保存的云存储。
- 3，获取云存储里的文件下载链接
- 4，复制下载链接，到浏览器里下载excel文件。

到这里我们就完整的实现了把数据保存到excel的功能了。
###  文章有点长，知识点有点多，但是大家把这个搞会以后，就可以完整的学习小程序云开发的：云函数，云数据库，云存储了。可以说这是一个综合的案例。
### 有什么不懂的地方，或者有疑问的地方，请在文章底部留言，我看到都会及时解答的。后面我还会出一系列关于云开发的文章，敬请关注。