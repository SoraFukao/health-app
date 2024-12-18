// プロフィール名を保存
function saveProfile() {
    const nicknameInput = document.getElementById('nicknameInput').value;
    if (nicknameInput) {
        localStorage.setItem('nickname', nicknameInput);
        displayProfile();
    }
}

// プロフィール名を表示
function displayProfile() {
    const nickname = localStorage.getItem('nickname');
    const profileDisplay = document.getElementById('profileDisplay');
    if (nickname) {
        profileDisplay.textContent = `現在のユーザー名: ${nickname}`;
    }
}

// セクションの表示を切り替える
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// 現在の日時を取得する関数
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

// 投稿を追加
function addPost() {
    const postInput = document.getElementById('postInput').value;
    const userName = localStorage.getItem('nickname');

    if (userName && postInput) {
        const post = {
            user: userName,
            content: postInput,
            datetime: getCurrentDateTime(),
            likedBy: [],
            responses: []
        };
        displayPost(post);
        savePost(post);
        document.getElementById('postInput').value = '';
    } else if (!userName) {
        alert("プロフィールでユーザー名を設定してください。");
    }
}

// 投稿を表示
function displayPost(post) {
    const postList = document.getElementById('postList');
    const postItem = document.createElement('li');
    postItem.className = 'post-item';

    // 投稿のユーザー名と日時を表示する部分
    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    postHeader.innerHTML = `<strong>${post.user}</strong> (${post.datetime})`;
    postItem.appendChild(postHeader);

    // 投稿内容を表示する部分
    const postContent = document.createElement('p');
    postContent.className = 'post-content';
    postContent.innerHTML = formatTextWithLineBreaks(post.content);
    postItem.appendChild(postContent);

    // いいねボタンとカウント
    const likeButton = document.createElement('button');
    likeButton.className = 'like-button';
    const currentUser = localStorage.getItem('nickname');
    post.likedBy = post.likedBy || []; // 初期化
    likeButton.textContent = `いいね (${post.likedBy.length})`;

    if (post.likedBy.includes(currentUser)) {
        likeButton.disabled = true; // すでに「いいね」している場合、ボタンを無効化
    }

    likeButton.onclick = () => {
        if (!post.likedBy.includes(currentUser)) {
            post.likedBy.push(currentUser); // 「いいね」したユーザーを記録
            likeButton.textContent = `いいね (${post.likedBy.length})`;
            likeButton.disabled = true; // ボタンを無効化
            savePostsToStorage();
        }
    };
    postItem.appendChild(likeButton);

    // 回答リスト
    const responseList = document.createElement('ul');
    post.responses.forEach(response => {
        displayResponse(response, responseList);
    });
    postItem.appendChild(responseList);

    // 回答フォーム
    const responseForm = document.createElement('div');
    responseForm.className = 'input-response';

    const responseContentInput = document.createElement('textarea');
    responseContentInput.placeholder = '回答を入力';
    responseContentInput.className = 'response-content';
    responseContentInput.rows = 4;

    const responseButton = document.createElement('button');
    responseButton.textContent = '回答';
    responseButton.onclick = () => addResponse(post, responseContentInput.value, responseList);

    responseForm.appendChild(responseContentInput);
    responseForm.appendChild(responseButton);
    postItem.appendChild(responseForm);

    postList.appendChild(postItem);
}

// 回答を追加
function addResponse(post, content, responseList) {
    const userName = localStorage.getItem('nickname');

    if (userName && content) {
        const response = {
            user: userName,
            content: content,
            datetime: getCurrentDateTime(),
            likedBy: []
        };
        post.responses.push(response);
        displayResponse(response, responseList);
        savePostsToStorage();
    } else if (!userName) {
        alert("プロフィールでユーザー名を設定してください。");
    }
}

// 回答を表示
function displayResponse(response, responseList) {
    const responseItem = document.createElement('li');
    responseItem.className = 'response';

    // 回答のユーザー名と日時を表示する部分
    const responseHeader = document.createElement('div');
    responseHeader.className = 'response-header';
    responseHeader.innerHTML = `<strong>${response.user}</strong> (${response.datetime})`;
    responseItem.appendChild(responseHeader);

    // 回答内容を表示する部分
    const responseContent = document.createElement('p');
    responseContent.className = 'response-content';
    responseContent.innerHTML = formatTextWithLineBreaks(response.content);
    responseItem.appendChild(responseContent);

    // いいねボタンとカウント
    const likeButton = document.createElement('button');
    likeButton.className = 'like-button';
    const currentUser = localStorage.getItem('nickname');
    response.likedBy = response.likedBy || []; // 初期化
    likeButton.textContent = `いいね (${response.likedBy.length})`;

    if (response.likedBy.includes(currentUser)) {
        likeButton.disabled = true; // すでに「いいね」している場合、ボタンを無効化
    }

    likeButton.onclick = () => {
        if (!response.likedBy.includes(currentUser)) {
            response.likedBy.push(currentUser); // 「いいね」したユーザーを記録
            likeButton.textContent = `いいね (${response.likedBy.length})`;
            likeButton.disabled = true; // ボタンを無効化
            savePostsToStorage();
        }
    };
    responseItem.appendChild(likeButton);

    responseList.appendChild(responseItem);
}

// 改行を <br> に変換する関数
function formatTextWithLineBreaks(text) {
    return text.replace(/\n/g, '<br>');
}

// ローカルストレージに投稿を保存
function savePost(post) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

// ローカルストレージから投稿をロード
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => displayPost(post));
}

// ローカルストレージの投稿を更新
function savePostsToStorage() {
    const posts = [];
    const postItems = document.querySelectorAll('.post-item');
    postItems.forEach(postItem => {
        const postHeader = postItem.querySelector('.post-header').innerText;
        const match = postHeader.match(/^(.+?) \((.+?)\)/);
        const user = match[1];
        const datetime = match[2];
        const content = postItem.querySelector('.post-content').innerText;
        const likeButton = postItem.querySelector('.like-button');
        const likes = parseInt(likeButton.textContent.match(/\d+/)[0]);
        const likedBy = likeButton.likedBy || [];
        const responses = [];

        const responseItems = postItem.querySelectorAll('.response');
        responseItems.forEach(responseItem => {
            const responseHeader = responseItem.querySelector('.response-header').innerText;
            const resMatch = responseHeader.match(/^(.+?) \((.+?)\)/);
            const resUser = resMatch[1];
            const resDatetime = resMatch[2];
            const resContent = responseItem.querySelector('.response-content').innerText;
            const resLikeButton = responseItem.querySelector('.like-button');
            const resLikes = parseInt(resLikeButton.textContent.match(/\d+/)[0]);
            const resLikedBy = resLikeButton.likedBy || [];
            responses.push({ user: resUser, datetime: resDatetime, content: resContent, likes: resLikes, likedBy: resLikedBy });
        });

        posts.push({ user, datetime, content, likes, likedBy, responses });
    });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// ページロード時にデータを読み込む
window.onload = function() {
    displayProfile();
    loadPosts();
};
