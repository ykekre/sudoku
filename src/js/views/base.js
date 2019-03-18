export const elements = {
  'board' : document.querySelector('.board'),
  'level' : document.querySelectorAll('.level'),
   'squares': document.querySelectorAll('div.unsolved > input'),
   'board' : document.querySelector('.board'),
   'grid' : document.querySelector('.grid'),
   'numpad'  : document.querySelector('.numpad')
}

export function renderLoader(parent) {
console.log(parent, 'are we there?');
  const loader = `<div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>`


 parent.insertAdjacentHTML('afterbegin', loader);
}

export function clearLoader(){
  const loader = document.querySelector(`.spinner-border`);
  if (loader) loader.parentElement.removeChild(loader);
};