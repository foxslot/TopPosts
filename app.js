console.log('worked');

const posts = [];
let nextId = 1;

const rootEl = document.querySelector('#root');

//создание формы добавления поста
const addFormEl = document.createElement('form');
rootEl.appendChild(addFormEl);

const groupForm = addElement('div', 'form-row', addFormEl);
const groupInput = addElement('div', 'form-group col-md-7', groupForm);
const groupSelectButton = addElement('div', 'form-group col-md-3', groupForm);
const groupButton = addElement('div', 'form-group col-md-2', groupForm);

const inputEl = addElement('input', 'form-control my-2 mr-sm-2', groupInput);
inputEl.placeholder = 'Введите ссылку';
inputEl.setAttribute('data-id', 'link');

const selectEl = addElement('select', 'custom-select my-2 mr-sm-2', groupSelectButton);
selectEl.setAttribute('data-id', 'type');

const addEl = addElement('button', 'btn btn-primary my-2 mr-sm-2', groupButton);
addEl.textContent = 'Добавить';


const linkEl = addFormEl.querySelector('[data-id=link]');
const typeEl = addFormEl.querySelector('[data-id=type]');
//

const postsEl = document.createElement('div');

postsEl.dataset.id = 'messages';
rootEl.appendChild(postsEl);

addEl.addEventListener('click', function (ev) {
    ev.preventDefault();

    const type = typeEl.value;
    const value = linkEl.value;

    const post = {
        linkContent: value,
        typeContent: type,
        id: nextId,
        content: `Новое сообщение с id ${nextId}`,
        favorite: false,
        selected: false,
        likes: 0,
    };

    linkEl.value = '';
    typeEl.value = 'regular';

    posts.push(post);

    postEl = rebuildLists(postsEl, posts)

    nextId++;
});

function rebuildLists(containerEl, items) {

    containerEl.innerHTML = '';

    items.sort((a,b) => {return b.likes-a.likes});

    for (const item of items) {

        //создание карточки
        const postEl = addElement('div', 'card my-2 mr-sm-2', containerEl);
        postEl.dataset.id = item.id;
        postEl.dataset.likes = item.likes;
        
        if (item.typeContent === 'regular') {

            //пост с текстом
            const textEl = addElement('h5', 'card-text ml-3', postEl);
            textEl.textContent = item.linkContent;

            captionPost = 'Пост с текстом';

        } else if (item.typeContent === 'image') {

            //пост с изображением
            const imgEl = addElement('img', 'card-img-top', postEl);
            imgEl.src = item.linkContent;

            captionPost = 'Пост с изображением';

        } else if (item.typeContent === 'audio') {

            //пост с аудио
            const audioScr = addElement('audio', 'card-img-top', postEl);
            audioScr.src = item.linkContent;
            audioScr.controls = true;

            captionPost = 'Пост с аудио';

        } else if (item.typeContent === 'video') {

            //пост с видео
            const videoScr = addElement('video', 'embed-responsive-item', postEl);
            videoScr.src = item.linkContent;
            videoScr.controls = true;

            captionPost = 'Пост с видео';

        } else {

            // пост со спамом
            const textEl = addElement('p', 'card-text', postEl);
            textEl.textContent = 'Спам';

            captionPost = 'Пост со спамом';

        };

        //область под контентом
        const postBodyEl = addElement('div', 'card-body', postEl);

        //подпись под контентом
        const postContentEl = addElement('p', 'card-text', postBodyEl);
        postContentEl.textContent = captionPost;

        //лайки        
        const likesEl = addElement('button', 'btn btn-primary', postBodyEl);
        likesEl.textContent = '❤ ' + item.likes;
        likesEl.dataset.action = 'add-like';

        //дизлайки как уменьшение лайков
        const dislikesEl = addElement('button', 'btn btn-primary ml-2', postBodyEl);
        dislikesEl.textContent = '👎';
        dislikesEl.dataset.action = 'add-dislike';

        //избранное
        const favoriteButtonEl = addElement('button', 'btn btn-primary ml-2', postBodyEl);
        favoriteButtonEl.textContent = '✰';
        favoriteButtonEl.dataset.action = 'toggle-favorite';

        //кнопка удалить
        const deleteButtonEl = addElement('button', 'btn btn-primary ml-2', postBodyEl);
        deleteButtonEl.textContent = '✘';
        deleteButtonEl.dataset.action = 'remove';

        addEventsEl(postEl, containerEl, item, items);
    }
    
};

//функция добавления элементов по имени тега, 
function addElement(tagNameEl, classNameEl, parrentElementEl) {

    itemEl = document.createElement(tagNameEl);
    itemEl.className = classNameEl;
    parrentElementEl.appendChild(itemEl);

    if (classNameEl === 'custom-select my-2 mr-sm-2' || tagNameEl === 'select') {
        itemEl.setAttribute('data-id', 'type');

        const optRegular = document.createElement('option');
        optRegular.value = 'regular';
        optRegular.textContent = 'Обычный';
        itemEl.appendChild(optRegular);

        const optImage = document.createElement('option');
        optImage.value = 'image';
        optImage.textContent = 'Изображение';
        itemEl.appendChild(optImage);

        const optAudio = document.createElement('option');
        optAudio.value = 'audio';
        optAudio.textContent = 'Аудио';
        itemEl.appendChild(optAudio);

        const optVideo = document.createElement('option');
        optVideo.value = 'video';
        optVideo.textContent = 'Видео';
        itemEl.appendChild(optVideo);

    };

    return itemEl;

}

function addEventsEl(itemPostEl, containerPosts, itemPost, itemsPosts){

    itemPostEl.addEventListener('click', function (ev) {

        if (ev.target.dataset.action === 'toggle-favorite') {
            ev.currentTarget.classList.toggle('message_favorite');
            return;
        }

        if (ev.target.dataset.action === 'remove') {
            const indexEl = posts.findIndex(item => item.id === Number(this.dataset.id));
            posts.splice(indexEl, 1);
            rebuildLists(containerPosts, itemsPosts);            
            return;
        }

        if (ev.target.dataset.action === 'add-like') {
            itemPost.likes++;
            rebuildLists(containerPosts, itemsPosts);
            return;
        }

        if (ev.target.dataset.action === 'add-dislike') {
           itemPost.likes--;
           rebuildLists(containerPosts, itemsPosts);
            return;
        }

        ev.currentTarget.classList.toggle('message_selected');
    });

}

