function el(selector) {
  return document.querySelector(selector);
}

function showError(container, message) {
  const box = el(container);
  if (box) {
    box.textContent = message;
    box.style.display = 'block';
  }
}
async function loadComponent(targetSelector, componentPath) {
  const res = await fetch(componentPath);
  const html = await res.text();
  document.querySelector(targetSelector).innerHTML = html;
}