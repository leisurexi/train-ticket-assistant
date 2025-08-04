import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, '邮箱地址是必需的'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      '请输入有效的邮箱地址'
    ]
  },
  name: {
    type: String,
    required: [true, '用户名是必需的'],
    trim: true,
    maxlength: [50, '用户名不能超过50个字符']
  },
  avatar: {
    type: String,
    default: null
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt
  toJSON: {
    transform: function(_doc, ret: Record<string, unknown>) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// 创建索引（email 索引已通过 unique: true 自动创建）
UserSchema.index({ createdAt: -1 });

// 静态方法：根据邮箱查找或创建用户
UserSchema.statics.findOrCreate = async function(email: string, name: string) {
  let user = await this.findOne({ email });
  
  if (!user) {
    user = await this.create({
      email,
      name,
      lastLoginAt: new Date()
    });
    console.log(`✅ 新用户注册: ${email}`);
  } else {
    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();
    console.log(`✅ 用户登录: ${email}`);
  }
  
  return user;
};

// 实例方法：更新最后登录时间
UserSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

// 防止重复编译模型
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
