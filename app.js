const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const pathFile = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
let db = null;

const installDb = async () => {
  try {
    db = await open({
      filename: pathFile,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`server Successfully runs http://loacalhost:3000/`);
    });
  } catch (e) {
    console.log(`errorDb: ${e.message}`);
  }
};
installDb();

app.get("/todos/", async (request, response) => {
  const {
    category = "",
    priority = "",
    status = "",
    search_q = "",
    dueDate = "",
  } = request.query;
  if (status !== "") {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE status = '${status}' ;`;
      const getRes = await db.all(getQuery);
      response.send(getRes);
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (priority !== "") {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE priority = '${priority}' ;`;
      const getRes = await db.all(getQuery);
      response.send(getRes);
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (search_q !== "") {
    const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE todo LIKE '%${search_q}%' ;`;
    const getRes = await db.all(getQuery);
    response.send(getRes);
  } else if (category !== "") {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE category = '${category}' ;`;
      const getRes = await db.all(getQuery);
      response.send(getRes);
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (priority !== "" && status !== "") {
    const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE priority = '${priority}' AND status = '${status}' ;`;
    const getRes = await db.all(getQuery);
    response.send(getRes);
  } else if (priority !== "" && category !== "") {
    const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE priority = '${priority}' AND category '${category}' ;`;
    const getRes = await db.all(getQuery);
    response.send(getRes);
  } else if (category !== "" && status !== "") {
    const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE category = '${category}' AND status = '${status}' ;`;
    const getRes = await db.all(getQuery);
    response.send(getRes);
  } else if (dueDate !== "") {
    const result = isValid(new Date(dueDate));
    if (result === false) {
      response.status(400);
      response.send("Invalid Due Date");
    } else {
      const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE dueDate = '${dueDate}' ;`;
      const getRes = await db.all(getQuery);
      response.send(getRes);
    }
  } else {
    const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo;`;
    const getRes = await db.all(getQuery);
    response.send(getRes);
  }
});

app.post("/todos/", async (request, response) => {
  const {
    id = "",
    todo = "",
    status = "",
    priority = "",
    category = "",
    dueDate = "",
  } = request.body;
  if (status !== "") {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      const postQuery = `INSERT INTO todo (id,todo,status,priority,category,due_date) VALUES (${id},'${todo}','${status}','${priority}','${category}','${dueDate}');`;
      const getRes = await db.run(postQuery);
      response.send("Todo Successfully Added");
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (priority !== "") {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      const postQuery = `INSERT INTO todo (id,todo,status,priority,category,due_date) VALUES (${id},'${todo}','${status}','${priority}','${category}','${dueDate}');`;
      const getRes = await db.run(postQuery);
      response.send("Todo Successfully Added");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (category !== "") {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      const postQuery = `INSERT INTO todo (id,todo,status,priority,category,due_date) VALUES (${id},'${todo}','${status}','${priority}','${category}','${dueDate}');`;
      const getRes = await db.run(postQuery);
      response.send("Todo Successfully Added");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (dueDate !== "") {
    const result = isValid(new Date(dueDate));
    if (result === true) {
      const postQuery = `INSERT INTO todo (id,todo,status,priority,category,due_date) VALUES (${id},'${todo}','${status}','${priority}','${category}','${dueDate}');`;
      const getRes = await db.run(postQuery);
      response.send("Todo Successfully Added");
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    const postQuery = `INSERT INTO todo (id,todo,status,priority,category,due_date) VALUES (${id},'${todo}','${status}','${priority}','${category}','${dueDate}');`;
    const getRes = await db.run(postQuery);
    response.send("Todo Successfully Added");
  }
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE id = ${todoId}; `;
  const getRes = await db.get(getQuery);
  response.send(getRes);
});

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const result = isValid(new Date(date));
  if (result === false) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    const getQuery = `SELECT id AS id, todo AS todo, priority AS priority, status AS status,category AS category, due_date AS dueDate FROM todo WHERE dueDate = '${date}'; `;
    const getRes = await db.all(getQuery);
    response.send(getRes);
  }
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const {
    todo = "",
    category = "",
    status = "",
    priority = "",
    dueDate = "",
  } = request.body;
  if (todo !== "") {
    const putQuery = `UPDATE todo SET todo = '${todo}' WHERE id = ${todoId};`;
    const getRes = await db.run(putQuery);
    response.send("Todo Updated");
  } else if (category !== "") {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      const putQuery = `UPDATE todo SET category = '${category}' WHERE id = ${todoId};`;
      const getRes = await db.run(putQuery);
      response.send("Category Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (status !== "") {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      const putQuery = `UPDATE todo SET status = '${status}' WHERE id = ${todoId};`;
      const getRes = await db.run(putQuery);
      response.send("Status Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (priority !== "") {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      const putQuery = `UPDATE todo SET priority = '${priority}' WHERE id = ${todoId};`;
      const getRes = await db.run(putQuery);
      response.send("Priority Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (dueDate !== "") {
    const result = isValid(new Date(dueDate));
    if (result === false) {
      response.status(400);
      response.send("Invalid Due Date");
    } else {
      const putQuery = `UPDATE todo SET due_date = '${dueDate}' WHERE id = ${todoId};`;
      const getRes = await db.run(putQuery);
      response.send("Due Date Updated");
    }
  }
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getQuery = `DELETE FROM todo WHERE id = '${todoId}';`;
  await db.run(getQuery);
  response.send("Todo Deleted");
});

module.exports = app;
