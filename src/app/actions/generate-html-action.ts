
'use server';

interface GeneratePortfolioHtmlInput {
  staticMarkup: string;
  name: string | undefined;
  includeScripts?: boolean;
}

export async function generatePortfolioHtmlAction(input: GeneratePortfolioHtmlInput) {
  try {
    const { staticMarkup, name, includeScripts = false } = input;
    
    const scriptsAndStyles = includeScripts ? `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Mono:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Source+Code+Pro:wght@400;700&family=Montserrat&family=Lora&display=swap" rel="stylesheet">
    ` : `
        <link rel="stylesheet" href="style.css">
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name || 'Portfolio'}</title>
        ${scriptsAndStyles}
        <style>
          /* This is a basic style reset */
          body, h1, h2, h3, p, div { margin: 0; padding: 0; box-sizing: border-box; }
        </style>
      </head>
      <body>
        ${staticMarkup}
        <script src="script.js"></script>
      </body>
      </html>
    `;

    return { success: true, data: { html: fullHtml } };
  } catch (error) {
    console.error('HTML Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}
