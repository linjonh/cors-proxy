import express from "express";
import corsProxy from "./handler/cors-proxy.js";
import meirentuProxy from "./handler/meirentu.js";
import cors from "cors";

const app = express();
const port = 3080;

// ✅ 启用 CORS 和 body 解析
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 路由建议用正则或前缀匹配，而不是 "*/meirentu/*"
app.all(/\/meirentu\/.*/, meirentuProxy);

// ✅ 默认代理所有其他请求
app.all("*", corsProxy);

app.listen(port, () => {
  console.log(`✅ CORS Proxy server running at http://localhost:${port}`);
});
