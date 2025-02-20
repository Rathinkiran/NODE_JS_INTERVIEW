const express = require("express")
const fs = require("fs")
const path = require('path')
const app = express();


const PORT = process.env.PORT || 5000;

const tasksFile = path.join(__dirname,'tasks.json');

if(!fs.existsSync(tasksFile))
{
    fs.writeFileSync(tasksFile,JSON.stringify([]));
}

const loadTasks = () => {
    try {
      const data = fs.readFileSync(tasksFile,'utf-8');
      return JSON.parse(data) || [];
    }
    catch(error){
       console.error("Error reading tasks.json",error);
       return [];
    }
}


//GET - /tasks/stats
app.get('/tasks/stats',(req,res) => {
    const tasks = loadTasks()
    
    const totalTasks = tasks.length;
    const tasksByStatus = {};
    const tasksByUser = {};

    tasks.forEach(task => {
        //count by status
        tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;


        //count by user
        tasksByUser[task.userId] = (tasksByUser[task.userId] || 0) + 1;
    });

    res.json({
        totalTasks,
        tasksByStatus,
        tasksByUser
    })
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost${PORT}`)
})














