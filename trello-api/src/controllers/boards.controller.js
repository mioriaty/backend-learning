import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { boardsService } from '~/services/boards.service';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @type {import('express').RequestHandler}
 */
const createNew = async (req, res, next) => {
  try {
    // Điều hướng sang tầng service
    const createdBoard= await boardsService.createNew(req.body);

    // Có kết quả thì trả về cho client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};


export const boardsController = {
  createNew
};