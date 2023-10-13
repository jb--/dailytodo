# <img src="docs/todo_list_icon.png" alt="Daily Todo List logo" width="50px" style="vertical-align:middle"> Daily Todo List

**Yet another VS Code extension for a todo list.**

## Features

The Daily Todo List extension provides the following features:

- **Clickable markdown checkboxes**: You can easily mark tasks as complete by clicking on the checkboxes in your todo list.
- **Daily updated entries**: The extension automatically updates your todo list every day, so you can start each day with a fresh list of tasks.

## Getting started

To get started with the Daily Todo List extension, follow these steps:

1. Install the extension: You can install the extension from the Visual Studio Code Marketplace.
2. Declare a markdown file as a daily todo-list by adding `<!-- DOCTYPE: DAILY-TODO -->` to the top of the file.
3. Use your todo list - it's plain markdown.

## Configuration

You have to ensure that the first line of your document marks it as a daily todo list.
You can do this by adding the following line to the top of your document:

```markdown
<!-- DOCTYPE: DAILY-TODO -->
```

By default, the extension adds text blocks like this at the top of your document. (The date is automatically updated for your current day.)

```markdown
## 2023-10-13

- [ ] 

```

You have the option of specifying the position and direction of your todo list.
Put this piece of text anywhere in your document and your todo list will be placed below.

```markdown
<!-- DAILY-TODO-LIST -->
```

Even if you put this comment somewhere in your markdown file, you still have to flag the document as a `<!-- DOCTYPE: DAILY-TODO -->`.
This is done, so that the extension does search every markdown document you edit with vscode, which might impact your performance.

### Explicit positioning

You might want to have a headline or some text above your todo list.
You can specify the _relative line number_ of where the extension would place your todo list via a number in brackets `<!-- DAILY-TODO-LIST -->`.

Imagine the case where you have an introduction to your todo list and you want to place your todo list below that introduction.

```markdown
<!-- DOCTYPE: DAILY-TODO -->

# Example Todo-List

<!-- DAILY-TODO-LIST(4) -->
Here is some introductory sentence on this row.
Here is yet another sentence, that stays around every day...

## 2023-10-13

- [ ] Buy milk
- [ ] Buy eggs

## 2023-10-12

- [x] Clean out fridge


```

### Reverse lists

The relative position is allowed to be zero or negative.
This means that you can change the order of how your todo-list will grow over time.

```markdown
<!-- DOCTYPE: DAILY-TODO -->
# Example Todo-List

## 2023-10-12

- [x] Clean out fridge

## 2023-10-13

- [ ] Buy milk
- [ ] Buy eggs


<!-- DAILY-TODO-LIST(-1) -->
```

## Development

- `npm install`
- `vsce package`
- `code --install-extension daily-todo-list-0.0.1.vsix`
