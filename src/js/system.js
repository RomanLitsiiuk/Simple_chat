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

  checkFramesCount() {
    return this.iframes.length + 1;
  }

  addFrame(wrapper, name) {
    const frame = new IFrame(name || `iFrame${this.checkFramesCount()}`, this).renderIframe();
    this.iframes.push(frame);
    wrapper.append(frame);
    setTimeout(() => {
      this.publish('receivedMessage', {
        message: `[system]: ${frame.name} joined the conversation`,
        type: 'system'
      });
    }, 300);
  }

  checkNewName() {
    const error = document.querySelector('.error');
    this.nameField.addEventListener('input', () => {
      this.invalidName = this.iframes.some((frame) => {
        return frame.name === this.nameField.value.trim();
      });
      this.invalidName ? error.classList.add('error--active') : error.classList.remove('error--active');
    });
  }

  removeFrame(name) {
    const deleted = this.iframes.find((frame) => {
      if (frame) {
        return frame.name === name;
      }
    });
    this.iframes.splice(this.iframes.indexOf(deleted), 0, null);
    this.wrap.removeChild(deleted);
    this.publish('receivedMessage', {
      message: `[system]: ${name} left this conversation`,
      type: 'system'
    });
  }

  render() {
    this.checkNewName();
    this.addButton.addEventListener('click', () => {
      if (!this.invalidName) {
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
