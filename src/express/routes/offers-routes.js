'use strict';

const {Router} = require(`express`);
const {sendRequestedPath} = require(`../../utils`);
const offersRouter = new Router();

offersRouter.get(`/category/:id`, sendRequestedPath);
offersRouter.get(`/add`, sendRequestedPath);
offersRouter.get(`/edit/:id`, sendRequestedPath);
offersRouter.get(`/:id`, sendRequestedPath);

module.exports = offersRouter;
