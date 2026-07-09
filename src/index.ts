import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";

import { input, rawlist, checkbox } from "@inquirer/prompts"
import { JsonTodoCollection } from "./jsonTodoCollection.js";

let todos: TodoItem[] = [
    new TodoItem(1, "Buy flowers"), new TodoItem(2, "Get shoes"),
    new TodoItem(3, "Collect stuff"), new TodoItem(4, "Call Rob", true)
]

let collection: TodoCollection = new JsonTodoCollection("Peter", todos)
let showCompleted = true

function displayTodoList(): void {
    console.log(`${collection.userName}'s Todo List `,
        `(${collection.getItemCounts().incomplete} items to do)`)
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails())
}

enum Commands {
    Add = "Add New Task",
    Complete = "Complete a Task",
    Toggle = "Show/Hide Completed",
    Purge = "Remove Completed Tasks",
    Quit = "Quit"
}

function promptAdd(): void {
    console.clear()
    input({
        message: "Enter task:",
    }).then(
        answer => {
            if (answer !== "") {
                collection.addTodo(answer)
            }
            promptUser()
        }
    )
}

function promptComplete(): void {
    console.clear()
    checkbox({
        message: "Mark Tasks Complete",
        choices: collection.getTodoItems(showCompleted).map(
            item => (
                { name: item.task, value: item.id, checked: item.complete }
            ))
    }).then(answers => {
        collection.getTodoItems(true).forEach(
            item => collection.markComplete(item.id, answers.find(id => id === item.id) != undefined)
        )
        promptUser()
    })
}

function promptUser(): void {
    console.clear()
    displayTodoList()
    rawlist({
        message: "Choose option",
        choices: Object.values(Commands),
    }).then(answer => {
        switch (answer) {
            case Commands.Toggle:
                showCompleted = !showCompleted
                promptUser()
                break
            case Commands.Add:
                promptAdd()
                break
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete()
                } else {
                    promptUser()
                }
                break
            case Commands.Purge:
                collection.removeComplete()
                promptUser()
                break
        }
    })
}

promptUser()
