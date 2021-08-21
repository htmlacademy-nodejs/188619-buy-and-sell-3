'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);

    this._offers.push(newOffer);
    return newOffer;
  }

  drop(id) {
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  createComment(offerId, comment) {
    const offer = this.findOne(offerId);
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      text: comment.text
    };
    offer.comments.push(newComment);

    return newComment;
  }

  dropComment(offerId, commentId) {
    const offer = this.findOne(offerId);
    let comments = offer.comments;
    const deletedComment = comments.find((item) => item.id === commentId);
    offer.comments = comments.filter((item) => item.id !== commentId);
    this.update(offerId, offer);

    return deletedComment;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this._offers
      .find((item) => item.id === id);

    return Object.assign(oldOffer, offer);
  }

}

module.exports = OfferService;
