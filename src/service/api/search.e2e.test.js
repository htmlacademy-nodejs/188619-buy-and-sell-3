"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {HttpCode} = require(`../../constants`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);

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

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам книги Стивена Кинга`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`jOcKaK`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);
