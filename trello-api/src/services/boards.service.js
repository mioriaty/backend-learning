/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes';
import { boardsModel } from '~/models/boards.model';
import ApiError from '~/utils/apiError';
import { slugify } from '~/utils/slugify';

/**
 * @typedef {Object} ReqBody
 * @property {string} title
 * @property {string} description
 */
/**
 * @param {ReqBody} reqBody
 */
const createNew = async (reqBody) => {
  try {
    // Xử lý logic đặc thù của dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    };

    // Gọi tới Model để xử lý lư bản ghi newBoard vào database
    const insertedBoard = await boardsModel.createNew(newBoard);

    // Lấy bản ghi board sau khi tạo
    const board = await boardsModel.findOneById(insertedBoard.insertedId);

    // Làm thêm các xử lý khác với các Collection khác ...
    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo
    return board;
  } catch (error) {
    throw error;
  }
};

const getBoardDetail = async (boardId) => {
  try {
    const foundBoard = await boardsModel.getBoardDetail(boardId);
    if (!foundBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');
    }

    return foundBoard;
  } catch (error) {
    throw error;
  }
};

const getAllBoards = async () => {
  try {
    const boards = await boardsModel.getAllBoards();
    return boards;
  } catch (error) {
    throw error;
  }
};

export const boardsService = {
  createNew,
  getBoardDetail,
  getAllBoards
};