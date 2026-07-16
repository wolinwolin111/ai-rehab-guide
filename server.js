/**
 * AI运动康复思路助手 — Node.js 后端服务
 * MVP阶段：静态文件服务 + API接口
 */
const express = require('express');
const path = require('path');
const { matchSymptom, getApproach, searchSymptoms, getSymptomsByJoint } = require('./js/knowledge-base');

const app = express();
const PORT = process.env.PORT || 3099;

// 静态文件
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// API: 症状匹配
app.post('/api/analyze', (req, res) => {
  try {
    const { symptom } = req.body;
    if (!symptom || symptom.trim().length < 2) {
      return res.json({ found: false, message: '请输入症状描述' });
    }
    const result = matchSymptom(symptom);
    if (!result.found) {
      return res.json(result);
    }
    // 返回第一个根源方案
    const approach = getApproach(result.symptomData, 0);
    return res.json({
      found: true,
      symptomName: result.symptomName,
      related_joints: result.related_joints,
      totalCauses: result.totalCauses,
      approach: approach
    });
  } catch (e) {
    console.error('Analyze error:', e);
    res.status(500).json({ error: '分析出错，请稍后重试' });
  }
});

// API: 切换思路
app.post('/api/switch', (req, res) => {
  try {
    const { symptomName, causeIndex } = req.body;
    // 需要前端传入symptomName来重新查找
    const result = matchSymptom(symptomName);
    if (!result.found) {
      return res.json({ error: '症状未找到' });
    }
    const idx = Math.min(causeIndex, result.totalCauses - 1);
    const approach = getApproach(result.symptomData, idx);
    return res.json({ causeIndex: idx, totalCauses: result.totalCauses, approach });
  } catch (e) {
    console.error('Switch error:', e);
    res.status(500).json({ error: '切换出错' });
  }
});

// API: 搜索建议
app.get('/api/search', (req, res) => {
  try {
    const q = req.query.q || '';
    const results = searchSymptoms(q);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: '搜索出错' });
  }
});

// API: 部位导航
app.get('/api/joints', (req, res) => {
  res.json(getSymptomsByJoint());
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🏥 AI运动康复思路助手 已启动: http://localhost:${PORT}`);
});
