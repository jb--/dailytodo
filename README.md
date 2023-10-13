# <img src="docs/todo_list_icon.png" alt="Daily Todo List logo" width="50px" style="vertical-align:middle"> Daily Todo List

**Yet another VS Code extension for a todo list.**

## Features

- Clickable markdown checkboxes
- Daily updated entries for your todo list

## Development

- `npm install`
- `vsce package`
- `code --install-extension daily-todo-list-0.0.1.vsix`

## Usage

Add the text below to the top of your markdown file.

```markdown
<!-- DOCTYPE: DAILY-TODO -->
```

Then the extension will start a todo list for every day you open the file.