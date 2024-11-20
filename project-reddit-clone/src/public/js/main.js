// Auth Modal Functions
function showAuthModal(type) {
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authTitle');
  title.textContent = type === 'login' ? 'Login' : 'Create Account';
  modal.dataset.type = type;
  modal.classList.remove('hidden');
}

function hideAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

// Post Modal Functions
function showCreatePostModal() {
  document.getElementById('createPostModal').classList.remove('hidden');
}

function hideCreatePostModal() {
  document.getElementById('createPostModal').classList.add('hidden');
}

// Auth Functions
async function handleAuth(event) {
  event.preventDefault();
  const form = event.target;
  const type = document.getElementById('authModal').dataset.type;
  
  const data = {
    username: form.username.value,
    password: form.password.value
  };

  try {
    const response = await fetch(`/auth/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      location.reload();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Auth error:', error);
    alert('An error occurred');
  }
}

async function logout() {
  try {
    await fetch('/auth/logout', { method: 'POST' });
    location.reload();
  } catch (error) {
    console.error('Logout error:', error);
    alert('An error occurred');
  }
}

// Post Functions
async function createPost(event) {
  event.preventDefault();
  const form = event.target;
  
  try {
    const response = await fetch('/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.value,
        content: form.content.value
      })
    });

    const result = await response.json();
    if (result.success) {
      location.reload();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    alert('An error occurred');
  }
}

async function vote(postId, value) {
  try {
    const response = await fetch(`/posts/vote/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });

    if (response.ok) {
      location.reload();
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error('Error voting:', error);
    alert('An error occurred');
  }
}