// URLs
const POSTS_URL = "http://127.0.0.1:3000/posts";
const REPLIES_URL = "http://127.0.0.1:3000/replies";
const USERS_URL = "http://127.0.0.1:3000/users";
const INTERACTIONS_URL = "http://127.0.0.1:3000/interactions";

// DOM Elements
const mainArea = document.querySelector("#main");
const navBar = document.querySelector("nav");

const buttonSignIn = document.querySelector("#sign-in-window-button");
const heyThereWindow = document.querySelector("#hey-there-window");
const welcomeWindow = document.querySelector("#welcome-window");
const newUserForm = document.querySelector("#new-user-form");

const buttonWriteWindow = document.querySelector("#write-window-button");
const writeWindow = document.querySelector("#write-window");
const newPostForm = writeWindow.querySelector("#new-post");
const closeWriteWindow = writeWindow.querySelector("#close-write-window");
const writeWindowBackground = writeWindow.querySelector("#write-window-background");

const newReplyForm = document.querySelector("#new-reply")
const replyWindow = document.querySelector("#reply-window");
const closeReplyWindow = document.querySelector("#close-reply-window");
const replyWindowBackground = document.querySelector("#reply-window-background");

const searchBar = document.querySelector("#search-bar"); 
const mathSelector = document.querySelector("#math-selector");
const econSelector = document.querySelector("#economics-selector");
const bioSelector = document.querySelector("#biology-selector");
const chemSelector = document.querySelector("#chemistry-selector");
const socialSciencesSelector = document.querySelector("#social-sciences-selector");
const humanitiesSelector = document.querySelector("#humanities-selector");
const personalSelector = document.querySelector("#personal-selector");

const signInForm = document.querySelector("#sign-in-form");

const editReplyWindow = document.querySelector("#edit-reply-window");
const editPostWindow= document.querySelector("#edit-post-window");
const editPostForm = document.querySelector("#edit-post-form");
const editReplyForm = document.querySelector("#edit-reply-form");

const userNameDispaly = document.querySelector("#user-name-display");

signInForm.addEventListener("submit", event => {
    event.preventDefault();
    const username = signInForm.querySelector("#sign-in-username").value;
    const password = signInForm.querySelector("#sign-in-password").value;

   fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(response => {
        if (response.error != 'Invalid username or password'){
        console.log(response)
        localStorage.setItem("username", response.user.username)
        localStorage.setItem("user_id", response.user.id)
        heyThereWindow.classList.remove("is-active")
        replaceDefault();
    } else { alert(response.error) }
})
});

const newReplyNameValue = document.querySelector("#new-reply-name"); 
const newPostNameValue = document.querySelector("#show-user-name");

function replaceDefault() {
    if (localStorage.getItem("username") == null) {
        newReplyNameValue.defaultValue = "Anonymous";
        newPostNameValue.defaultValue = "Anonymous";
    } else { 
    newReplyNameValue.defaultValue = `${localStorage.getItem("username")}`;
    console.log(newReplyNameValue.defaultValue)
    newPostNameValue.defaultValue = `${localStorage.getItem("username")}`;
    console.log(newPostNameValue.defaultValue)
    userNameDispaly.innerText = `👋, ${localStorage.getItem("username")}`;
    }
};


// Establishing Fetches
fetch(POSTS_URL)
.then(res => res.json())
.then(postArray => displayAllPosts(postArray));

// Fixing all my life problems in one javascript function
mainArea.addEventListener("click", event => {
    const postId = event.target.parentNode.parentNode.parentNode.id
    let postLikes = event.target.parentNode.parentNode.parentNode.dataset.likes;
    postLikes = parseInt(postLikes) + 1;
    if (event.target.id == 'like-button') {
        if (event.target.parentNode.innerHTML == `<img id="like-button" src="./assets/icons8-heart-32.png">`) {
                        console.log("i like")
                        const likesCount = event.target.parentNode.parentNode.parentNode.querySelector("#likes-display") 
                        const postContent = event.target.parentNode.parentNode.parentNode.querySelector("#post-content").innerText
                        event.target.parentNode.innerHTML = `<img id = "like-button" src="./assets/icons8-filled-heart-32.png"/>`
                        likesCount.textContent= `${postLikes} Likes`
                        const postData = {likes: postLikes, 
                                            post_id: postId, 
                                            content: postContent}
                        const interactionsData = {user_id: localStorage.getItem("user_id"), 
                                                    post_id: postId, 
                                                    interaction: "like"}

                        fetch(`${INTERACTIONS_URL}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(interactionsData)
                        })
                        .then(res => res.json())
                        .then(response => console.log(response))
                        
                        fetch(POSTS_URL + `/${postId}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(postData)
                        })
                        .then(res => res.json())
                        .then(response => console.log(response))

                    } else {
                        console.log("unlike")
                        const likesCount = event.target.parentNode.parentNode.parentNode.querySelector("#likes-display") 
                        event.target.parentNode.innerHTML = `<img id = "like-button" src="./assets/icons8-heart-32.png"/>`
                        postLikes = parseInt(postLikes) - 1;
                        likesCount.textContent= `${postLikes} Likes`
                    };
        
    } else if(event.target.parentNode.id == 'reply-window-button') {
        console.log(postId)
        replyWindow.classList.add("is-active")
        newReply(postId)
    } else if(event.target.id == 'edit-post-button') { 
        // debugger
        console.log(event.target.parentNode.parentElement.id)
        editPost(event.target.parentNode.parentElement.id)
    } else if(event.target.id == 'edit-reply-button') {
        console.log(event.target.parentNode.parentNode.parentNode.dataset.id)
        editReply(event.target.parentNode.parentNode.parentNode.dataset.id)};
});

function editReply(replyId) {
    fetch(REPLIES_URL + `/${replyId}`)
    .then(res => res.json())
    .then(reply => 
        {const editReplyContentBox = document.querySelector("#edit-reply-box");
        editReplyContentBox.defaultValue = reply.content
        editReplyWindow.classList.add("is-active")
        });
    editReplyForm.addEventListener("submit", event => {
        event.preventDefault();
        const editReplyContentBox = document.querySelector("#edit-reply-box");
        const editReplyData = {content: editReplyContentBox.value}
        
        fetch(REPLIES_URL + `/${replyId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
                },
                body: JSON.stringify(editReplyData)
                })
            
            
            editReplyWindow.classList.remove("is-active")
            const editedReplyContent = document.querySelector(`#reply-content-${replyId}`)
            editedReplyContent.innerText = editReplyData.content
        });
        
            }

function editPost(postId) {
    fetch(POSTS_URL + `/${postId}`)
    .then(res => res.json())
    .then(post => {
        const editContentBox = document.querySelector("#edit-content-box");
        editContentBox.defaultValue = post.content
        editPostWindow.classList.add("is-active")
        });
        editPostForm.addEventListener("submit", event => {
            event.preventDefault();
            const editContentBox = document.querySelector("#edit-content-box");
            const likesCount = event.target.parentNode.parentNode.parentNode.querySelector("#likes-display").textContent 
            const editPostData = {content: editContentBox.value, likes: likesCount}
            fetch(POSTS_URL + `/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                    },
                    body: JSON.stringify(editPostData)
                    })
                
                editPostWindow.classList.remove("is-active")
            });
                }

function newReply(postId) {
    console.log(`Creating a reply to post ${postId}`)
    newReplyForm.addEventListener("submit", event =>{
        event.preventDefault()
        const newReplyData = {content: event.target.querySelector("#new-reply-content").value, post_id: postId, 
                            replyname: event.target.querySelector("#new-reply-name").value,
                            user_id: parseInt(localStorage.getItem("user_id"))}
        replyWindow.classList.remove("is-active")

        fetch(REPLIES_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                        body: JSON.stringify(newReplyData),
                    })
                .then(res => console.log(newReplyData))
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())

    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => displayAllPosts(postArray));
});
}

// Display Functions
function displayAllPosts(postArray) {
    postArray.forEach(post => displayPost(post))
};

function tag1Color(postCard) {
    const tag1 = postCard.querySelector(".tag");
    if (tag1.textContent == "Personal") {
        tag1.classList.add("is-danger")
    } else { tag1.classList.add("is-link") }
};

function displayPost(post) {
    let postCard = document.createElement("div");
    postCard.dataset.id = post.id;
    postCard.classList.add("card")
    postCard.classList.add("is-fluid")
    postCard.classList.add("individual-post")
    if (post.user_id == localStorage.getItem("user_id")) {postCard.innerHTML = `
                    <div class= "m-6 p-5" id = ${post.id} data-likes = ${post.likes}>
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">${post.title}</p>
                                <p class="subtitle is-6">@<a class = "is-link">${post.postname}</a></p>
                            </div>
                        </div>
                        <div>
                            <h2 id = "likes-display">${post.likes} Likes</h2>
                        </div>
                        <div class="tags py-2">
                                <span class="tag" id = "tag-1">${post.tag1}</span>
                                <span class="tag" id = "tag-2">${post.tag2}</span>
                                <span class="tag" id = "tag-3">${post.tag3}</span>
                            </div>
                        <div class="content p-3 m-5">
                            <div id = "post-content">
                                ${post.content} 
                            </div>
                        </div>

                        <div class ="buttons">
                            <button class="button is-success is-small" id = "reply-window-button"><img src="./assets/icons8-composing-mail-32.png"</button>
                            <button class = "button is-small"><img id = "like-button" src="./assets/icons8-heart-32.png"/></button>
                            <button class = "button is-small is-light edit" id = "edit-post-button">Edit</button>
                        </div>
                       
                        <footer class="card-footer">
                        <div class = "content" id = "replies">
                            <br>
                            <h4>Replies</h3>
                            <ul id= "main-thread">
                            </ul>
                        </div>
                        </footer>
                    </div>`}
                    else {postCard.innerHTML = `
                    <div class= "m-6 p-5" id = ${post.id} data-likes = ${post.likes}>
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">${post.title}</p>
                                <p class="subtitle is-6">@<a class = "is-link">${post.postname}</a></p>
                            </div>
                        </div>
                        <div>
                            <h2 id = "likes-display">${post.likes} Likes</h2>
                        </div>
                        <div class="tags py-2">
                                <span class="tag" id = "tag-1">${post.tag1}</span>
                                <span class="tag" id = "tag-2">${post.tag2}</span>
                                <span class="tag" id = "tag-3">${post.tag3}</span>
                            </div>
                        <div class="content p-3 m-5">
                            <div id ="post-content">
                                ${post.content} 
                            </div>
                        </div>

                        <div class ="buttons">
                            <button class="button is-success is-small" id = "reply-window-button"><img src="./assets/icons8-composing-mail-32.png"</button>
                            <button class = "button is-small"><img id = "like-button" src="./assets/icons8-heart-32.png"/></button>
                        </div>
                       
                        <footer class="card-footer">
                        <div class = "content" id = "replies">
                            <br>
                            <h4>Replies</h3>
                            <ul id= "main-thread">
                            </ul>
                        </div>
                        </footer>
                    </div>`}
    tag1Color(postCard);
    repliesFetch(postCard);
    mainArea.prepend(postCard);
};

function listReplies(repliesArr, postCard){
    const mainThread = postCard.querySelector("#main-thread")
    let filteredReplies = repliesArr.filter(reply => reply.post_id == postCard.dataset.id)
    // debugger
    filteredReplies.forEach(reply => {
        let replyItem = document.createElement("div")
        replyItem.classList.add("card")
        replyItem.classList.add("p-5")
        replyItem.classList.add("m-3")
        replyItem.dataset.id = reply.id;
        console.log(reply.user_id)
        if (reply.user_id == localStorage.getItem("user_id")) {
            replyItem.innerHTML = `
            <div class="card-content">
                <div id= "reply-content-${reply.id}" >
                    ${reply.content} 
                </div>
            </div>
            <footer class="card-footer">
            <br>
                <div class="content">
                    @<a class ="is-link">${reply.replyname}</a>
                    <button class = "button is-small is-light edit" id = "edit-reply-button">Edit</button>
                </div>
            </footer>`
        } else {
        replyItem.innerHTML = `<div class="card-content" data-id ="${reply.id}>
                                        <p>${reply.content}</p>
                                </div>
                                <footer class="card-footer">
                                <br>
                                <div class = "content">
                                    <br>
                                    @<a class ="is-link">${reply.replyname}</a>
                                </div>
                                </footer>`
        }

        mainThread.append(replyItem)
    })
};

function repliesFetch(postCard) {
    fetch(REPLIES_URL)
    .then(res => res.json())
    .then(repliesArr => listReplies(repliesArr, postCard))
};

function filterBySearch(postArray, seachParams) {
    if (seachParams == " ") {
        fetch(POSTS_URL)
        .then(res => res.json())
        .then(postArray => displayAllPosts(postArray));
    } else {
    return postArray.filter(post => searchMagic(post, seachParams))
    }
};

function searchMagic(post, seachParams) {
    if (post.tag1.toLowerCase().includes(seachParams) || 
    post.tag2.toLowerCase().includes(seachParams) || 
    post.tag3.toLowerCase().includes(seachParams) ||
    post.title.toLowerCase().includes(seachParams) ||
    post.tag1.includes(seachParams) || 
    post.tag2.includes(seachParams) || 
    post.tag3.includes(seachParams) ||
    post.title.includes(seachParams)) {
        return post
    }
};

function filterByMath(postArray) {
    return postArray.filter(post => post.tag1 == "Math")
};

function filterByEcon(postArray) {
    return postArray.filter(post => post.tag1 == "Economics")
};

function filterByBio(postArray) {
    return postArray.filter(post => post.tag1 == "Biology")
};

function filterByChem(postArray) {
    return postArray.filter(post => post.tag1 == "Chemistry")
};

function filterBySocialSciences(postArray) {
    return postArray.filter(post => post.tag1 == "Social Science")
};

function filterByHumanities(postArray) {
    return postArray.filter(post => post.tag1 == "Humanities")
};

function filterByPersonal(postArray) {
    return postArray.filter(post => post.tag1 == "Personal")
}

// Event Listeners
searchBar.addEventListener("input", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterBySearch(postArray, event.target.value))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

mathSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByMath(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

econSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByEcon(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

bioSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByBio(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

chemSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByChem(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

socialSciencesSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterBySocialSciences(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

humanitiesSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByHumanities(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

personalSelector.addEventListener("click", event => {
    const allDisplayedPosts = document.querySelectorAll(".individual-post");
    allDisplayedPosts.forEach(post => post.remove())
    fetch(POSTS_URL)
    .then(res => res.json())
    .then(postArray => filterByPersonal(postArray))
    .then(filteredSearchArray => displayAllPosts(filteredSearchArray))
});

buttonSignIn.addEventListener("click", event => {
    heyThereWindow.classList.remove("is-active")
    welcomeWindow.classList.add("is-active")
});

newUserForm.addEventListener("submit", event => {
    event.preventDefault()
    const newUserData = {user: {username: event.target.querySelector("#new-username").value,
                        email: event.target.querySelector("#new-email").value,
                        password: event.target.querySelector("#new-password").value,
                        college: event.target.querySelector("#new-college").value,
                        major: event.target.querySelector("#new-major").value,
                        password_confirmation: event.target.querySelector("#new-password-confirmation").value}}
    console.log(newUserData)
    welcomeWindow.classList.remove("is-active")
    scrollTop()
    
    fetch(USERS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
    })
    .then(res => console.log(newUserData))

});

buttonWriteWindow.addEventListener("click", event => {
    //  console.log("buttonWriteWindow")
    writeWindow.classList.add("is-active")
});

newPostForm.addEventListener("submit", event =>{
    event.preventDefault()
    // debugger
    const newPostData = {title: event.target.querySelector("#new-title").value,
                        content: event.target.querySelector("#new-write-content").value,
                        postname: event.target.querySelector("#show-user-name").value,
                        tag1: event.target.querySelector("#tag1-input").options[event.target.querySelector("#tag1-input").selectedIndex].value,
                        tag2: event.target.querySelector("#tag2-input").value,
                        tag3: event.target.querySelector("#tag3-input").value,
                        likes: 0,
                        user_id: parseInt(localStorage.getItem("user_id"))}

    console.log(newPostData)
    displayPost(newPostData)

    scrollTop()

    fetch(POSTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
          body: JSON.stringify(newPostData),
        })
    
    writeWindow.classList.remove("is-active")
});

closeWriteWindow.addEventListener("click", event => {
    writeWindow.classList.remove("is-active")
});

writeWindowBackground.addEventListener("click", event => {
    writeWindow.classList.remove("is-active")
});

closeReplyWindow.addEventListener("click", event => {
    replyWindow.classList.remove("is-active")
});

replyWindowBackground.addEventListener("click", event => {
    replyWindow.classList.remove("is-active")
});

// Utility Functions
function scrollTop() {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    })
};