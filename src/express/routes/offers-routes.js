"use strict";

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {Router} = require(`express`);
const offersRouter = new Router();
const api = require(`../api`).getAPI();
const {ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});
const upload = multer({storage});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));
offersRouter.get(`/add`, (req, res) => res.render(`ticket/new-ticket`));
offersRouter.get(`/edit/:id`, (req, res) => res.render(`ticket/ticket-edit`));
offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const offerData = {
    picture: file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: ensureArray(body.category),
  };

  try {
    await api.createOffer(`/offers`, offerData);
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
