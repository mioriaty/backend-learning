import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { mongoDBConnection } from '~/configs/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const BOARD_COLLECTION_NAME = 'boards';

const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(5).max(50).trim().strict(),
  slug: Joi.string().required().min(5).trim().strict(),
  description: Joi.string().required().min(5).max(256).trim().strict(),

  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
});

const _validateBeforeCreate = async (data) => {
  try {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const validData = await _validateBeforeCreate(data);

    const createdBoard = await mongoDBConnection.getDb().collection(BOARD_COLLECTION_NAME).insertOne(validData);

    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const board = await mongoDBConnection.getDb().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });

    return board;
  } catch (error) {
    throw new Error(error);
  }
};

// Sẽ update query tổng hợp aggregation để lấy toàn bộ column và card của board
// Thời điểm hiện tại chưa có
const getBoardDetail = async (boardId) => {
  try {
    const board = await mongoDBConnection.getDb().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(boardId)
    });
    return board;
  } catch (error) {
    throw new Error(error);
  }

};

const getAllBoards = async () => {
  try {
    const boards = await mongoDBConnection.getDb().collection(BOARD_COLLECTION_NAME).find({}).toArray();
    return boards;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardsModel = {
  createNew,
  findOneById,
  getBoardDetail,
  getAllBoards
};