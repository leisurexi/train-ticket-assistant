import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant']
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const SessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, '会话标题不能超过200个字符']
  },
  messages: [MessageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// 创建索引
SessionSchema.index({ userId: 1, updatedAt: -1 });
SessionSchema.index({ userId: 1, lastMessageAt: -1 });
SessionSchema.index({ createdAt: -1 });

// 静态方法：为用户创建新会话
SessionSchema.statics.createForUser = async function(userId: string, firstMessage: string) {
  // 生成会话标题（取用户消息的前30个字符）
  const title = firstMessage.length > 30 
    ? firstMessage.substring(0, 30) + '...' 
    : firstMessage;

  const session = await this.create({
    userId,
    title,
    messages: [{
      role: 'user',
      content: firstMessage,
      timestamp: new Date()
    }],
    lastMessageAt: new Date()
  });

  return session;
};

// 实例方法：添加消息
SessionSchema.methods.addMessage = function(role: 'user' | 'assistant', content: string) {
  this.messages.push({
    role,
    content,
    timestamp: new Date()
  });
  this.lastMessageAt = new Date();
  return this.save();
};

// 实例方法：更新标题
SessionSchema.methods.updateTitle = function(newTitle: string) {
  this.title = newTitle;
  return this.save();
};

// 防止重复编译模型
export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
