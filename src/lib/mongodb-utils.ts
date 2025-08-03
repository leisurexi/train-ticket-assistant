import mongoose from 'mongoose';

/**
 * MongoDB 工具函数
 */

/**
 * 验证字符串是否为有效的 ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * 将字符串转换为 ObjectId
 */
export function toObjectId(id: string): mongoose.Types.ObjectId {
  if (!isValidObjectId(id)) {
    throw new Error(`无效的 ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
}

/**
 * 安全地将字符串转换为 ObjectId，失败时返回 null
 */
export function safeToObjectId(id: string): mongoose.Types.ObjectId | null {
  try {
    return toObjectId(id);
  } catch {
    return null;
  }
}

/**
 * 验证并格式化 ObjectId 参数
 */
export function validateObjectIdParam(
  id: string | undefined, 
  paramName: string = 'ID'
): { valid: boolean; error?: string; objectId?: mongoose.Types.ObjectId } {
  if (!id) {
    return {
      valid: false,
      error: `${paramName}不能为空`
    };
  }

  if (!isValidObjectId(id)) {
    return {
      valid: false,
      error: `无效的${paramName}格式`
    };
  }

  return {
    valid: true,
    objectId: toObjectId(id)
  };
}

/**
 * 批量验证 ObjectId 数组
 */
export function validateObjectIdArray(ids: string[]): {
  valid: boolean;
  invalidIds: string[];
  validObjectIds: mongoose.Types.ObjectId[];
} {
  const invalidIds: string[] = [];
  const validObjectIds: mongoose.Types.ObjectId[] = [];

  for (const id of ids) {
    if (isValidObjectId(id)) {
      validObjectIds.push(toObjectId(id));
    } else {
      invalidIds.push(id);
    }
  }

  return {
    valid: invalidIds.length === 0,
    invalidIds,
    validObjectIds
  };
}
