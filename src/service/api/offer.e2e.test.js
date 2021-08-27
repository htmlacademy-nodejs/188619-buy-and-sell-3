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

const createAPI = (service) => {
  const app = express();
  app.use(express.json());
  offer(app, service);
  return app;
};

describe(`Posting new offer`, () => {
  describe(`Posting offer with valid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const newOffer = {
      category: `Котики`,
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      type: `OFFER`,
      sum: 100500,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).post(`/offers`).send(newOffer);
    });

    test(`Status code should be 201 `, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`API returns created offer`, () => {
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });

    test(`Offer created in data service`, () => {
      expect(dataService.findOne(response.body.id)).toMatchObject(newOffer);
    });
  });

  describe(`Posting offer with invalid data`, () => {
    let app = null;
    let dataService = null;

    const newOffer = {
      category: `Котики`,
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      type: `OFFER`,
      sum: 100500,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
    });

    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];

      test(`Posting invalid offer without ${key} should return 400`, async () => {
        const response = await request(app).post(`/offers`).send(badOffer);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      test(`Invalid offer without ${key} should not be in data`, async () => {
        await request(app).post(`/offers`).send(badOffer);
        expect(dataService.findAll()).not.toContain(badOffer);
      });

      test(`Offers count should not increase`, async () => {
        await request(app).post(`/offers`).send(badOffer);
        expect(dataService.findAll().length).toBe(5);
      });
    }
  });
});

describe(`Getting list of all offers`, () => {
  describe(`Getting list if offers exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/offers`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to data offers length`, () => {
      expect(response.body.length).toBe(cloneData.length);
    });

    test(`First offer id is equal to ${cloneData[0].id}`, () => {
      expect(response.body[0].id).toBe(cloneData[0].id);
    });
  });

  describe(`Getting list if offers doesn't exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      dataService = new DataService([]);
      app = createAPI(dataService);
      response = await request(app).get(`/offers`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to 0`, () => {
      expect(response.body.length).toBe(0);
    });
  });
});

describe(`Getting offer with given id`, () => {
  describe(`If offer with given id exists`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/offers/vW8jPO`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns correct offer`, () => {
      expect(response.body).toEqual(dataService.findOne(`vW8jPO`));
    });
  });

  describe(`If offer with given id does not exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/offers/NOTEXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Does not return any offer`, () => {
      expect(dataService.findAll()).not.toContain(response.body);
    });
  });
});

describe(`Changing an offer`, () => {
  describe(`Changing existent offer with valid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));
    const newOffer = {
      category: `Котики`,
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      type: `OFFER`,
      sum: 100500,
    };

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).put(`/offers/vW8jPO`).send(newOffer);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns changed offer`, () => {
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });

    test(`Offer in data is changed`, () => {
      expect(dataService.findOne(`vW8jPO`)).toEqual(
          expect.objectContaining(newOffer)
      );
    });
  });

  describe(`Changing offer with invalid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));
    const invalidOffer = {
      category: `Это`,
      title: `невалидный`,
      description: `объект`,
      picture: `объявления`,
      type: `нет поля sum`,
    };

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).put(`/offers/vW8jPO`).send(invalidOffer);
    });

    test(`Status code should be 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Does not return changed offer`, () => {
      expect(response.body).not.toEqual(expect.objectContaining(invalidOffer));
    });

    test(`Offer in data didn't change`, () => {
      expect(dataService.findOne(`vW8jPO`)).not.toEqual(
          expect.objectContaining(invalidOffer)
      );
    });
  });

  describe(`Changing not existent offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));
    const newOffer = {
      category: `Котики`,
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      type: `OFFER`,
      sum: 100500,
    };

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).put(`/offers/NOT_EXIST`).send(newOffer);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Deleting an offer`, () => {
  describe(`Deleting existent offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/offers/vW8jPO`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted offers removes from data`, () => {
      expect(dataService.findAll()).not.toContain(response.body);
    });

    test(`Returns correct offer`, () => {
      expect(response.body.id).toEqual(`vW8jPO`);
    });
  });

  describe(`Deleting non-existent offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/offers/NOT_EXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Getting offer comments`, () => {
  describe(`Getting comments of exist offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/offers/vW8jPO/comments`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns all comments`, () => {
      expect(response.body).toEqual(dataService.findOne(`vW8jPO`).comments);
    });
  });

  describe(`Getting comments of non-exist offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/offers/NON_EXIST/comments`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Posting offer comment`, () => {
  describe(`Posting comment with valid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const newComment = {
      text: `Почему так дорого? Сделаете скидку?`,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app)
        .post(`/offers/vW8jPO/comments`)
        .send(newComment);
    });

    test(`Status code should be 201 `, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`API returns created comment`, () => {
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });

    test(`Comment created in data service`, () => {
      expect(dataService.findOne(`vW8jPO`).comments).toEqual(
          expect.arrayContaining([expect.objectContaining(newComment)])
      );
    });
  });

  describe(`Posting comment with invalid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const invalidComment = {
      invalidKey: `Почему так дорого? Сделаете скидку?`,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app)
        .post(`/offers/vW8jPO/comments`)
        .send(invalidComment);
    });

    test(`Status code should be 400 `, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Comment isn't created in data service`, () => {
      expect(dataService.findOne(`vW8jPO`).comments).not.toEqual(
          expect.arrayContaining([expect.objectContaining(invalidComment)])
      );
    });
  });

  describe(`Posting comment to non-exist offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const newComment = {
      text: `Почему так дорого? Сделаете скидку?`,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app)
        .post(`/offers/NOT_EXIST/comments`)
        .send(newComment);
    });

    test(`Status code should be 404 `, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Deleting an offer comment`, () => {
  describe(`Deleting existent comment`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/offers/vW8jPO/comments/9DqiBv`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted comment removes from data`, () => {
      expect(dataService.findOne(`vW8jPO`).comments).not.toEqual(
          expect.arrayContaining([expect.objectContaining({id: `9DqiBv`})])
      );
    });

    test(`Returns correct offer`, () => {
      expect(response.body.id).toEqual(`9DqiBv`);
    });
  });

  describe(`Deleting non-existent comment`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/offers/vW8jPO/comments/NOT_EXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
