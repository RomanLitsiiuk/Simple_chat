'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.querySelector('.button--add');
  const wrap = document.querySelector('.chat-frame__field');
  const nameField = document.querySelector('.new-name__input');
  const system = new System(addButton, wrap, nameField).render();
});

