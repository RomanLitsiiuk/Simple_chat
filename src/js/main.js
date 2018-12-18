'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.querySelector('.button--add');
  const wrap = document.querySelector('.chat-frame__field');
  const system = new System(addButton, wrap).render();
});

