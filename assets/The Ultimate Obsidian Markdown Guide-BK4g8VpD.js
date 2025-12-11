const n=`## Table of Contents

> [!NOTE]- Navigation
> - [🔗 Links](#links)
> - [🖼️ Images and Media](#images-and-media)
>- [📊 Tables](#tables)
>- [📢 Callouts](#callouts)
>- [✅ Task Lists](#task-lists)
>- [➖ Dividers](#dividers)
>- [💬 Quotes](#quotes)
>- [📎 Footnotes](#footnotes)
>- [🔒 Comments](#comments)
>- [🎨 Advanced Formatting](#advanced-formatting)
>- [📄 YAML Frontmatter](#yaml-frontmatter)
>- [📊 Diagrams](#diagrams)
>- [🧮 LaTeX Math](#latex-math)
>- [⌨️ Keyboard Keys](#keyboard-keys)
>- [📂 Embedded Content](#embedded-content)
>- [📦 Collapsible Sections](#collapsible-sections)
>- [🧩 Advanced Obsidian Features](#advanced-obsidian-specific-features)
>- [🎭 CSS Classes and Styling](#css-classes-and-custom-styling)
>- [📰 Multi-Column Layout](#multi-column-layout)
>- [🔄 Formatting Combinations](#formatting-combinations)

---
## Basic Text Formatting

| Format          | Markdown                 | Result                |
| --------------- | ------------------------ | --------------------- |
| Bold            | \`**bold**\` or \`__bold__\` | **bold**              |
| Italic          | \`*italic*\` or \`_italic_\` | _italic_              |
| Bold and Italic | \`***bold and italic***\`  | _**bold and italic**_ |
| Strikethrough   | \`~~strikethrough~~\`      | ~~strikethrough~~     |
| Highlight       | \`\\==highlighted text\\==\` | ==highlight==         |
| Subscript       | \`H~2~O\`                  | H~2~O                 |
| Superscript     | \`X^2^\`                   | X^2^                  |
| Inline code     | \`\` \`code\` \`\`             | \`code\`                |

---

## Links

### Internal Links

\`\`\`markdown
[[Note Name]]
[[Note Name|Custom Text]]
[[Note Name#Section]]
[[Note Name#^block-reference]]
[[Note Name#^block-reference|Custom Text]]
\`\`\`

### External Links

\`\`\`markdown
[Link Text](https://www.example.com)
[Link with Title](https://www.example.com "Title on hover")
<https://www.example.com> (Auto-linked URL)
\`\`\`

### Reference-Style Links

\`\`\`markdown
[link text][reference]

[reference]: https://www.example.com "Optional Title"
\`\`\`

---

## Images and Media

### Images

\`\`\`markdown
![Alt text](path/to/image.jpg)
![Alt text](path/to/image.jpg "Optional title")
![Alt text|300](path/to/image.jpg) (width specification)
\`\`\`

### Embedded Notes

\`\`\`markdown
![[Note Name]]
![[Note Name#Section]]
![[Note Name#^block-reference]]
\`\`\`

### Embedded PDF Pages

\`\`\`markdown
![[document.pdf#page=2]]
\`\`\`

### Embedded Audio/Video

\`\`\`markdown
![[audio.mp3]]
![[video.mp4]]
\`\`\`

---

## Tables



### Table with Line Breaks


| Header 1 | Header 2 |
|----------|----------|
| Line 1<br>Line 2 | Cell |


---


## Callouts


> [!NOTE]
> This is a basic note callout

> [!INFO]
> Information callout

> [!TIP]
> Helpful tip

> [!IMPORTANT]
> Critical information

> [!WARNING]
> Proceed with caution

> [!CAUTION]
> Careful!

> [!DANGER]
> High risk

> [!SUCCESS]
> Well done!

> [!QUESTION]
> Have you considered?

> [!EXAMPLE]
> Here's how to do it

> [!QUOTE]
> Famous words

> [!BUG]
> Known issue

> [!ABSTRACT]
> Summary of a complex topic

> [!FAILURE]
> What went wrong

> [!TODO]
> Action items


### Custom Callouts

> [!custom-name] Custom Title
> Create your own callout types with CSS snippets


### Foldable Callouts


> [!TIP]+ Expanded by default
> This callout is expanded by default.

> [!TIP]- Collapsed by default
> This callout is collapsed by default.


### Nested Callouts


> [!NOTE]
> Outer callout
> > [!TIP]
> > Nested callout


---

## Task Lists

\`\`\`markdown
- [ ] Incomplete task
- [x] Completed task
- [ ] @{2023-12-25} Task with date
- [>] Forwarded task
- [<] Scheduled task
- [!] Important task
- [-] Cancelled task
- [/] In progress task
- [?] Question task
\`\`\`

### Task Variations (with Tasks plugin)

\`\`\`markdown
- [ ] #tag Task with tag
- [ ] Task with ^block-reference
- [ ] /due date Task with due date
\`\`\`

---

## Dividers

\`\`\`markdown
---
***
___
\`\`\`

---

## Quotes


> Simple blockquote
> Multiple lines
> In the same quote

> First level
>> Second level
>>> Third level


---

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

You can also use inline footnotes^[Like this one].

[^note]: Footnotes can have identifiers instead of numbers.

---

## Comments

\`\`\`markdown
%%
This text won't be visible in preview mode
It can span multiple lines
%%

This text includes a %%hidden comment%% within it.
\`\`\`

---

## Advanced Formatting

### Inline HTML

\`\`\`markdown
<span style="color:red">Red text</span>

<mark>Highlighted text</mark>

<u>Underlined text</u>

<div align="center">
  <h2>Centered heading</h2>
  <p>Centered paragraph</p>
</div>
\`\`\`

### Alignment

\`\`\`markdown
<p align="left">Left aligned text</p>
<p align="center">Center aligned text</p>
<p align="right">Right aligned text</p>
\`\`\`

### Text Size

\`\`\`markdown
<span style="font-size:0.8em;">Smaller text</span>
<span style="font-size:1.5em;">Larger text</span>
\`\`\`

---

## YAML Frontmatter

\`\`\`markdown
---
title: Note Title
tags: [tag1, tag2, tag3]
date: 2023-01-01
aliases: [alternative name, another name]
cssclass: custom-class
---
\`\`\`

More advanced frontmatter:

\`\`\`markdown
---
title: Project Document
created: 2023-01-15
modified: 2023-12-20
status: In Progress
priority: High
completion: 75%
due: 2024-01-15
authors:
  - Name One
  - Name Two
related:
  - [[Linked Note 1]]
  - [[Linked Note 2]]
metadata:
  key1: value1
  key2: value2
---
\`\`\`

---

## Diagrams

### Mermaid Diagrams


\`\`\`mermaid
graph TD;
    A[Start] --> B{Decision};
    B -->|Yes| C[Process 1];
    B -->|No| D[Process 2];
    C --> E[End];
    D --> E;
\`\`\`


#### Flowchart


\`\`\`mermaid
flowchart LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]

\`\`\`


#### Sequence Diagram


\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
\`\`\`


#### Class Diagram


\`\`\`mermaid
classDiagram
    Class01 <|-- AveryLongClass : Cool
    Class03 *-- Class04
    Class05 o-- Class06
    Class07 .. Class08
    Class09 --> C2 : Where am I?
    Class09 --* C3
    Class09 --|> Class07
    Class07 : equals()
    Class07 : Object[] elementData
    Class01 : size()
    Class01 : int chimp
    Class01 : int gorilla
\`\`\`

#### Gantt Chart


\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in another  :2023-01-12, 12d
    another task     :24d
\`\`\`

#### Entity Relationship Diagram


\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
\`\`\`

### Diagram Syntax (with Diagrams Plugin)

\`\`\`\`markdown
\`\`\`plantuml
@startuml
Bob -> Alice : hello
@enduml
\`\`\`
\`\`\`\`

---

## LaTeX Math

### Inline Math

\`\`\`markdown
The formula for the area of a circle is $A = \\pi r^2$.
\`\`\`

### Block Math

\`\`\`markdown
$$
\\begin{align}
\\frac{d}{dx}e^x &= e^x \\\\
\\int_{0}^{1} x^2 dx &= \\frac{1}{3}
\\end{align}
$$
\`\`\`

### Advanced Math Formatting

\`\`\`markdown
$$
\\begin{cases}
a_1x+b_1y+c_1z=d_1 \\\\
a_2x+b_2y+c_2z=d_2 \\\\
a_3x+b_3y+c_3z=d_3
\\end{cases}
$$

$$
\\begin{bmatrix}
a & b & c \\\\
d & e & f \\\\
g & h & i
\\end{bmatrix}
\\times
\\begin{bmatrix}
j & k \\\\
l & m \\\\
n & o
\\end{bmatrix}
=
\\begin{bmatrix}
? & ? \\\\
? & ? \\\\
? & ?
\\end{bmatrix}
$$
\`\`\`

---

## Keyboard Keys

\`\`\`markdown
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.

Use <kbd>Alt</kbd> + <kbd>Tab</kbd> to switch windows.
\`\`\`

---

## Embedded Content

### Embedded YouTube Videos (with iframe)


<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Embedded Maps


<iframe width="425" height="350" src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik" frameborder="0"></iframe>

---

## Collapsible Sections


<details>
  <summary>Click to expand</summary>
  
  This content is hidden by default but can be expanded.
  
  - You can include lists
  - And other **markdown** elements
  
  \`\`\`python
  print("Even code blocks!")


</details> \`\`\`

---

## Advanced Obsidian-Specific Features

### Dataview Queries (with Dataview plugin)

\`\`\`\`markdown
\`\`\`dataview
TABLE file.ctime as "Created", file.mtime as "Last Modified"
FROM "folder"
SORT file.mtime DESC
\`\`\`
\`\`\`\`

### Tags with Nested Hierarchies

\`\`\`markdown
#parent/child/grandchild
\`\`\`

### Block References

\`\`\`markdown
This is a paragraph that can be referenced. ^reference-id

Later, I can refer to [[Note Name#^reference-id]].
\`\`\`

### Checkbox Status

\`\`\`markdown
- [?] needs more info
- [!] important
- [>] forwarded
- [<] scheduling
- [+] improvement/addition
- [-] cancelled/removed
\`\`\`

---

## CSS Classes and Custom Styling

### Custom CSS Classes

\`\`\`markdown
<div class="custom-class">
  Content with custom styling
</div>
\`\`\`

In your CSS snippet:

\`\`\`css
.custom-class {
  color: purple;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  border-left: 3px solid blue;
}
\`\`\`

### Inline Styling

\`\`\`markdown
<span style="color:blue;font-weight:bold;text-decoration:underline;">
  Customized inline text
</span>
\`\`\`

---

## Multi-Column Layout

### Basic Two-Column Layout

\`\`\`markdown
<div style="display: flex;">
  <div style="flex: 1; padding-right: 10px;">
    Left column content
  </div>
  <div style="flex: 1; padding-left: 10px;">
    Right column content
  </div>
</div>
\`\`\`

### Advanced Multi-Column Callouts (with CSS Snippets)

\`\`\`markdown
> [!multi-column]
>
> > [!note]+ Column 1
> > This is the content of the first column
> > - Item 1
> > - Item 2
>
> > [!warning]+ Column 2
> > This is the content of the second column
> > \`\`\`python
> > print("Code in the second column")
> > \`\`\`
>
> > [!success]+ Column 3
> > This is the content of the third column
> > ![[image.jpg]]
\`\`\`

---

## Formatting Combinations

### Styled Task Lists

\`\`\`markdown
- [ ] <span style="color:red;">High priority task</span>
- [x] <span style="color:green;">~~Completed task~~</span>
- [ ] *Italic task description*
\`\`\`

### Callout with Table

\`\`\`markdown
> [!INFO] Project Status
> | Task | Status | Due Date |
> |------|--------|----------|
> | Research | Complete | 2023-10-15 |
> | Design | In Progress | 2023-11-01 |
> | Testing | Not Started | 2023-12-10 |
\`\`\`

### Advanced Header with Tags and Status

\`\`\`markdown
## Project Alpha #project/alpha #status/active 
### Current Sprint: Sprint 7 (Nov 15-30) 🚀
\`\`\`

### Advanced Custom Document Reference

\`\`\`markdown
> 📄 **Reference**: [[Meeting Notes 2023-10-15#Key Decisions|Key Decisions from Oct 15 Meeting]] > Decision #3
\`\`\`

---

## Additional Tips and Tricks

### Connecting Notes with Advanced Queries

Combine internal links with specific parameters for creating advanced cross-references:

\`\`\`markdown
For more details, see [[Project Overview#Scope|project scope]] and related [[Team Structure#Development Team|team assignments]].

As mentioned in the [[Q3 Planning#^budget-approval|budget approval discussion]], we need to...
\`\`\`

### Creating Interactive Checklists

\`\`\`markdown
## Project Phases

### Phase 1: Planning ✅
- [x] Define project scope
- [x] Identify stakeholders
- [x] Set timeline

### Phase 2: Implementation 🚧
- [x] Setup development environment
- [ ] Complete backend API
  - [x] Authentication module
  - [ ] Data processing pipeline
- [ ] Integrate with frontend

### Phase 3: Testing 🔄
- [ ] Write test cases
- [ ] Perform unit testing
- [ ] Conduct user acceptance testing
\`\`\`

### Tracking Changes with Comments

\`\`\`markdown
This is the current implementation. %%Previous approach was to use a different algorithm, but performance testing showed issues%%

We selected option B for this project. %%Options A and C were rejected due to cost concerns%%
\`\`\`

### Customizing Syntax with Custom CSS Snippets

Apply custom CSS to enhance specific elements:

\`\`\`css
/* Custom horizontal separator */
hr {
  height: 1px;
  border: none;
  background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));
}

/* Better blockquotes */
blockquote {
  border-left: 3px solid #5a78e0;
  background-color: rgba(90, 120, 224, 0.1);
  padding: 15px;
  border-radius: 5px;
}
\`\`\`

### Advanced Code Block with Filename

\`\`\`\`markdown
\`\`\`javascript:app.js
// This code is from app.js
function initialize() {
  console.log("Application starting...");
}
\`\`\`\`

\`\`\`

---

**Note**: Some of these features may require specific plugins or CSS snippets in Obsidian to work properly. Always check the Obsidian documentation or community resources for the most up-to-date information.
\`\`\``;export{n as default};
