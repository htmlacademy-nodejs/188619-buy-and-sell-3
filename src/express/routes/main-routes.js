'use strict';

const Router = require(`express`);
const {sendRequestedPath} = require(`../../utils`);
const mainRouter = new Router();

mainRouter.get(`/`, sendRequestedPath);
mainRouter.get(`/register`, sendRequestedPath);
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, sendRequestedPath);

module.exports = mainRouter;
