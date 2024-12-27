// Data structure for current user
const data = {
    currentUser: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    }
  };
  
  // Current selected course
  let selectedCourse = "course1";
  
  // Show content for the selected course
  function showCourse(courseCode) {
    var courseContent = document.getElementById("courseContent");
  
    if (!courseCode) {
      courseContent.innerHTML = "";
      selectedCourse = null;
      return;
    }
  
    selectedCourse = courseCode;
    loadCourseComments(courseCode);
  }
  
  // Fetch comments by course
  async function fetchCommentsByCourse(courseCode) {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${courseCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const comments = await response.json();
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }
  
  // Load course comments
  async function loadCourseComments(courseCode) {
    const comments = await fetchCommentsByCourse(courseCode);
    const commentsWrapper = document.querySelector(".comment-section .comments-wrp");
    commentsWrapper.innerHTML = "";
    initComments(comments, commentsWrapper);
  }
  
  // Add comment
  const addComment = async (body, parentId, replyTo = undefined) => {
    if (!selectedCourse) {
      alert("Please select a course to comment on!");
      return;
    }
  
    const newComment = {
      parent: parentId,
      content: body,
      replyingTo: replyTo,
      score: 0,
      user: data.currentUser
    };
  
    try {
      console.log('Sending comment data:', {
        courseId: selectedCourse,
        comment: newComment
      });
  
      const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          comment: newComment
        })
      });
  
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
  
      console.log('Comment added successfully:', responseData);
      await loadCourseComments(selectedCourse);
    } catch (error) {
      console.error('Error details:', error);
      alert(`Failed to add comment: ${error.message}`);
    }
  };
  
  // Delete comment
  const deleteComment = async (commentObject) => {
    try {
      const parentId = commentObject.parent === 0 ? null : commentObject.parent;
      const url = `http://localhost:3000/api/comments/${selectedCourse}/${commentObject.id}${
        parentId ? `?parentId=${parentId}` : ''
      }`;
      
      const response = await fetch(url, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      await loadCourseComments(selectedCourse);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };
  
  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 1) return 'Today';
    if (diffDays < 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
  
  // Append fragment
  const appendFrag = (frag, parent) => {
    var children = [].slice.call(frag.childNodes, 0);
    parent.appendChild(frag);
    return children[1];
  };
  
  // Prompt delete
  const promptDel = (commentObject) => {
    const modalWrp = document.querySelector(".modal-wrp");
    modalWrp.classList.remove("invisible");
    
    const handleDelete = async () => {
      await deleteComment(commentObject);
      modalWrp.classList.add("invisible");
      modalWrp.querySelector(".yes").removeEventListener("click", handleDelete);
    };
  
    modalWrp.querySelector(".yes").addEventListener("click", handleDelete);
    modalWrp.querySelector(".no").addEventListener("click", () => {
      modalWrp.classList.add("invisible");
    });
  };
  
  // Spawn reply input
  const spawnReplyInput = (parent, parentId, replyTo = undefined) => {
    if (parent.querySelectorAll(".reply-input")) {
      parent.querySelectorAll(".reply-input").forEach((e) => {
        e.remove();
      });
    }
  
    const inputTemplate = document.querySelector(".reply-input-template");
    const inputNode = inputTemplate.content.cloneNode(true);
    const addedInput = appendFrag(inputNode, parent);
  
    addedInput.querySelector(".bu-primary").addEventListener("click", async () => {
      const commentBody = addedInput.querySelector(".cmnt-input").value.trim();
      if (commentBody.length === 0) return;
      await addComment(commentBody, parentId, replyTo);
      addedInput.remove();
    });
  };
  
  // Create comment node
  const createCommentNode = (commentObject) => {
    const commentTemplate = document.querySelector(".comment-template");
    var commentNode = commentTemplate.content.cloneNode(true);
    
    commentNode.querySelector(".usr-name").textContent = commentObject.user.username;
    commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
    commentNode.querySelector(".score-number").textContent = commentObject.score;
    commentNode.querySelector(".cmnt-at").textContent = formatDate(commentObject.createdAt);
    commentNode.querySelector(".c-body").textContent = commentObject.content;
    
    if (commentObject.replyingTo) {
      const replyToElement = commentNode.querySelector(".reply-to");
      if (replyToElement) {
        replyToElement.textContent = `@${commentObject.replyingTo}`;
      }
    }
  
    if (commentObject.user.username === data.currentUser.username) {
      commentNode.querySelector(".comment").classList.add("this-user");
      commentNode.querySelector(".delete").addEventListener("click", () => {
        promptDel(commentObject);
      });
    }
  
    return commentNode;
  };
  
  // Append comment
  const appendComment = (parentNode, commentNode, parentId) => {
    const bu_reply = commentNode.querySelector(".reply");
    const appendedCmnt = appendFrag(commentNode, parentNode);
    const replyTo = appendedCmnt.querySelector(".usr-name").textContent;
    
    bu_reply.addEventListener("click", () => {
      if (parentNode.classList.contains("replies")) {
        spawnReplyInput(parentNode, parentId, replyTo);
      } else {
        spawnReplyInput(
          appendedCmnt.querySelector(".replies"),
          parentId,
          replyTo
        );
      }
    });
  };
  
  // Initialize comments
  function initComments(commentList = [], parent = document.querySelector(".comments-wrp")) {
    parent.innerHTML = "";
    commentList.forEach((element) => {
      var parentId = element.parent === 0 ? element.id : element.parent;
      const comment_node = createCommentNode(element);
      if (element.replies && element.replies.length > 0) {
        initComments(element.replies, comment_node.querySelector(".replies"));
      }
      appendComment(parent, comment_node, parentId);
    });
  }
  
  // Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    const cmntInput = document.querySelector(".reply-input");
    if (cmntInput) {
      const postButton = cmntInput.querySelector(".bu-primary");
      if (postButton) {
        postButton.addEventListener("click", async () => {
          const input = cmntInput.querySelector(".cmnt-input");
          const commentBody = input.value.trim();
          
          if (commentBody.length === 0) {
            alert("Please enter a comment before posting.");
            return;
          }
          
          try {
            await addComment(commentBody, 0);
            input.value = "";
          } catch (error) {
            console.error('Error posting comment:', error);
          }
        });
      }
    }
  
    // Initialize with default course
    loadCourseComments(selectedCourse);
  });