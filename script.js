let search = document.querySelector('.search');
let searchList = document.querySelector('.search-list');
let repos = document.querySelector('.repos');
let closeButton = document.querySelector('.button-close');
let selectedItem;
let resultArray;

async function onSearch(e) {
  clear();
  let searchWord = e.target.value.trim();
  if (!searchWord) return;
  try {
    resultArray = await makeRequest (searchWord);
    if (resultArray.length === 0) {
      searchList.insertAdjacentElement('afterend', addElement('p', 'Nothing was found', 'warning'))
    }
    await createSearchList(resultArray);
  } catch {
    searchList.insertAdjacentElement('afterend', addElement('p', 'Nothing was found', 'warning'))
  }
}

onSearch = debounce(onSearch, 400)
search.addEventListener('keyup', onSearch);

searchList.addEventListener('mouseover', function (e) {
  let target = e.target;
  if (target.tagName != 'LI') return;
  highlight(target);
})

searchList.addEventListener('click', function (e) {
  let target = e.target;
  if (target.tagName != 'LI') return;

  let repoItem = addElement(
    'li',
    `<p>Name: ${resultArray[target.id-1].name}</p><br>
    <p>Owner: ${resultArray[target.id-1].owner.login}</p><br>
    <p>Stars: ${resultArray[target.id-1].stargazers_count}</p>`,
    'repos-item');
  let closeButton = addElement('button', undefined, 'button-close');
  repoItem.insertAdjacentElement('beforeEnd', closeButton);
  repos.insertAdjacentElement('beforeEnd', repoItem);
  
  search.value = '';
  clear();
})

document.addEventListener('click', function(e) {
  if (e.target.className != 'button-close') return;
  e.target.parentElement.remove();
})

async function clear() {
  document.querySelectorAll('.warning').forEach(el => el.remove());
  document.querySelectorAll('.search-item').forEach(el => el.remove());
}

async function makeRequest (needed) {
  let response = await fetch(`https://api.github.com/search/repositories?q=${needed} in:name &per_page=5 &sort=stars `);
  let responseJson = await response.json();
  return resultArray = await responseJson.items;
}

function debounce (fn, debounceTime) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  }
};

function highlight(item) {
  if (selectedItem) {
    selectedItem.classList.remove('highlight');
  }
  selectedItem = item;
  selectedItem.classList.add('highlight');
}

function addElement(tagName, content, tagClass, tagId) {
  let element = document.createElement(tagName);
  if (tagClass) element.classList.add(tagClass);
  if (tagId) element.setAttribute('id', tagId);
  if (content) element.insertAdjacentHTML ('beforeEnd', content);
  return element;
}

function createSearchList(arr) {
  let i = 1;
  for (const el of arr) {
    let repoName = el.name;
    if (repoName.length > 27) {
      repoName = repoName.substring(0, 27) + '...';
    }
    let searchItem = addElement('li', repoName, 'search-item', i);
    searchList.insertAdjacentElement ('beforeEnd', searchItem);
    i++;
  }
}

