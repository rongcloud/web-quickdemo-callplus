## 快速集成 Demo - CallPlus 场景

## 版本依赖

```html
<!-- RongIMLib -->
<script src="https://cdn.ronghub.com/RongIMLib-5.8.3.prod.js"></script>
<!-- RTCLib v5 -->
<script src="https://cdn.ronghub.com/RCRTC-5.6.16.prod.js"></script>
<!-- CallPlus -->
<script src="https://cdn.ronghub.com/CallPlus-1.0.0.prod.js"></script>
```

## 使用说明

1. 将工程 clone 到本地，使用 Chrome 浏览器直接打开静态资源中的 `startCall.html`、`accept.html` 进行操作，`startCall.html` 为呼叫端，`accept.html` 为接听端。
2. demo 仅提供了基础的流程梳理，如您需要更多功能，可[参考 CallPlus 音视频开发文档](https://doc.rongcloud.cn/callplus/Web/1.X/make-first-call)

## 参数说明

### Appkey 获取

[可在融云开发者后台 - 服务管理](https://developer.rongcloud.cn/app/appService/8zkf1JD8NLF0gxOV3S0NuA)中创建一个应用，填入应用对应的 `appkey`

### Token 获取

[可在融云开发者后台 - 服务管理 - API 调用 - 获取 Token](https://developer.rongcloud.cn/apitool/bj4hYt7YBcwvXteZeVi7aQ) 中，输入 `userId`，从提交后返回的数据中取 `token` 字段值

## 私有云用户特殊配置

私有云用户需要单独配置 `navi` 地址以连接到私有云的 IM 服务，`navi` 配置可通过修改 `config.js` 完成

> 私有云用户需联系商务获取私有云 sdk 的 cdn 文件
