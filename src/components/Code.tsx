import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const CodeBlock = ({ ...props }) => {
	return (
		<SyntaxHighlighter
			language={props.className?.replace(/(?:lang(?:uage)?-)/, "")}
			style={materialOceanic}
			wrapLines={true}
			className="not-prose rounded-md"
		>
			{props.children}
		</SyntaxHighlighter>
	);
};

export const Pre = ({ ...props }) => {
	return <div className="not-prose">{props.children}</div>;
};
// source: https://dev.to/acidop/i-built-an-markdown-editor-using-nextjs-and-tailwindcss-46bg
