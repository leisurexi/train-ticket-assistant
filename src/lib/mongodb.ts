import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 在全局对象上缓存 mongoose 连接
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * 连接到 MongoDB 数据库
 */
export async function connectToDatabase() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      authSource: 'admin', // 指定认证数据库
      retryWrites: true,
      w: 'majority' as const
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB 连接成功');
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error('❌ MongoDB 连接失败:', e);
    throw e;
  }

  return cached!.conn;
}

/**
 * 断开数据库连接
 */
export async function disconnectFromDatabase() {
  if (cached!.conn) {
    await cached!.conn.disconnect();
    cached!.conn = null;
    cached!.promise = null;
    console.log('🔌 MongoDB 连接已断开');
  }
}
