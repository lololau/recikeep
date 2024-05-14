"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export default function QuillRead({ text }: { text: string }) {
	return (
		<div className="text-lg gap-2">
			<QuillEditor value={text} readOnly={true} theme={"bubble"} />
		</div>
	);
}
