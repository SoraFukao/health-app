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
            id: Date.now().toString(),
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

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    const progress = document.createElement('div');
    progress.className = 'progress';
    progress.style.width = `${goal.progress}%`;
    progressBar.appendChild(progress);
    listItem.appendChild(progressBar);

    const incrementButton = document.createElement('button');
    incrementButton.className = 'increment-button';
    incrementButton.textContent = '進捗 +10%';
    incrementButton.onclick = () => updateProgress(goal, progress, listItem);
    listItem.appendChild(incrementButton);

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = '編集';
    editButton.onclick = () => editGoal(goal, goalText);
    listItem.appendChild(editButton);

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = '達成';
    completeButton.onclick = () => completeGoal(goal, listItem);
    listItem.appendChild(completeButton);

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
    goals = goals.filter(g => g.id !== goal.id);
    localStorage.setItem('goals', JSON.stringify(goals));
}

// ローカルストレージに目標を保存
function saveGoal(goal) {
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
}

// ローカルストレージから目標をロード
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.forEach(goal => displayGoal(goal));
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
            responses: [],
            likes: 0
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

    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    postHeader.innerHTML = `<strong>${post.user}</strong> (${post.datetime})`;
    postItem.appendChild(postHeader);

    const postContent = document.createElement('p');
    postContent.className = 'post-content';
    postContent.textContent = post.content;
    postItem.appendChild(postContent);

    const likeButton = document.createElement('button');
    likeButton.className = 'like-button';
    likeButton.textContent = `いいね (${post.likes})`;
    likeButton.onclick = () => {
        post.likes++;
        likeButton.textContent = `いいね (${post.likes})`;
        savePostsToStorage();
    };
    postItem.appendChild(likeButton);

    postList.appendChild(postItem);
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

// ローカルストレージ内の投稿を更新
function savePostsToStorage() {
    const posts = [];
    const postItems = document.querySelectorAll('.post-item');
    postItems.forEach(postItem => {
        const user = postItem.querySelector('.post-header strong').textContent;
        const datetime = postItem.querySelector('.post-header').textContent.match(/\((.*?)\)/)[1];
        const content = postItem.querySelector('.post-content').textContent;
        const likes = parseInt(postItem.querySelector('.like-button').textContent.match(/\d+/)[0]);
        posts.push({ user, content, datetime, likes, responses: [] });
    });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// ページロード時にデータを読み込む
window.onload = function() {
    displayProfile();
    loadGoals();
    loadPosts();
};