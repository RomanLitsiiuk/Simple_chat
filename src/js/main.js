'use strict';

const iframes = [];

function checkFrameCount() {
  return iframes.length + 1;
}

function renderIframe(name = `iFrame${checkFrameCount()}`) {
  const frame = createTag('iframe', 'iframe');
  frame.setAttribute('name', `${name}`);
  frame.setAttribute('scrolling', 'no');
  const cssLink = createTag('link');
  cssLink.setAttribute('href', './css/app.min.css');
  cssLink.setAttribute('rel', 'stylesheet');
  cssLink.setAttribute('type', 'text/css');
  frame.onload = () => {
    const iframeDoc = frame.contentWindow.document;
    iframeDoc.head.appendChild(cssLink);
    const chat = createTag('div', 'iframe__chat');
    const heading = createTag('h3', 'iframe__text', 'iframe__text--heading');
    const text1 = createTag('p', 'iframe__text');
    const text2 = createTag('p', 'iframe__text');
    const inputWrap = createTag('div', 'iframe__input-wrap');
    const label = createTag('label', 'iframe__label');
    const input = createTag('input', 'iframe__input');
    input.setAttribute('type', 'text');
    const send = createTag('button', 'iframe__send');
    send.setAttribute('type', 'button');
    send.append('send');
    heading.append('Chat: ');
    text1.append('[system] - iframe1 joined the conversation');
    text2.append('[iFrame2] - who wants to come play soccer?');
    iframeDoc.body.appendChild(chat).appendChild(heading);
    chat.appendChild(text1);
    chat.appendChild(text2);
    iframeDoc.body.appendChild(inputWrap).appendChild(label);
    label.append(`[${name}]: `);
    label.appendChild(input);
    inputWrap.appendChild(send);
    iframes.push(frame);
    send.addEventListener('click', () => {
      frame.contentWindow.parent.postMessage(`[${name}] - ${input.value}`);
    });
  };
  return frame;
}

function addFrame(wrapper) {
  const frame = renderIframe();
  wrapper.append(frame);
}

function renderPage() {
  const addButton = document.querySelector('.button--add');
  const wrap = document.querySelector('.chat-frame__field');
  addButton.addEventListener('click', () => {
    addFrame(wrap);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPage();
  window.addEventListener('message', (message) => {
    console.log(message);
  });
});

