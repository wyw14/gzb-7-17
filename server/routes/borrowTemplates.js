const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/storage');

const router = express.Router();

router.get('/', (req, res) => {
  const templates = readJSON('borrowTemplates.json', []);
  const { ownerId } = req.query;
  
  let result = templates;
  
  if (ownerId) {
    result = result.filter(t => t.ownerId === ownerId);
  }
  
  res.json(result);
});

router.get('/:id', (req, res) => {
  const templates = readJSON('borrowTemplates.json', []);
  const template = templates.find(t => t.id === req.params.id);
  
  if (!template) {
    return res.status(404).json({ error: '模板不存在' });
  }
  
  res.json(template);
});

router.post('/', (req, res) => {
  const templates = readJSON('borrowTemplates.json', []);
  
  const newTemplate = {
    id: 't' + uuidv4().slice(0, 8),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  templates.push(newTemplate);
  writeJSON('borrowTemplates.json', templates);
  
  res.json({ success: true, template: newTemplate });
});

router.put('/:id', (req, res) => {
  const templates = readJSON('borrowTemplates.json', []);
  const idx = templates.findIndex(t => t.id === req.params.id);
  
  if (idx === -1) {
    return res.status(404).json({ error: '模板不存在' });
  }
  
  templates[idx] = { ...templates[idx], ...req.body, id: templates[idx].id };
  writeJSON('borrowTemplates.json', templates);
  
  res.json({ success: true, template: templates[idx] });
});

router.delete('/:id', (req, res) => {
  const templates = readJSON('borrowTemplates.json', []);
  const filtered = templates.filter(t => t.id !== req.params.id);
  
  if (filtered.length === templates.length) {
    return res.status(404).json({ error: '模板不存在' });
  }
  
  writeJSON('borrowTemplates.json', filtered);
  res.json({ success: true });
});

module.exports = router;
