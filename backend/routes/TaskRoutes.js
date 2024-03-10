const express = require("express");
const router = express.Router();
const Task = require("../models/TaskModel");

//getメソッド
router.get("/all_tasks", async (req, res) => {
  try {
    const Tasks = await Task.find({});
    res.status(200).json(Tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// postメソッド
router.post("/add_task", async (req, res) => {
  try {
    const createTask = await Task.create(req.body);
    res.status(200).json(createTask);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// putメソッド
router.put("/put_task/:id", async (req, res) => {
  try {
    const putTask = await Task.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(putTask);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// deleteメソッド
router.delete("/delete_task", async (req, res) => {
  try {
    const deleteTask = await Task.deleteMany({ id: req.params.id });
    res.status(200).json(deleteTask);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
