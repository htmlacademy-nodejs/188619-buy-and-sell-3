"use strict";

const {Router} = require(`express`);
const offersRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ensureArray} = require(`../../utils`);

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

offersRouter.get(`/add`, (req, res) => res.render(`ticket/new-ticket`));

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const offerData = {
    picture: file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    category: ensureArray(body.category),
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (e) {
    console.log(e);
    res.redirect(`back`);
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories(),
  ]);
  res.render(`ticket/ticket-edit`, {offer, categories});
});

offersRouter.get(`/:id`, (req, res) => res.render(`ticket/ticket`));

module.exports = offersRouter;
