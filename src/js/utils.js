'use strict';

function createTag(tagType, ...classList) {
  const tag = document.createElement(tagType);
  for (let i = 0; i < classList.length; i++) {
    tag.classList.add(classList[i] || null);
  }
  return tag;
}

class Mediator {
  constructor() {
    this.subcribers = {};
  }

  subscribe(event, callback) {
    this.subcribers[event] = this.subcribers[event] || [];
    this.subcribers[event].push(callback);
  }

  unsubscribe(event, callback) {
    let subscriberIndex;

    if (!event) {
      this.subcribers = {};
    } else if (event && !callback) {
      this.subcribers[event] = [];
    } else {
      subscriberIndex = this.subcribers[event].indexOf(callback);
      if (subscriberIndex > -1) {
        this.subcribers[event].splice(subscriberIndex, 1);
      }
    }
  }

  publish(event, data) {
    if (this.subcribers[event]) {
      this.subcribers[event].forEach((callback) => {
        callback(data);
      });
    }
  }
}

