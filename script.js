let search = document.querySelector('.search');
let searchList = document.querySelector('.search-list');
let repos = document.querySelector('.repos');
let closeButton = document.querySelector('.button-close');
let selectedItem;

function onSearch(e) {
  document.querySelectorAll('.search-item').forEach(el => el.remove());
  
  let searchWord = e.target.value;
  fetch(`https://api.github.com/search/repositories?q=${searchWord} in:name &per_page=5 &sort=stars `)
  .then(response => response.json())
  .then(response => response.items)
  .then(repos => repos.forEach(el => {
    let repoName = el.name;
    if (repoName.length > 27) {
      repoName = repoName.substring(0, 27) + '...';
    }
    let searchItem = addElement('li', repoName, 'search-item', el.id);
    searchList.appendChild(searchItem);
  }))
}

onSearch = debounce(onSearch, 300)
search.addEventListener('keyup', onSearch);

searchList.addEventListener('mouseover', function (e) {
  let target = e.target;
  if (target.tagName != 'LI') return;
  highlight(target);
})

searchList.addEventListener('click', function (e) {
  let target = e.target;
  if (target.tagName != 'LI') return;
  fetch(`https://api.github.com/repositories/${target.id}`)
  .then(response => response.json())
  .then(response => {
    let repoItem = addElement('li', undefined, 'repos-item');
    let repoName = addElement('p', `Name: ${response.name}`);
    let repoOwner = addElement('p', `Owner: ${response.owner.login}`);
    let repoStars = addElement('p', `Stars: ${response.stargazers_count}`);
    let closeButton = addElement('button', undefined, 'button-close');
    repoItem.appendChild(repoName);
    repoItem.appendChild(repoOwner);
    repoItem.appendChild(repoStars);
    repoItem.appendChild(closeButton);
    repos.appendChild(repoItem);
    closeButton.addEventListener('click', function () {
      closeButton.parentElement.remove();
    })
  })
  search.value = '';
  document.querySelectorAll('.search-item').forEach(el => el.remove());
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