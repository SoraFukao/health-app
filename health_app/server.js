const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// CORSとJSONパーサーの設定
app.use(cors());
app.use(bodyParser.json());

// 静的ファイルを提供
app.use(express.static('public'));

// サーバーポート設定
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// 目標データの仮の保存用
let goals = [];

// 目標取得
app.get('/api/goals', (req, res) => {
    res.json(goals);
});

// 目標追加
app.post('/api/goals', (req, res) => {
    const goal = req.body;
    goals.push(goal);
    res.status(201).json(goal);
});

// 目標更新
app.put('/api/goals/:id', (req, res) => {
    const { id } = req.params;
    const updatedGoal = req.body;
    goals = goals.map(goal => goal.id === id ? updatedGoal : goal);
    res.json(updatedGoal);
});

// 目標削除
app.delete('/api/goals/:id', (req, res) => {
    const { id } = req.params;
    goals = goals.filter(goal => goal.id !== id);
    res.status(204).send();
});