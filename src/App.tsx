import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import "./App.css";

interface Message {
  code: number
  message: string
  data: string[]
}

function App() {
  const [fileList, setFileList] = useState<TreeDataNode[]>([]);

  async function getFileList(path: string = '/') {
    const { code, message, data } = await invoke<Message>("get_file_list", { path })
    if (code === 200) {
      setFileList(data.map(file => {
        return {
          title: file,
          key: file,
          isLeaf: false,
        }
      }));
    } else {
      console.log(message);
    }
  }

  function onLoadData() {

  }

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <div w-full>
      <p text-lg text-blue>file list:</p>
      <div flex="~ gap-4" pl-4>
        <div i-carbon-skip-back-filled cursor-pointer text-blue></div>
        <div i-carbon-skip-forward-filled cursor-pointer text-blue></div>
      </div>
      <Tree.DirectoryTree treeData={fileList} />
    </div>
  );
}

export default App;
