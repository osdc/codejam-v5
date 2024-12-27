const data = {
  currentUser: {
    image: {
      png: "./images/avatars/image-juliusomo.png",
      webp: "./images/avatars/image-juliusomo.webp",
    },
    username: "juliusomo",
  },
  comments: {
    course1: [
      {
        parent: 0,
        id: 1,
        content: "Course 1 is really good for beginners!",
        createdAt: "1 month ago",
        score: 12,
        user: {
          image: {
            png: "./images/avatars/image-amyrobson.png",
            webp: "./images/avatars/image-amyrobson.webp",
          },
          username: "amyrobson",
        },
        replies: [],
      },
    ],
    course2: [
      {
        parent: 0,
        id: 1,
        content: "Course 2 has great material but the pace is fast.",
        createdAt: "2 weeks ago",
        score: 8,
        user: {
          image: {
            png: "./images/avatars/image-maxblagun.png",
            webp: "./images/avatars/image-maxblagun.webp",
          },
          username: "maxblagun",
        },
        replies: [],
      },
    ],
    course3: [
      {
        parent: 0,
        id: 1,
        content: "Course 3 was challenging but rewarding.",
        createdAt: "3 weeks ago",
        score: 15,
        user: {
          image: {
            png: "./images/avatars/image-juliusomo.png",
            webp: "./images/avatars/image-juliusomo.webp",
          },
          username: "juliusomo",
        },
        replies: [],
      },
    ],
  },
};

// Current selected course
let selectedCourse = "course1";

// Show content for the selected course
function showCourse(courseCode) {
  var courseContent = document.getElementById("courseContent");

  // If no course is selected, clear the content
  if (!courseCode) {
    courseContent.innerHTML = "";
    selectedCourse = null;
    return;
  }

  // Set the selected course
  selectedCourse = courseCode;

  // Load comments for the selected course
  loadCourseComments(courseCode);
}

// Fetch comments by course
async function fetchCommentsByCourse(courseCode) {
  return data.comments[courseCode] || [];
}

// Load course comments into the comment section
async function loadCourseComments(courseCode) {
  const comments = await fetchCommentsByCourse(courseCode);
  const commentsWrapper = document.querySelector(
    ".comment-section .comments-wrp"
  );
  commentsWrapper.innerHTML = "";
  initComments(comments, commentsWrapper);
}

// Add a comment
const addComment = (body, parentId, replyTo = undefined) => {
  if (!selectedCourse) {
    alert("Please select a course to comment on!");
    return;
  }

  let commentParent =
    parentId === 0
      ? data.comments[selectedCourse]
      : data.comments[selectedCourse].filter((c) => c.id == parentId)[0]
          .replies;

  let newComment = {
    parent: parentId,
    id:
      commentParent.length === 0
        ? 1
        : commentParent[commentParent.length - 1].id + 1,
    content: body,
    createdAt: "Now",
    replyingTo: replyTo,
    score: 0,
    replies: parentId === 0 ? [] : undefined,
    user: data.currentUser,
  };

  commentParent.push(newComment);
  loadCourseComments(selectedCourse);
};

// Delete a comment
const deleteComment = (commentObject) => {
  if (commentObject.parent === 0) {
    data.comments[selectedCourse] = data.comments[selectedCourse].filter(
      (e) => e != commentObject
    );
  } else {
    data.comments[selectedCourse].filter(
      (e) => e.id === commentObject.parent
    )[0].replies = data.comments[selectedCourse]
      .filter((e) => e.id === commentObject.parent)[0]
      .replies.filter((e) => e != commentObject);
  }
  loadCourseComments(selectedCourse);
};

// Other functions remain unchanged

// Add comment from input field
const cmntInput = document.querySelector(".reply-input");
cmntInput.querySelector(".bu-primary").addEventListener("click", () => {
  let commentBody = cmntInput.querySelector(".cmnt-input").value;
  if (commentBody.length === 0) return;
  addComment(commentBody, 0);
  cmntInput.querySelector(".cmnt-input").value = "";
});

// Initialize the comments section with default course comments
loadCourseComments(selectedCourse);

// Append comment to parent element
const appendFrag = (frag, parent) => {
  var children = [].slice.call(frag.childNodes, 0);
  parent.appendChild(frag);
  return children[1];
};

// Confirm and delete a comment
const promptDel = (commentObject) => {
  const modalWrp = document.querySelector(".modal-wrp");
  modalWrp.classList.remove("invisible");
  modalWrp.querySelector(".yes").addEventListener("click", () => {
    deleteComment(commentObject);
    modalWrp.classList.add("invisible");
  });
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
  addedInput.querySelector(".bu-primary").addEventListener("click", () => {
    let commentBody = addedInput.querySelector(".cmnt-input").value;
    if (commentBody.length == 0) return;
    addComment(commentBody, parentId, replyTo);
  });
};

// Create comment node
const createCommentNode = (commentObject) => {
  const commentTemplate = document.querySelector(".comment-template");
  var commentNode = commentTemplate.content.cloneNode(true);
  commentNode.querySelector(".usr-name").textContent =
    commentObject.user.username;
  commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
  commentNode.querySelector(".score-number").textContent = commentObject.score;
  commentNode.querySelector(".cmnt-at").textContent = commentObject.createdAt;
  commentNode.querySelector(".c-body").textContent = commentObject.content;
  if (commentObject.replyingTo)
    commentNode.querySelector(".reply-to").textContent =
      "@" + commentObject.replyingTo;

  // Add score increment
  commentNode.querySelector(".score-plus").addEventListener("click", () => {
    commentObject.score++;
    initComments();
  });

  // Add score decrement
  commentNode.querySelector(".score-minus").addEventListener("click", () => {
    commentObject.score--;
    if (commentObject.score < 0) commentObject.score = 0;
    initComments();
  });

  if (commentObject.user.username == data.currentUser.username) {
    commentNode.querySelector(".comment").classList.add("this-user");
    commentNode.querySelector(".delete").addEventListener("click", () => {
      promptDel(commentObject);
    });
    return commentNode;
  }
  return commentNode;
};

// Append comment to parent element
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
function initComments(
  commentList = data.comments.course1,
  parent = document.querySelector(".comments-wrp")
) {
  parent.innerHTML = "";
  commentList.forEach((element) => {
    var parentId = element.parent == 0 ? element.id : element.parent;
    const comment_node = createCommentNode(element);
    if (element.replies && element.replies.length > 0) {
      initComments(element.replies, comment_node.querySelector(".replies"));
    }
    appendComment(parent, comment_node, parentId);
  });
}

// Initialize the comments section with default course comments
initComments();
