var firebaseConfig = {
  apiKey: "AIzaSyCI0S2LR78zao4auwjUT9bQGvhGAAM7dyk",
  authDomain: "todoappdatabase-49ffe.firebaseapp.com",
  databaseURL: "https://todoappdatabase-49ffe-default-rtdb.firebaseio.com",
  projectId: "todoappdatabase-49ffe",
  storageBucket: "todoappdatabase-49ffe.appspot.com",
  messagingSenderId: "1092184669638",
  appId: "1:1092184669638:web:d6b644f291b08e6161c6c7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var list = document.getElementById('list');

// Function to add a task
function addTask() {
  var inputField = document.getElementById('inputField');
  var taskVal = inputField.value.trim();
  if (taskVal !== '') {
    var newTaskRef = database.ref('todos').push();
    newTaskRef.set({ todoVal: taskVal });
    inputField.value = '';
  } else {
    alert('Please enter a task.');
  }
}

// Function to edit a task
function editTask(key) {
  var listItem = document.querySelector(`li[data-key="${key}"]`);
  if (!listItem) {
    console.error('Task not found');
    return;
  }

  var taskTextElement = listItem.querySelector('span:first-child');
  if (!taskTextElement) {
    console.error('Task text element not found');
    return;
  }

  var updateValue = prompt("Enter updated value", taskTextElement.textContent.trim());
  if (updateValue !== null && updateValue.trim() !== '') {
    firebase.database().ref(`todos/${key}`).update({
      todoVal: updateValue
    });
    taskTextElement.textContent = updateValue;
  } else {
    alert('Please enter a valid task.');
  }
}

// Function to delete a task
function deleteTask(key) {
  if (confirm('Are you sure you want to delete this task?')) {
    database.ref('todos/' + key).remove()
      .then(function() {
        // Remove the task from the DOM after it's deleted from the database
        var listItem = document.querySelector(`li[data-key="${key}"]`);
        if (listItem) {
          listItem.remove();
        }
      })
      .catch(function(error) {
        console.error('Error removing task:', error);
      });
  }
}

// Function to delete all tasks
function deleteAllTasks() {
  if (confirm('Are you sure you want to delete all tasks?')) {
    database.ref('todos').remove()
      .then(function() {
        // Remove all tasks from the DOM after they're deleted from the database
        list.innerHTML = '';
      })
      .catch(function(error) {
        console.error('Error removing all tasks:', error);
      });
  }
}

// Event listener for adding a task
document.getElementById('addButton').addEventListener('click', addTask);

// Event listener for deleting all tasks
document.getElementById('deleteAllButton').addEventListener('click', deleteAllTasks);

// Firebase listener for adding tasks to the list
database.ref('todos').on('child_added', function(snapshot) {
  var todo = snapshot.val();
  var li = document.createElement('li');
  li.setAttribute('data-key', snapshot.key);
  li.innerHTML = `
    <span>${todo.todoVal}</span>
    <span class="actions">
      <button class="edit-btn" onclick="editTask('${snapshot.key}')">Edit</button>
      <button class="delete-btn" onclick="deleteTask('${snapshot.key}')">Delete</button>
    </span>
  `;
  list.appendChild(li);
});
