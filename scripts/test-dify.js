#!/usr/bin/env node

/**
 * Dify API 连接测试脚本
 * 用于验证 Dify 配置是否正确
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 尝试加载 .env.local 文件
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    }
    console.log('📁 已加载 .env.local 文件');
  }
}

// 加载环境变量
loadEnvFile();

// 从环境变量读取配置
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_BASE_URL = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1';
const DIFY_APP_ID = process.env.DIFY_APP_ID;

function testDifyConnection() {
  console.log('🧪 开始测试 Dify AI 连接...\n');

  // 检查配置
  if (!DIFY_API_KEY) {
    console.error('❌ DIFY_API_KEY 未配置');
    process.exit(1);
  }

  if (!DIFY_APP_ID) {
    console.error('❌ DIFY_APP_ID 未配置');
    process.exit(1);
  }

  console.log('✅ 配置检查通过');
  console.log(`📡 API Key: ${DIFY_API_KEY.substring(0, 10)}...`);
  console.log(`🔗 Base URL: ${DIFY_BASE_URL}`);
  console.log(`🆔 App ID: ${DIFY_APP_ID}`);
  console.log('');

  // 构建请求
  // const url = new URL(`${DIFY_BASE_URL}/apps/${DIFY_APP_ID}/chat-messages`);
  const url = new URL(`${DIFY_BASE_URL}/chat-messages`);
  const postData = JSON.stringify({
    inputs: {},
    query: '你好，这是一个测试消息',
    response_mode: 'blocking',
    user: 'test-user',
    auto_generate_name: false
  });

  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🚀 发送测试请求...');
  console.log(`📍 端点: ${url.toString()}`);
  console.log('');

  const client = url.protocol === 'https:' ? https : http;
  
  const req = client.request(options, (res) => {
    console.log(`📊 响应状态: ${res.statusCode} ${res.statusMessage}`);
    console.log('📋 响应头:', res.headers);
    console.log('');

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          console.log('✅ 连接成功！');
          console.log('🤖 AI 响应:', response.answer || '无响应内容');
          console.log('💬 会话 ID:', response.conversation_id || '无');
        } catch (e) {
          console.log('⚠️  响应解析失败，但连接成功');
          console.log('📄 原始响应:', data.substring(0, 200) + '...');
        }
      } else {
        console.log('❌ 连接失败');
        console.log('📄 错误响应:', data);
        
        // 常见错误提示
        if (res.statusCode === 401) {
          console.log('\n💡 可能的原因：');
          console.log('   - API Key 无效或过期');
          console.log('   - API Key 格式错误');
        } else if (res.statusCode === 404) {
          console.log('\n💡 可能的原因：');
          console.log('   - App ID 错误');
          console.log('   - API 端点路径错误');
        } else if (res.statusCode === 403) {
          console.log('\n💡 可能的原因：');
          console.log('   - 没有访问该应用的权限');
          console.log('   - API Key 权限不足');
        }
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ 请求失败:', e.message);
    console.log('\n💡 可能的原因：');
    console.log('   - 网络连接问题');
    console.log('   - Base URL 配置错误');
    console.log('   - 防火墙阻止连接');
  });

  req.write(postData);
  req.end();
}

// 运行测试
testDifyConnection();
