class IFrame {
  constructor(name, system) {
    this.name = name;
    this.system = system;
    this.createTag = createTag;
    this.frame = this.createTag('iframe', 'iframe');
    this.chat = null;
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
      const heading = this.createTag('h3', 'iframe__text', 'iframe__text--heading');
      const messages = this.createTag('div', 'iframe__content');
      this.chat = messages;
      /*const text1 = this.createTag('p', 'iframe__text');
      const text2 = this.createTag('p', 'iframe__text');*/
      const inputWrap = this.createTag('div', 'iframe__input-wrap');
      const label = this.createTag('label', 'iframe__label');
      const input = this.createTag('input', 'iframe__input');
      input.setAttribute('type', 'text');
      const send = this.createTag('button', 'iframe__send');
      send.setAttribute('type', 'button');
      send.append('send');
      heading.append('Chat: ');
      /*text1.append('[system] - iframe1 joined the conversation');
      text2.append('[iFrame2] - who wants to come play soccer?');*/
      iframeDoc.body.appendChild(chat).appendChild(heading);
      chat.appendChild(messages);
      iframeDoc.body.appendChild(inputWrap).appendChild(label);
      label.append(`[${this.name}]: `);
      label.appendChild(input);
      inputWrap.appendChild(send);
      send.addEventListener('click', () => {
        this.frame.contentWindow.parent.postMessage(`[${this.name}] - ${input.value}`);
      });
    };
    if (this.system) {
      this.listenMessages();
    }
    return this.frame;
  }
  
  clearChat() {
    while (+this.chat.offsetHeight > 170) {
      console.log(this.chat.children);
    }
  }

  listenMessages() {
    this.system.subscribe('receivedMessage', (data) => {
      const message = this.createTag('p', 'iframe__text');
      message.append(data);
      this.chat.appendChild(message);
      this.clearChat();
    });
    this.system.subscribe('addNewIframe', (data) => {
      const message = this.createTag('p', 'iframe__text', 'iframe__text--system');
      message.append(`[system]: ${data} joined the conversation`);
      message.fontWeight = 'bold';
      this.chat.appendChild(message);
      this.clearChat();
    });
  }
}
