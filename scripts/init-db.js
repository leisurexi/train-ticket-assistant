#!/usr/bin/env node

/**
 * 数据库初始化脚本
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
// require('dotenv').config({ path: '.env.local' });

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

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'train-ticket-assistant';

if (!MONGODB_URI) {
  console.error('❌ 请在 .env.local 中设置 MONGODB_URI');
  process.exit(1);
}

async function initDatabase() {
  let client;

  try {
    console.log('🔄 连接到 MongoDB...');
    console.log(`📍 连接字符串: ${MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')}`); // 隐藏密码
    console.log(`📂 数据库名称: ${DB_NAME}`);

    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5秒超时
      connectTimeoutMS: 10000, // 10秒连接超时
    });

    await client.connect();
    console.log('✅ MongoDB 连接成功');

    // 测试连接
    await client.db('admin').command({ ping: 1 });
    console.log('✅ 数据库 ping 测试成功');

    const db = client.db(DB_NAME);
    console.log(`✅ 连接到数据库: ${DB_NAME}`);

    // 创建用户集合和索引
    console.log('🔄 创建用户集合...');
    const usersCollection = db.collection('users');
    
    // 创建索引
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ createdAt: -1 });
    
    console.log('✅ 用户集合和索引创建完成');

    // 创建会话集合和索引
    console.log('🔄 创建会话集合...');
    const sessionsCollection = db.collection('sessions');

    await sessionsCollection.createIndex({ userId: 1, updatedAt: -1 });
    await sessionsCollection.createIndex({ userId: 1, lastMessageAt: -1 });
    await sessionsCollection.createIndex({ createdAt: -1 });

    console.log('✅ 会话集合和索引创建完成');

    // 显示数据库状态
    const stats = await db.stats();
    console.log('\n📊 数据库状态:');
    console.log(`   数据库名称: ${stats.db}`);
    console.log(`   集合数量: ${stats.collections}`);
    console.log(`   数据大小: ${(stats.dataSize / 1024).toFixed(2)} KB`);

    console.log('\n🎉 数据库初始化完成！');

  } catch (error) {
    console.error('❌ 数据库初始化失败:');
    console.error('错误类型:', error.name);
    console.error('错误信息:', error.message);

    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 可能的原因:');
      console.error('   1. MongoDB 服务未启动');
      console.error('   2. 连接字符串错误');
      console.error('   3. 网络连接问题');
      console.error('   4. 防火墙阻止连接');
      console.error('   5. MongoDB Atlas IP 白名单未配置');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('\n💡 可能的原因:');
      console.error('   1. 用户名或密码错误');
      console.error('   2. 数据库用户权限不足');
      console.error('   3. 认证数据库配置错误');
    }

    console.error('\n🔍 调试建议:');
    console.error('   1. 检查 .env.local 文件中的 MONGODB_URI');
    console.error('   2. 确认 MongoDB 服务正在运行');
    console.error('   3. 测试网络连接');

    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 数据库连接已关闭');
    }
  }
}

// 运行初始化
initDatabase();
