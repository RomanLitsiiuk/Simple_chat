class IFrame {
  constructor(name, system) {
    this.name = name;
    this.system = system;
    this.createTag = createTag;
    this.frame = this.createTag('iframe', 'iframe');
    this.chat = null;
    this.isOwnMessage = false;
  }

  clearChat() {
    while (+this.chat.offsetHeight > 170) {
      this.chat.removeChild(this.chat.children[0]);
    }
  }

  listenMessages() {
    this.system.subscribe('receivedMessage', (data) => {
      const message = this.createTag('p', 'iframe__text');
      message.append(data.message);
      if (data.type === 'system') {
        message.classList.add('iframe__text--system');
      } else if (this.isOwnMessage) {
        message.classList.add('iframe__text--own');
        this.isOwnMessage = false;
      }
      this.chat.appendChild(message);
      this.clearChat();
    });
  }

  activateDragable(element) {
    element.ondragstart = () => {
      return false;
    };
    element.onmousedown = (event) => {
      if (event.target.classList.contains('iframe__input') ||
        event.target.classList.contains('iframe__send') ||
        event.target.classList.contains('iframe__close')) {
        return;
      }
      this.frame.style.left = this.frame.offsetLeft + 'px';
      this.frame.style.top = this.frame.offsetTop + 'px';
      this.frame.classList.add('iframe--drag');
      this.frame.style.zIndex = 999;
      this.frame.contentWindow.onmousemove = (e) => {
        this.frame.style.left = parseInt(this.frame.style.left, 10) + e.pageX - event.pageX + 'px';
        this.frame.style.top = parseInt(this.frame.style.top, 10) + e.pageY - event.pageY + 'px';
      };
      this.frame.contentWindow.onmouseup = () => {
        this.frame.contentWindow.onmousemove = null;
        this.frame.contentWindow.onmouseup = null;
        this.frame.style.zIndex = 100;
      };
    };
  }

  renderIframe() {
    this.frame.setAttribute('name', `${this.name}`);
    this.frame.setAttribute('scrolling', 'no');
    const cssLink = this.createTag('link');
    cssLink.setAttribute('href', './css/app.min.css');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('type', 'text/css');
    this.frame.onload = () => {
      const iframeDoc = this.frame.contentWindow.document;
      iframeDoc.head.appendChild(cssLink);
      const chat = this.createTag('div', 'iframe__chat');
      const close = this.createTag('div', 'iframe__close');
      const heading = this.createTag('h3', 'iframe__text', 'iframe__text--heading');
      const messages = this.createTag('div', 'iframe__content');
      this.chat = messages;
      const inputWrap = this.createTag('div', 'iframe__input-wrap');
      const label = this.createTag('label', 'iframe__label');
      const input = this.createTag('input', 'iframe__input');
      input.setAttribute('type', 'text');
      const send = this.createTag('button', 'iframe__send');
      send.setAttribute('type', 'button');
      send.append('send');
      heading.append('Chat: ');
      iframeDoc.body.appendChild(chat).appendChild(heading);
      chat.appendChild(messages);
      chat.appendChild(close);
      iframeDoc.body.appendChild(inputWrap).appendChild(label);
      label.append(`[${this.name}]: `);
      label.appendChild(input);
      inputWrap.appendChild(send);
      send.addEventListener('click', () => {
        this.frame.contentWindow.parent.postMessage(`[${this.name}] - ${input.value}`, '*');
        this.isOwnMessage = true;
      });
      close.addEventListener('click', () => {
        this.frame.contentWindow.parent.postMessage({remove: this.name}, '*');
      });
      this.activateDragable(iframeDoc.body);
    };
    if (this.system) {
      this.listenMessages();
    }
    return this.frame;
  }
}
