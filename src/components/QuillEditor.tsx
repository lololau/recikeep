import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export default function QuillEditorComponent({
	value,
	setValue,
}: { value: string; setValue: (newValue: string) => void }) {
	const quillModules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image"],
			[{ align: [] }],
			[{ color: [] }],
			["code-block"],
			["clean"],
		],
	};

	const quillFormats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"list",
		"bullet",
		"link",
		"image",
		"align",
		"color",
		"code-block",
	];

	const handleEditorChange = (newContent: string) => {
		setValue(newContent);
	};

	return (
		<main>
			<div className="h-[25vh] items-center">
				<div className="h-full">
					<QuillEditor
						value={value}
						onChange={handleEditorChange}
						modules={quillModules}
						formats={quillFormats}
						className="h-full w-full"
					/>
				</div>
			</div>
		</main>
	);
}
