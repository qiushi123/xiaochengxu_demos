// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async(event, context) =
>
{
    let {
        scene,
        page
    } = event

    try {
        // 1、通过云调用生成带参数的二维码
        const result = await
        cloud.openapi.wxacode.getUnlimited({
            scene: scene,
            page: page,
            width: 400
        })
        // 2、上传图片到云存储
        const upload = await
        cloud.uploadFile({
            cloudPath: scene + '.jpg',
            fileContent: result.buffer,
        })
        // 3、返回图片地址
        var fileID = upload.fileID;
        return fileID
    } catch (err) {
        console.log(err)
        return err
    }
}