//云开发实现支付
const cloud = require('wx-server-sdk')
cloud.init();

//1，引入支付的三方依赖
const tenpay = require('tenpay');
//2，配置支付信息
const config = {
    appid: '你的小程序appid', //
    mchid: '你的微信商户号', //
    partnerKey: '你的微信支付安全密钥', //
    notify_url: 'https://mp.weixin.qq.com', //支付回调网址,这里可以先随意填一个网址
    spbill_create_ip: '127.0.0.1'
};

exports.main = async(event, context) =
>
{
    const wxContext = cloud.getWXContext()
    let {
        orderid,
        money
    } = event;
    //3，初始化支付
    const api = tenpay.init(config);

    let result = await
    api.getPayParams({
        out_trade_no: orderid,
        body: '商品简单描述',
        total_fee: money, //订单金额(分),
        openid: wxContext.OPENID //付款用户的openid
    });
    return result;
}