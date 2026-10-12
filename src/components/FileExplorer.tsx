import { useState } from "react";

import {
  Folder,
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown
} from "lucide-react";

type Props = {
  files: any[];
  selectedFile: string;
  setSelectedFile: (file: string) => void;
};

function buildTree(files: any[]) {
  const root: any = {};

  files.forEach((file: any) => {
    const parts: string[] = file.filename.split("/");

    let current = root;

    parts.forEach((part: string, index: number) => {
      if (!current[part]) {
        current[part] = {};
      }

      if (index === parts.length - 1) {
        current[part]._file = file;
      }

      current = current[part];
    });
  });

  return root;
}
function TreeNode({
  name,
  node,
  level,
  selectedFile,
  setSelectedFile,
}: any) {
  const [open, setOpen] = useState(true);

  const isFile = node._file;

  // File
  if (isFile) {
    return (
      <div
        style={{ paddingLeft: level * 16 }}
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer
        ${
          selectedFile === node._file.filename
            ? "bg-cyan-500/20 text-white"
            : "hover:bg-white/10 text-slate-300"
        }`}
        onClick={() => setSelectedFile(node._file.filename)}
      >
        <FileCode size={15} />
        <span>{name}</span>
      </div>
    );
  }

  // Folder
  return (
    <>
      <div
        style={{ paddingLeft: level * 16 }}
        className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-white/10"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronDown size={15} />
        ) : (
          <ChevronRight size={15} />
        )}

        {open ? (
          <FolderOpen size={15} />
        ) : (
          <Folder size={15} />
        )}

        <span>{name}</span>
      </div>

      {open &&
        Object.entries(node)
          .filter(([key]) => key !== "_file")
          .map(([key, value]) => (
            <TreeNode
              key={key}
              name={key}
              node={value}
              level={level + 1}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          ))}
    </>
  );
}

export default function FileExplorer({
  files,
  selectedFile,
  setSelectedFile,
}: Props) {

  const tree = buildTree(files);

  return (
    <div className="text-sm text-slate-200">
      {Object.entries(tree).map(([key, value]) => (
        <TreeNode
          key={key}
          name={key}
          node={value}
          level={0}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      ))}
    </div>
  );

}