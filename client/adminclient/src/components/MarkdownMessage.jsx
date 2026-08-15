import ReactMarkdown from "react-markdown";

// Chat bubbles are small, so the browser's default margins on <p>/<ul>/<h*>
// are far too generous — they leave a bubble mostly whitespace. Every element
// the model realistically emits is mapped to a compact equivalent, and
// headings render as bold text rather than display-size type.
const components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-0.5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-snug">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <p className="font-semibold mb-1">{children}</p>,
  h2: ({ children }) => <p className="font-semibold mb-1">{children}</p>,
  h3: ({ children }) => <p className="font-semibold mb-1">{children}</p>,
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-black/10 text-[0.85em]">
      {children}
    </code>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-2"
    >
      {children}
    </a>
  ),
};

export default function MarkdownMessage({ text }) {
  return (
    <div className="break-words">
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );
}
