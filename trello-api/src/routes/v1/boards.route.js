import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { boardsController } from '~/controllers/boards.controller';
import { boardsValidation } from '~/validations/boards.validation';

const Router = express.Router();

// get all + create
Router.route('/')
  .get(boardsController.getAllBoards)
  .post(boardsValidation.createBoardValidation, boardsController.createNew);

// get one + update
Router.route('/:id')
  .get(boardsController.getBoardDetail)
  .put();

export const boardRoutes = Router;