import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const body = `
  Marked - Markdown Parser
========================

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

How To Use The Demo
-------------------

1. Type in stuff on the left.
2. See the live updates on the right.

That's it.  Pretty simple.  There's also a drop-down option in the upper right to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

Why Markdown?
-------------

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

Ready to start writing?  Either start changing stuff on the left or
[clear everything](/demo/?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns
    `;

  res.json({
    name: "v1.0.0",
    notes: body,
    pub_date: "2020-06-22T19:25:57Z",
    platforms: {
      darwin: {
        signature: "",
        url: "https://github.com/lemarier/tauri-test/releases/download/v1.0.0/app.app.tar.gz",
      },
      linux: {
        signature: "",
        url: "https://github.com/lemarier/tauri-test/releases/download/v1.0.0/app.AppImage.tar.gz",
      },
      win64: {
        signature: "",
        url: "https://github.com/lemarier/tauri-test/releases/download/v1.0.0/app.x64.msi.zip",
      },
    },
  });
}
