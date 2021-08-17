"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {HttpCode} = require(`../../constants`);
const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);

const mockData = [
  {
    id: `aYPr7b`,
    category: [`Разное`],
    description: `Если товар не понравится — верну всё до последней копейки. Это настоящая находка для коллекционера! Товар в отличном состоянии. Таких предложений больше нет!`,
    picture: `item06.jpg`,
    title: `Продам новую приставку Sony Playstation 5.`,
    type: `offer`,
    sum: 11953,
    comments: [
      {
        id: `ok0tpX`,
        text: `А где блок питания?`,
      },
    ],
  },
  {
    id: `jOcKaK`,
    category: [`Книги`],
    description: `Не пытайтесь торговаться. Цену вещам я знаю. Если найдёте дешевле — сброшу цену. Мой дед не мог её сломать. Две страницы заляпаны свежим кофе.`,
    picture: `item13.jpg`,
    title: `Продам книги Стивена Кинга.`,
    type: `offer`,
    sum: 3251,
    comments: [
      {
        id: `FHmv9c`,
        text: `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле.`,
      },
      {
        id: `jZ8C-m`,
        text: `Оплата наличными или перевод на карту?`,
      },
    ],
  },
  {
    id: `TBbChx`,
    category: [`Посуда`],
    description: `Продаю с болью в сердце... Это настоящая находка для коллекционера! Если найдёте дешевле — сброшу цену. Кому нужен этот новый телефон, если тут такое...`,
    picture: `item10.jpg`,
    title: `Продам новую приставку Sony Playstation 5.`,
    type: `sale`,
    sum: 59875,
    comments: [
      {
        id: `Fxcvoe`,
        text: `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту? Совсем немного...`,
      },
    ],
  },
  {
    id: `v27Jkq`,
    category: [`Журналы`],
    description: `Таких предложений больше нет! При покупке с меня бесплатная доставка в черте города. Продаю с болью в сердце... Две страницы заляпаны свежим кофе.`,
    picture: `item12.jpg`,
    title: `Продам коллекцию журналов «Огонёк».`,
    type: `sale`,
    sum: 24663,
    comments: [
      {
        id: `tAJgtK`,
        text: `С чем связана продажа? Почему так дешёво?`,
      },
      {
        id: `fIXWp2`,
        text: `Оплата наличными или перевод на карту?`,
      },
      {
        id: `SZc4FK`,
        text: `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. А где блок питания?`,
      },
    ],
  },
  {
    id: `vW8jPO`,
    category: [`Журналы`],
    description: `Если товар не понравится — верну всё до последней копейки. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары. Продаю с болью в сердце...`,
    picture: `item01.jpg`,
    title: `Продам советскую посуду. Почти не разбита.`,
    type: `offer`,
    sum: 59426,
    comments: [
      {
        id: `9DqiBv`,
        text: `С чем связана продажа? Почему так дешёво?`,
      },
      {
        id: `yVu6zw`,
        text: `Неплохо, но дорого. Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  // console.log(cloneData);
  offer(app, new DataService(cloneData));
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });
  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "aYPr7b"`, () => expect(response.body[0].id).toBe(`aYPr7b`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/vW8jPO`);
  });
  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам советскую посуду. Почти не разбита."`, () => expect(response.body.title).toBe(`Продам советскую посуду. Почти не разбита.`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });
  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();
  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };
  request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();
  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };
  request(app)
    .put(`/offers/vW8jPO`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);

});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/offers/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/v27Jkq`)
      .send(newOffer);
  });
  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, () => request(app)
    .get(`/offers/v27Jkq`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/TBbChx`);
  });
  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`TBbChx`));
  test(`Offer count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});
