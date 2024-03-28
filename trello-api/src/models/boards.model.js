import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { mongoDBConnection } from '~/configs/mongodb';
import { BOARD_TYPES } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { columnsModel } from './columns.model';
import { cardsModel } from './cards.model';

const BOARD_COLLECTION_NAME = 'boards';

const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(5).max(50).trim().strict(),
  slug: Joi.string().required().min(5).trim().strict(),
  description: Joi.string().required().min(5).max(256).trim().strict(),
  type: Joi.string().required().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),

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

// Tại sao lại dùng aggregate trong model?
// 1. Vì khi lấy chi tiết board, cần lấy thông tin columns và cards của board đó
// 2. Để tránh query nhiều lần ở service
// => Cần dùng aggregate để join các collection lại với nhau
const getBoardDetail = async (boardId) => {
  try {
    const board = await mongoDBConnection
      .getDb()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        // Match board
        {
          $match: {
            _id: new ObjectId(boardId),
            _destroy: false
          }
        },
        // Tìm columns của board
        {
          $lookup: {
            from: columnsModel.COLUMN_COLLECTION_NAME,
            localField: '_id', // => id thuộc Boards
            foreignField: 'boardId', // => boardId từ Columns
            as: 'columns' // 1 boards có nhiều columns
          }
        },
        // Tìm cards của board
        {
          $lookup: {
            from: cardsModel.CARD_COLLECTION_NAME,
            localField: '_id', // => id thuộc Boards
            foreignField: 'boardId', // => boardId từ Cards
            as: 'cards' // 1 boards có nhiều columns
          }
        }
      ]).toArray();
    return board[0] || {};
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
