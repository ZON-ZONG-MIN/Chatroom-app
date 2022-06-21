const messageform = document.querySelector(".chatbox form");
const messageList = document.querySelector("#messagelist");
const userList = document.querySelector("ul#users");
const chatboxinput = document.querySelector(".chatbox input")
const useraddform = document.querySelector(".modal")
const backdrop = document.querySelector(".backdrop")
const useraddinput = document.querySelector(".modal input");
const socket = io("http://localhost:3000");

const messages = [];
let users = [];

//SOCKET LISTENRS
socket.on("users", (_users) => {
  users = _users;
  updateUsers();
})
socket.on("message_client", (message) => {
  messages.push(message);
  updateMessage();
})

//EVENT LISTENERS
messageform.addEventListener("submit", messageSubmitHandler);
useraddform.addEventListener("submit", userAddHandler);

// functions
function messageSubmitHandler(e) {
  e.preventDefault();
  let message = chatboxinput.value;

  if (!message) {
    return alert("Message must not be empty");
  }

  socket.emit("message", message);

  chatboxinput.value = ""

}

function updateMessage(){
  messageList.textContent = "";

  for (let i = 0; i < messages.length; i++) {
    messageList.innerHTML += 
    `<li>
      <p>${messages[i].user}</p>
      <p>${messages[i].message}</p>
    </li>`
  }
}

function updateUsers(){
  userList.textContent = "";

  for(let i = 0; i < users.length; i++){
    let node = document.createElement("LI");
    let textnode = document.createTextNode(users[i]);
    node.appendChild(textnode);
    userList.appendChild(node);
  }
}

function userAddHandler(e) {
  e.preventDefault();

  let username = useraddinput.value;

  if(!username) {
    return alert("You must add a user name");
  }

  socket.emit("adduser", username);

  useraddform.classList.add("disappear");
  backdrop.classList.add("disappear");
}
