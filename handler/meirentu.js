export default async function meirentuProxy(req, res) {
  try {
    req.query = req.query || {}; // 确保 req.query 存在
    console.log("query:", req.query); // 打印 req 对象
    console.log("headers:", req.headers); // 打印 req 对象
    console.log("method:", req.method); // 打印请求方法

    //代理格式：/https://example.com，然后去掉第一个字符
    const targetUrl = new String(req.path).substring(1).replace("meirentu/", ""); // 请求路径 // 代理的目标 API URL
    // 允许跨域访问的头部
    res.setHeader("Access-Control-Allow-Origin", "*"); // 允许所有源
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // 检查请求路径是否有效
    if (!req.path || req.path === "/favicon.ico") {
      console.log("======>Invalid request path:" + req.url); // 打印无效请求路径
      return res.status(400).json({ error: "Invalid request path" });
    }
    console.log("targetUrl:", targetUrl);

    const targetResponse = await fetch(targetUrl, {
      headers: {
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "i",
        "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
        "sec-fetch-storage-access": "active",
        Referer: "https://meirentu.cc",
      },
      body: null,
      method: "GET",
    });
    // 获取目标服务器的响应数据
    const contentType = targetResponse.headers.get("content-type");
    const arrayBuffer = await targetResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // 将 ArrayBuffer 转换为 Buffer
    // 转发目标服务器响应
    console.log("======>targetResponse:",targetResponse); // 打印目标服务器响应

    console.log("==========>buffer",buffer.byteLength);// 打印目标服务器响应
    
    // 设置响应头
    if (contentType) res.setHeader("Content-Type", contentType);
    const contentLength = targetResponse.headers.get("content-length");
    if (contentLength) res.setHeader("Content-Length", contentLength);
    res.status(targetResponse.status).send(buffer);
  } catch (error) {
    console.error(error);
    if (error.code == "ERR_INVALID_PROTOCOL") {
      let url = targetUrl;
      url = url.replace("http:", "https:");
      console.log(url);
      startFetch(url);
      return;
    }
    res.status(500).send(`Server Internal Error:\n ${error}`);
  }
}
