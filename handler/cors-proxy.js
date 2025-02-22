import fetch from "node-fetch";
import { Request as Req, Response as Res } from "node-fetch";
import https from "https";
import fs from "fs";
const agent = new https.Agent({
    rejectUnauthorized: false, // 忽略 SSL 证书错误
});
// api/proxy.js
export default async function requestImageResourceHandler(req, res) {
    // console.log(req); // 打印 req 对象
    console.log(req.method); // 打印请求方法
    //代理格式：/https://example.com，然后去掉第一个字符
    const targetUrl = new String(req.path).substring(1); // 请求路径 // 代理的目标 API URL

    // 允许跨域访问的头部
    res.setHeader("Access-Control-Allow-Origin", "*"); // 允许所有源
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // 处理 OPTIONS 请求（CORS 预检请求）
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    // 检查请求路径是否有效
    if (!req.path || req.path === "/favicon.ico") {
        console.log("======>Invalid request path:" + req.url); // 打印无效请求路径
        return res.status(400).json({ error: "Invalid request path" });
    }
    try {
        const targetUrlObj = new URL(targetUrl);
        console.log("======>targetUrlObj:"); // 打印目标 URL 对象
        console.log(targetUrlObj); // 打印目标 URL 对象
        let newReq = new Request(targetUrl, {
            method: req.method,
            headers: {
                // 'Authorization': req.headers.authorization,
                "User-Agent": req.headers["user-agent"],
            },
            body: req.method === "POST" || req.method === "PUT" ? req.body : undefined,
        });
        console.log("======>newReq:"); // 打印新请求对象
        console.log(newReq); // 打印新请求对象
        // 使用 fetch 转发请求
        console.log("======>fetch:"); // 打印 fetch

        // return startRequest();

        const targetResponse = await fetch(targetUrl, {
            method: newReq.method,
            headers: newReq.headers,
            body: newReq.body,
            agent: agent,
        });

        // 获取目标服务器的响应数据
        const contentType = targetResponse.headers.get("content-type");
        const arrayBuffer = await targetResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer); // 将 ArrayBuffer 转换为 Buffer
        // 设置响应头
        if (contentType) res.setHeader("Content-Type", contentType);
        const contentLength = targetResponse.headers.get('content-length');
        if (contentLength)
            res.setHeader("Content-Length", contentLength);

        // 转发目标服务器响应
        console.log("======>targetResponse:"); // 打印目标服务器响应
        console.log(targetResponse); // 打印目标服务器响应
        console.log("==========>buffer");
        console.log(buffer.byteLength); // 打印目标服务器响应
        res.status(targetResponse.status).send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Internal Error");
    }
}

//test
function startRequest() {
    fetch(
            "https://example.com", {
                method: "GET",
                headers: {
                    // "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                },
                agent: agent,
            }
        )
        .then((res) => {
            res.arrayBuffer()
                .then((buffer) => {
                    fs.writeFileSync("test.jpg", Buffer.from(buffer));
                    console.log(buffer);
                    console.log("==========>res");
                    console.log(res);
                    return res;
                })
                .catch((err) => {
                    console.error(err);
                });
        })
        .catch((err) => {
            console.error(err);
        });
}

// startRequest(); // test启动请求