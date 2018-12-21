'use strict';

class System extends Mediator {
  constructor(button, wrapper, nameField) {
    super();
    this.addButton = button;
    this.wrap = wrapper;
    this.nameField = nameField;
    this.iframes = [];
    this.invalidName = false;
  }

  generateName() {
    const lastNumber = this.iframes.reduce((prev, frame) => {
      if (frame.name.indexOf('iFrame') === -1) {
        return prev;
      }
      const number = parseInt(+frame.name.slice(frame.name.indexOf('e') + 1), 10);
      return number > prev ? number : prev;
    }, 0);
    return `iFrame${lastNumber + 1}`;
  }

  addFrame(wrapper, name) {
    this.generateName();
    const frame = new IFrame(name || this.generateName(), this).renderIframe();
    this.iframes.push(frame);
    wrapper.append(frame);
    setTimeout(() => {
      this.publish('receivedMessage', {
        message: `[system]: ${frame.name} joined the conversation`,
        type: 'system'
      });
    }, 300);
  }

  removeFrame(name) {
    const deleted = this.iframes.find((frame) => {
      return frame.name === name;
    });
    this.iframes.splice(this.iframes.indexOf(deleted), 1);
    this.wrap.removeChild(deleted);
    this.publish('receivedMessage', {
      message: `[system]: ${name} left this conversation`,
      type: 'system'
    });
  }

  static showValidationField(errorField, validStatus) {
    validStatus ? errorField.classList.add('error--active') : errorField.classList.remove('error--active');
  }

  validate(name) {
    this.invalidName = this.iframes.some((frame) => {
      return frame.name === name;
    });
    return this.invalidName;
  }

  render() {
    const error = document.querySelector('.error');
    this.nameField.addEventListener('input', () => {
      System.showValidationField(error, this.validate(this.nameField.value.trim()));
    });
    this.addButton.addEventListener('click', () => {
      System.showValidationField(error, this.validate(this.nameField.value.trim()));
      if (!this.validate(this.nameField.value.trim())) {
        this.addFrame(this.wrap, this.nameField.value.trim());
      }
    });
    window.addEventListener('message', (message) => {
      if (message.data && typeof message.data !== 'object') {
        this.publish('receivedMessage', {
          message: message.data,
          type: 'user'
        });
      } else if (message.data.hasOwnProperty('remove')) {
        this.removeFrame(message.data.remove);
      }
    });
  }
}
