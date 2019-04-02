export function disableSetting(id) {
  // const id = 'btn-reset';
  document.querySelector(`#${id}`).setAttribute("disabled", "");
  document.querySelector(`#${id}`).classList.add("disabled");
}

export function enableSetting(id) {
  // const id = 'btn-reset';
  document.querySelector(`#${id}`).removeAttribute("disabled");
  document.querySelector(`#${id}`).classList.remove("disabled");
}

export function settingsBadgeCount(id, count) {

  document.querySelector(`#${id}`).textContent=count;
}