import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

interface Message {
  code: number
  message: string
  data: any
}

function App() {
  const [fileList, setFileList] = useState([]);

  async function getFileList(path: string = '/') {
    const { code, message, data } = await invoke<Message>("get_file_list", { path })
    if (code === 200) {
      setFileList(data);
    } else {
      console.log(message);
    }
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
      <ul list-none>
        {
          fileList.map((file, i) => (<li key={file} cursor-pointer onClick={() => getFileList(file)}>
            {i + 1}、{file}
          </li>))
        }
      </ul>
    </div>
  );
}

export default App;
