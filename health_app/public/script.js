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

// 目標を追加
function addGoal() {
    const goalInput = document.getElementById('goalInput');
    const goalText = goalInput.value;
    if (goalText) {
        const goal = {
            text: goalText,
            progress: 0,
            completed: false
        };
        displayGoal(goal);
        saveGoal(goal);
        goalInput.value = '';
    }
}

// 目標を表示
function displayGoal(goal) {
    const goalList = document.getElementById('goalList');
    const listItem = document.createElement('li');
    listItem.className = 'goal-item';
    
    const goalText = document.createElement('span');
    goalText.textContent = goal.text;
    goalText.className = 'goal-text';
    listItem.appendChild(goalText);


    // 進捗バー
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    const progress = document.createElement('div');
    progress.className = 'progress';
    progress.style.width = `${goal.progress}%`;
    progressBar.appendChild(progress);
    listItem.appendChild(progressBar);

    // 進捗 +10% ボタン
    const incrementButton = document.createElement('button');
    incrementButton.className = 'increment-button';
    incrementButton.textContent = '進捗 +10%';
    incrementButton.onclick = () => updateProgress(goal, progress, listItem);
    listItem.appendChild(incrementButton);


    // 編集ボタン
    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = '編集';
    editButton.onclick = () => editGoal(goal, goalText);
    listItem.appendChild(editButton);

    // 達成ボタン
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = '達成';
    completeButton.onclick = () => completeGoal(goal, listItem);
    listItem.appendChild(completeButton);

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '削除';
    deleteButton.onclick = () => deleteGoal(goal, listItem);
    listItem.appendChild(deleteButton);

    goalList.appendChild(listItem);
}

// 進捗度を更新
function updateProgress(goal, progressElement, listItem) {
    if (goal.progress < 100 && !goal.completed) {
        goal.progress += 10;
        if (goal.progress > 100) goal.progress = 100;
        progressElement.style.width = `${goal.progress}%`;
        saveGoalsToStorage();
    }
}

// 目標を達成
function completeGoal(goal, listItem) {
    goal.completed = true;
    listItem.classList.add('goal-completed');
    saveGoalsToStorage();
}

// 目標を編集
function editGoal(goal, goalTextElement) {
    const newGoalText = prompt("新しい目標を入力してください:", goal.text);
    if (newGoalText !== null && newGoalText.trim() !== "") {
        goal.text = newGoalText.trim();
        goalTextElement.textContent = goal.text;
        saveGoalsToStorage();
    }
}

// 目標を削除
function deleteGoal(goal, listItem) {
    listItem.remove();
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals = goals.filter(g => g.text !== goal.text);
    localStorage.setItem('goals', JSON.stringify(goals));
}

// ローカルストレージに目標を保存
function saveGoal(goal) {
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
}

// ローカルストレージに保存されている目標をロード
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.forEach(goal => displayGoal(goal));
}

// ローカルストレージ内の目標を更新
function saveGoalsToStorage() {
    const goals = [];
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach(item => {
        const text = item.querySelector('span').textContent;
        const progress = parseInt(item.querySelector('.progress').style.width);
        const completed = item.classList.contains('goal-completed');
        goals.push({ text, progress, completed });
    });
    localStorage.setItem('goals', JSON.stringify(goals));
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
            responses: []
        };
        displayPost(post);
        savePost(post);
        document.getElementById('postInput').value = '';
    } else if (!userName) {
        alert("プロフィールでユーザー名を設定してください。");
    }
}

// 改行を <br> に変換する関数
function formatTextWithLineBreaks(text) {
    return text.replace(/\n/g, '<br>');
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

    // 投稿内容を表示する部分（改行して表示）
    const postContent = document.createElement('p');
    postContent.className = 'post-content';
    postContent.innerHTML = formatTextWithLineBreaks(post.content);
    postItem.appendChild(postContent);

     // いいねボタンとカウント
     const likeButton = document.createElement('button');
     likeButton.className = 'like-button';
     likeButton.textContent = `いいね (${post.likes || 0})`;
     likeButton.onclick = () => {
         post.likes = (post.likes || 0) + 1;
         likeButton.textContent = `いいね (${post.likes})`;
         savePostsToStorage();
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
            datetime: getCurrentDateTime()
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

    // 回答内容を表示する部分（改行して表示）
    const responseContent = document.createElement('p');
    responseContent.className = 'response-content';
    responseContent.innerHTML = formatTextWithLineBreaks(response.content);
    responseItem.appendChild(responseContent);

    // いいねボタンとカウント
    const likeButton = document.createElement('button');
    likeButton.className = 'like-button';
    likeButton.textContent = `いいね (${response.likes || 0})`;
    likeButton.onclick = () => {
        response.likes = (response.likes || 0) + 1;
        likeButton.textContent = `いいね (${response.likes})`;
        savePostsToStorage();
    };
    responseItem.appendChild(likeButton);

    responseList.appendChild(responseItem);
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
        const likes = parseInt(postItem.querySelector('.like-button').textContent.match(/\d+/)[0]);
        const responses = [];

        const responseItems = postItem.querySelectorAll('.response');
        responseItems.forEach(responseItem => {
            const responseHeader = responseItem.querySelector('.response-header').innerText;
            const resMatch = responseHeader.match(/^(.+?) \((.+?)\)/);
            const resUser = resMatch[1];
            const resDatetime = resMatch[2];
            const resContent = responseItem.querySelector('.response-content').innerText;
            const resLikes = parseInt(responseItem.querySelector('.like-button').textContent.match(/\d+/)[0]);
            responses.push({ user: resUser, datetime: resDatetime, content: resContent, likes: resLikes });
        });

        posts.push({ user, content, datetime, likes, responses });
    });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// ページロード時にデータを読み込む
window.onload = function() {
    displayProfile();
    loadGoals();
    loadPosts();
};

// 目標をサーバーから取得
async function loadGoalsFromServer() {
    const response = await fetch('http://localhost:5000/api/goals');
    const goals = await response.json();
    goals.forEach(goal => displayGoal(goal));
}

// 目標をサーバーに追加
async function addGoalToServer(goal) {
    const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
    });
    const newGoal = await response.json();
    displayGoal(newGoal);
}

// フロントエンドでの目標追加時にサーバーと同期
function addGoal() {
    const goalInput = document.getElementById('goalInput');
    const goalText = goalInput.value;
    if (goalText) {
        const goal = { id: Date.now().toString(), text: goalText, progress: 0, completed: false };
        addGoalToServer(goal); // サーバーに追加
        goalInput.value = '';
    }
}

// ページロード時にサーバーからデータを取得
window.onload = function() {
    displayProfile();
    loadGoalsFromServer();
    loadPostsFromServer(); // 同様に投稿データもロード
};