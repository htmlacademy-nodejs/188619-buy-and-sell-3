'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));
offersRouter.get(`/add`, (req, res) => res.render(`ticket/new-ticket`));
offersRouter.get(`/edit/:id`, (req, res) => res.render(`ticket/ticket-edit`));
offersRouter.get(`/:id`, (req, res) => res.render(`ticket/ticket`));

module.exports = offersRouter;
