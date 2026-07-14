import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User';  // 引入你的 User 模型

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';  // 生产环境应使用环境变量

// 解析请求体
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----- MongoDB 连接 -----
mongoose.connect('mongodb://localhost:27017/musicDB')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ----- 原有功能：根路径测试 -----
app.get('/', (req, res) => {
    res.send('Hello World! Server is running!');
});

// ----- 原有功能：搜索代理（不变）-----
app.post('/', async (req, res) => {
    try {
        const { s, type, limit, offset } = req.body;
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

// ----- 新增功能：用户注册 -----
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: '密码长度至少6位' });
        }

        // 检查用户名是否已存在（利用模型唯一索引）
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ error: '用户名已存在' });
        }

        // 创建用户（密码自动加密，由 User.ts 中的 pre('save') 中间件处理）
        const newUser = new User({ username, password });
        await newUser.save();

        // 返回用户信息（不含密码）
        res.status(201).json({
            message: '注册成功',
            user: {
                id: newUser._id,
                username: newUser.username,
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// ----- 新增功能：用户登录 -----
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        // 使用 User.ts 中定义的 comparePassword 方法验证密码
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        // 生成 JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '登录成功',
            token,
            user: {
                id: user._id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// ----- 启动服务器（监听所有网卡）-----
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});