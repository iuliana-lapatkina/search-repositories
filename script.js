let search = document.querySelector('.search');
let searchList = document.querySelector('.search-list');
let repos = document.querySelector('.repos');
let closeButton = document.querySelector('.button-close');
let selectedItem;
let resultArray;

async function onSearch(e) {
  document.querySelectorAll('.warning').forEach(el => el.remove());
  document.querySelectorAll('.search-item').forEach(el => el.remove());
  
  try {
    let searchWord = e.target.value;
    let response = await fetch(`https://api.github.com/search/repositories?q=${searchWord} in:name &per_page=5 &sort=stars `);
    let responseJson = await response.json();
    resultArray = await responseJson.items;
    let i = 1;
    for (const el of resultArray) {
      let repoName = el.name;
      if (repoName.length > 27) {
        repoName = repoName.substring(0, 27) + '...';
      }
      let searchItem = addElement('li', repoName, 'search-item', i);
      searchList.appendChild(searchItem);
      i++;
    }
  } catch {
    searchList.insertAdjacentHTML('afterend', '<p class="warning">Error! Please, try again</p>')
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

  let repoItem = addElement('li', undefined, 'repos-item');
  let repoName = addElement('p', `Name: ${resultArray[target.id-1].name}`);
  let repoOwner = addElement('p', `Owner: ${resultArray[target.id-1].owner.login}`);
  let repoStars = addElement('p', `Stars: ${resultArray[target.id-1].stargazers_count}`);
  let closeButton = addElement('button', undefined, 'button-close');
  repoItem.appendChild(repoName);
  repoItem.appendChild(repoOwner);
  repoItem.appendChild(repoStars);
  repoItem.appendChild(closeButton);
  repos.appendChild(repoItem);
  closeButton.addEventListener('click', function () {
    closeButton.parentElement.remove();
  })

  search.value = '';
  document.querySelectorAll('.search-item').forEach(el => el.remove());
  document.querySelectorAll('.warning').forEach(el => el.remove());
})

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
  if (content) element.textContent = content;
  return element;
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