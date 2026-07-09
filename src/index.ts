import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";

import { input, rawlist } from "@inquirer/prompts"

let todos = [
    new TodoItem(1, "Buy flowers"), new TodoItem(2, "Get shoes"),
    new TodoItem(3, "Collect stuff"), new TodoItem(4, "Call Joe", true)
]

let collection = new TodoCollection("Peter", todos)
let showCompleted = true

function displayTodoList(): void {
    console.log(`${collection.userName}'s Todo List `,
        `(${collection.getItemCounts().incomplete} items to do)`)
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails())
}

enum Commands {
    Add = "Add New Task",
    Toggle = "Show/Hide Completed",
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
        }
    })
}

promptUser()
