import express from 'express';
import axios from 'axios';   // 需要安装 axios: npm install axios

const app = express();
const PORT = 3000;

// 解析 application/x-www-form-urlencoded 和 application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 根路径测试
app.get('/', (req, res) => {
    res.send('Hello World! Server is running!');
});

// 搜索代理接口（对应前端 searchMusic 的请求）
app.post('/', async (req, res) => {
    try {
        const { s, type, limit, offset } = req.body;
        // 调用网易云搜索 API
        const response = await axios({
            method: 'post',
            url: 'https://music.163.com/api/cloudsearch/pc',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://music.163.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Cookie': 'appver=2.0.2'
            },
            data: `s=${encodeURIComponent(s)}&type=${type}&limit=${limit}&offset=${offset}`
        });
        res.json(response.data);
    } catch (error: any) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: '搜索失败，请检查网络或参数' });
    }
});

// 监听所有网络接口
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});