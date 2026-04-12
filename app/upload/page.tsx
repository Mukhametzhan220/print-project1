"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useFlow } from "@/lib/flow-context";

export default function UploadPage() {
  const router = useRouter();
  const { files, addFile } = useFlow();
  const [filename, setFilename] = useState("");

  const onAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!filename.trim()) return;
    addFile(filename.trim());
    setFilename("");
  };

  return (
    <ScreenLayout title="Upload files" subtitle="Add documents you want to print.">
      <form onSubmit={onAdd} className="row">
        <input
          type="text"
          placeholder="File name e.g. Report.pdf"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <button className="secondary" type="submit">Add</button>
      </form>

      <ul className="list">
        {files.length === 0 ? <li>No files yet.</li> : files.map((file) => <li key={file}>{file}</li>)}
      </ul>

      <div className="row">
        <button className="secondary" type="button" onClick={() => router.push("/dashboard")}>Back</button>
        <button className="primary" type="button" onClick={() => router.push("/selection")}>Continue</button>
      </div>
    </ScreenLayout>
  );
}
