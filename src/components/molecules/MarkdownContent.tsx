'use client';

import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content with styled HTML elements.
 * Uses a simple parser for markdown-to-HTML conversion.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const html = parseMarkdown(content);

  return (
    <div
      className={cn(
        'prose prose-invert prose-neutral max-w-none',
        // Headings
        'prose-h1:text-3xl prose-h1:font-bold prose-h1:text-white prose-h1:mb-6 prose-h1:mt-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-neutral-700',
        'prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-white prose-h2:mb-4 prose-h2:mt-8',
        'prose-h3:text-xl prose-h3:font-semibold prose-h3:text-white prose-h3:mb-3 prose-h3:mt-6',
        'prose-h4:text-lg prose-h4:font-medium prose-h4:text-white prose-h4:mb-2 prose-h4:mt-4',
        // Paragraphs and text
        'prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4',
        'prose-strong:text-white prose-strong:font-semibold',
        'prose-em:text-neutral-200',
        // Links
        'prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 hover:prose-a:underline',
        // Lists
        'prose-ul:text-neutral-300 prose-ul:my-4 prose-ul:pl-6',
        'prose-ol:text-neutral-300 prose-ol:my-4 prose-ol:pl-6',
        'prose-li:mb-2',
        // Code
        'prose-code:text-primary-300 prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
        'prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-700 prose-pre:rounded-lg',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-neutral-800/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:text-neutral-300 prose-blockquote:not-italic',
        // Tables
        'prose-table:border-collapse prose-table:w-full',
        'prose-th:bg-neutral-800 prose-th:text-white prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-neutral-700',
        'prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-neutral-700 prose-td:text-neutral-300',
        // Horizontal rule
        'prose-hr:border-neutral-700 prose-hr:my-8',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Simple markdown parser that converts markdown to HTML.
 * Handles: headings, bold, italic, links, lists, code, blockquotes, tables, hr
 */
function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Escape HTML entities first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Parse tables first (before other processing)
  html = parseTables(html);

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr />');

  // Headers (must come before other processing)
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Unordered lists
  html = parseUnorderedLists(html);

  // Ordered lists
  html = parseOrderedLists(html);

  // Paragraphs (wrap remaining text blocks)
  html = parseParagraphs(html);

  return html;
}

function parseTables(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableRow = line.trim().startsWith('|') && line.trim().endsWith('|');
    const isSeparator = /^\|[\s\-:|]+\|$/.test(line.trim());

    if (isTableRow || isSeparator) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);
    } else {
      if (inTable) {
        result.push(convertTableToHtml(tableLines));
        inTable = false;
        tableLines = [];
      }
      result.push(line);
    }
  }

  if (inTable) {
    result.push(convertTableToHtml(tableLines));
  }

  return result.join('\n');
}

function convertTableToHtml(lines: string[]): string {
  if (lines.length < 2) return lines.join('\n');

  const headerLine = lines[0];
  const separatorIndex = lines.findIndex((line) =>
    /^\|[\s\-:|]+\|$/.test(line.trim())
  );

  if (separatorIndex === -1) return lines.join('\n');

  const headerCells = headerLine
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
  const bodyLines = lines.slice(separatorIndex + 1);

  let tableHtml = '<table><thead><tr>';
  headerCells.forEach((cell) => {
    tableHtml += `<th>${cell}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  bodyLines.forEach((line) => {
    if (line.trim()) {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      tableHtml += '<tr>';
      cells.forEach((cell) => {
        // Parse links in table cells
        const cellWithLinks = cell.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        tableHtml += `<td>${cellWithLinks}</td>`;
      });
      tableHtml += '</tr>';
    }
  });

  tableHtml += '</tbody></table>';
  return tableHtml;
}

function parseUnorderedLists(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const match = line.match(/^- (.+)$/);
    if (match) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(`<li>${match[1]}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line);
    }
  }

  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

function parseOrderedLists(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const match = line.match(/^\d+\. (.+)$/);
    if (match) {
      if (!inList) {
        result.push('<ol>');
        inList = true;
      }
      result.push(`<li>${match[1]}</li>`);
    } else {
      if (inList) {
        result.push('</ol>');
        inList = false;
      }
      result.push(line);
    }
  }

  if (inList) {
    result.push('</ol>');
  }

  return result.join('\n');
}

function parseParagraphs(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let paragraphLines: string[] = [];

  const isBlockElement = (line: string) => {
    return (
      line.startsWith('<h') ||
      line.startsWith('<ul') ||
      line.startsWith('</ul') ||
      line.startsWith('<ol') ||
      line.startsWith('</ol') ||
      line.startsWith('<li') ||
      line.startsWith('<table') ||
      line.startsWith('</table') ||
      line.startsWith('<thead') ||
      line.startsWith('</thead') ||
      line.startsWith('<tbody') ||
      line.startsWith('</tbody') ||
      line.startsWith('<tr') ||
      line.startsWith('</tr') ||
      line.startsWith('<th') ||
      line.startsWith('<td') ||
      line.startsWith('<hr') ||
      line.startsWith('<blockquote') ||
      line.trim() === ''
    );
  };

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(' ').trim();
      if (text) {
        result.push(`<p>${text}</p>`);
      }
      paragraphLines = [];
    }
  };

  for (const line of lines) {
    if (isBlockElement(line)) {
      flushParagraph();
      if (line.trim()) {
        result.push(line);
      }
    } else {
      paragraphLines.push(line);
    }
  }

  flushParagraph();

  return result.join('\n');
}
