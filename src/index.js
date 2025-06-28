document.addEventListener("DOMContentLoaded", main);

function main() {
  fetchPosts();
  setupAddPostForm();
}

function fetchPosts() {
  fetch("http://localhost:3000/posts")
    .then(res => res.json())
    .then(posts => {
      const blogList = document.getElementById("blog-list");
      blogList.innerHTML = "";

      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post-title";
        postDiv.textContent = post.title;
        postDiv.style.cursor = "pointer";
        postDiv.addEventListener("click", () => displayPostDetail(post));
        blogList.appendChild(postDiv);
      });

      const postCount = document.querySelector(".list-post p");
      postCount.textContent = `${posts.length} posts`;
    });
}

function displayPostDetail(post) {
  const display = document.querySelector(".display-post");
  display.innerHTML = `
    <div class="post-card">
      <h2>${post.title}</h2>
      <p><strong>Author:</strong> ${post.author}</p>
      ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ""}
      <p>${post.content}</p>
      <div class="btn-group">
        <button class="btn edit-btn" onclick="showEditForm(${post.id})">Edit</button>
        <button class="btn delete-btn" onclick="deletePost(${post.id})">Delete</button>
    </div>

    </div>
  `;
}

function setupAddPostForm() {
  const form = document.getElementById("add-post");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const newPost = {
      title: document.getElementById("post-title").value,
      author: document.getElementById("Author").value,
      image: document.getElementById("image-link").value,
      content: form.querySelector("textarea").value
    };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
      form.reset();
      fetchPosts();
    });
  });

  document.getElementById("cancel-add").addEventListener("click", () => {
    form.reset();
  });
}

function showEditForm(id) {
  fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
      const display = document.querySelector(".display-post");
      display.innerHTML = `
        <form id="edit-form" class="edit-post-form">
          <h3>Edit Post</h3>
          <input type="text" id="edit-title" value="${post.title}" required />
          <textarea id="edit-content" rows="5" required>${post.content}</textarea>
          <button type="submit">Update</button>
          <button type="button" id="cancel-edit">Cancel</button>
        </form>
      `;

      const editForm = document.getElementById("edit-form");
      editForm.addEventListener("submit", e => {
        e.preventDefault();

        const updatedPost = {
          title: document.getElementById("edit-title").value,
          content: document.getElementById("edit-content").value
        };

        fetch(`http://localhost:3000/posts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost)
        })
        .then(res => res.json())
        .then(() => {
          fetchPosts();
          displayPostDetail({ ...post, ...updatedPost });
        });
      });

      document.getElementById("cancel-edit").addEventListener("click", () => {
        displayPostDetail(post);
      });
    });
}

function deletePost(id) {
  fetch(`http://localhost:3000/posts/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    fetchPosts();
    document.querySelector(".display-post").innerHTML = "<p>Post deleted.</p>";
  });
}
