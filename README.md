# CORS Proxy

## 项目简介

CORS Proxy 是一个简单易用的代理服务器，用于解决跨域资源共享 (CORS) 问题。它允许前端应用程序绕过浏览器的同源策略，安全地访问不同源的资源。

## 功能特性

- **跨域请求**: 允许前端应用程序发送跨域请求。
- **安全性**: 支持配置允许的源，防止未经授权的访问。
- **易于部署**: 轻量级，易于在各种环境中部署。
## 目录结构
```
MyPROJECT/ 
├── cors-proxy/ 
│ ├── handler/ 
│ │ ├── cors-proxy.js
│ ├── node_modules/ 
│ ├── package.json 
│ ├── package-lock.json 
│ ├── server.js
```

## 安装

1. 克隆项目到本地：

    ```sh
    git clone https://github.com/yourusername/cors-proxy.git
    cd cors-proxy
    ```

2. 安装依赖：

    ```sh
    npm install
    ```

## 使用

1. 启动服务器：

    ```sh
    npm start
    ```

2. 服务器启动后，访问 `http://localhost:3000` 即可使用代理功能。

### 配置
>待完善，目前没有过滤请求地址机制，所有网站源地址都可以访问

在 `config.json` 文件中配置允许的源和其他选项：

```json
{
    "allowedOrigins": ["http://example.com", "http://anotherdomain.com"],
    "port": 8080
}
```
## 示例

假设你想要代理访问 `https://example.com/api/data`，可以通过以下方式进行请求：

```sh
curl -X GET http://localhost:3000/https://example.com/api/data
```

### 示例代码请求

前端代码示例：

```javascript
fetch('http://localhost:8080/your-api-endpoint', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 贡献

欢迎贡献代码！请提交 Pull Request 或报告问题。

## 许可证

本项目采用 MIT 许可证。

如有问题请联系作者我：[jaysen.lin@foxmail.com](mailto:jaysen.lin@foxmail.com)