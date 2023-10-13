import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Activating extension for context", context);
  function handleDocument(document: vscode.TextDocument) {
    if (document.languageId === "markdown" && documentIsTodoList(document)) {
      addDiaryEntryIfNotFound(document);
    }
  }

  function handleEditor(editor: vscode.TextEditor | undefined) {
    console.log("handleEditor", editor);
    if (editor) {
      console.log("found editor with document", editor.document);
      handleDocument(editor.document);
    }
  }

  let editor = vscode.window.activeTextEditor;
  if (editor) {
    handleDocument(editor.document);
  }

  let onOpen = vscode.workspace.onDidOpenTextDocument(handleDocument);
  let onChange = vscode.window.onDidChangeActiveTextEditor(handleEditor);
  context.subscriptions.push(onOpen);
  context.subscriptions.push(onChange);

  const linkProvider = new CheckboxDocumentLinkProvider();
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { language: "markdown" },
      linkProvider,
    ),
  );

  const hoverProvider = new CheckboxHoverProvider();
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: "markdown" },
      hoverProvider,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.toggleCheckbox", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const range = editor.selection;
      const line = document.lineAt(range.start.line);
      const newText = line.text.replace(/^\s*- \[[ x]\]/, (match) => {
        return match.trim() === "- [ ]"
          ? match.replace("- [ ]", "- [x]")
          : match.replace("- [x]", "- [ ]");
      });

      const edit = new vscode.WorkspaceEdit();
      edit.replace(document.uri, line.range, newText);
      await vscode.workspace.applyEdit(edit);
    }),
  );
}
class CheckboxHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.Hover> {
    const lineText = document.lineAt(position.line).text;
    const checkboxPattern = /^\s*- \[[ x]\]/;

    if (checkboxPattern.test(lineText)) {
      const range = new vscode.Range(
        position.line,
        lineText.indexOf("- [") + 2,
        position.line,
        lineText.indexOf("- [") + 5,
      );
      const hoverText = "Ctrl+Click to toggle checkbox";
      const hover = new vscode.Hover(hoverText, range);
      return hover;
    }

    return null;
  }
}
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function documentIsTodoList(document: vscode.TextDocument): boolean {
  const firstLine = document.lineAt(0).text;
  return firstLine.startsWith("<!-- DOCTYPE: DAILY-TODO -->");
}

function determineLinePosition(document: vscode.TextDocument): number {
  // search the document for a line that contains "<!-- DAILY-TODO-LIST (7) -->"
  // where the number in the brackets is a variable that is added to the return value and defaults to 1 if the brackets are not given
  // and return the line number of the next line

  const regex = /<!-- *DAILY-TODO-LIST *(\( *(-?\d+) *\))? *-->/;

  for (let line = 0; line < document.lineCount; line++) {
    const lineText = document.lineAt(line).text;
    const match = regex.exec(lineText);
    if (match) {
      const lineNumber = match[2] ? parseInt(match[2]) : 1;
      return Math.max(1, line + lineNumber);
    }
  }
  return 3;
}

async function addDiaryEntryIfNotFound(document: vscode.TextDocument) {
  const currentDate = getCurrentDate();
  const header = `## ${currentDate}`;
  const content = document.getText();

  if (!content.includes(header)) {
    const newEntry = `${header}\n\n- [ ] \n\n`;
    const linePosition = determineLinePosition(document);
    // Add new diary entry
    const editEntry = new vscode.WorkspaceEdit();
    editEntry.insert(
      document.uri,
      new vscode.Position(linePosition, 0),
      newEntry,
    );
    await vscode.workspace.applyEdit(editEntry);
  }
}

class CheckboxDocumentLinkProvider implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const pattern = /- \[[ x]\]/g;
    const links: vscode.DocumentLink[] = [];

    for (let line = 0; line < document.lineCount; line++) {
      const lineText = document.lineAt(line).text;
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(lineText)) !== null) {
        const range = new vscode.Range(
          line,
          match.index + 2,
          line,
          match.index + match[0].length,
        );
        const link = new vscode.DocumentLink(
          range,
          vscode.Uri.parse("command:extension.toggleCheckbox"),
        );
        links.push(link);
      }
    }

    return links;
  }
}

export function deactivate() { }
