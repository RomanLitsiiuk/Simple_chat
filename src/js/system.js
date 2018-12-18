'use strict';

class System extends Mediator {
  constructor(button, wrapper) {
    super();
    this.addButton = button;
    this.wrap = wrapper;
    this.iframes = [];
  }

  checkFramesCount() {
    return this.iframes.length + 1;
  }

  addFrame(wrapper, name) {
    const frame = new IFrame(name = `iFrame${this.checkFramesCount()}`, this).renderIframe();
    this.iframes.push(frame);
    wrapper.append(frame);
    setTimeout(() => {
      this.publish('addNewIframe', frame.name);
    }, 100);
  }

  render() {
    this.addButton.addEventListener('click', () => {
      this.addFrame(this.wrap);
    });
    window.addEventListener('message', (message) => {
      if (message.data) {
        this.publish('receivedMessage', message.data);
      }
    });
  }
}
