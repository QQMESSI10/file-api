// 导入 express 模块
const express = require("express");
// 导入 cors 中间件
const cors = require("cors");
// 连接数据库
require("./db/index");
// 同步数据库
require("./db/sync");
// 连接oss
require("./oss/index");

// 转码
require("./oss/documentConvert")

const { logger } = require("./utils/utils");

// 创建 express 的服务器实例
const app = express();

// 将 cors 注册为全局中间件，允许跨域请求
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "1024mb" }));

// 通用配置
app.use((req, res, next) => {
  logger("info", req.ip + "  " + req.url, "访问路由");
  res.header("Content-Type", "application/json; charset=utf-8");
  res.header('Access-Control-Expose-Headers', 'token')
  res.errput = (err, status = 0, data) => {
    res.send({
      status,
      message: err,
      data,
    });
  };
  res.okput = (data, status = 1) => {
    res.send({
      status,
      data,
    });
  };
  next();
});

// 路由
const fileRouter = require("./router/file");
const transcodeRouter = require("./router/transcode")
const documentRouter = require('./router/document')
const imageRouter = require('./router/image')
const userRouter = require('./router/user')
const appRouter = require('./router/app')

app.use("/file", fileRouter);
app.use("/transcode", transcodeRouter);
app.use("/document", documentRouter);
app.use("/image", imageRouter)
app.use("/user", userRouter)
app.use("/app", appRouter)

app.use((req, res, next) => {
  res.status(404).send("你迷路了吗，快去找找管理员，问问路在何方......");
});

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8881, function () {
  console.log("接口启动成功，端口号：8881");
});
