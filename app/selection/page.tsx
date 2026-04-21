"use client";

import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useFlow } from "@/lib/flow-context";

export default function SelectionPage() {
  const router = useRouter();
  const { files, selectedFile, setSelectedFile, removeFile } = useFlow();

  return (
    <ScreenLayout title="Select file" subtitle="Choose the main file for print settings.">
      <div className="list">
        {files.length === 0 ? (
          <p>No files available. Add one in Upload.</p>
        ) : (
          files.map((file) => (
            <label className="file-item" key={file}>
              <input
                type="radio"
                checked={selectedFile === file}
                onChange={() => setSelectedFile(file)}
              />
              <span>{file}</span>
              <button type="button" className="text" onClick={() => removeFile(file)}>
                Remove
              </button>
            </label>
          ))
        )}
      </div>
      <div className="row">
        <button className="secondary" type="button" onClick={() => router.push("/upload")}>Back</button>
        <button className="primary" type="button" onClick={() => router.push("/settings")}>Continue</button>
      </div>
    </ScreenLayout>
  );
}
