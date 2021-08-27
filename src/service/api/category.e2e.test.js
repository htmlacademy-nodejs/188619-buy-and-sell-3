"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {HttpCode} = require(`../../constants`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);

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

const createAPI = (service) => {
  const app = express();
  app.use(express.json());
  category(app, service);
  return app;
};

describe(`Getting list of all categories`, () => {
  describe(`Getting list if categories exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/categories`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body should be equal to data categories`, () => {
      expect(response.body.length).toBe(dataService.findAll().length);
    });
  });

  describe(`Getting list if offers doesn't exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      dataService = new DataService([]);
      app = createAPI(dataService);
      response = await request(app).get(`/categories`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to 0`, () => {
      expect(response.body.length).toBe(0);
    });
  });
});
