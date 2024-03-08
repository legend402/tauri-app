import { listen } from "@tauri-apps/api/event";
import type { UnlistenFn } from '@tauri-apps/api/event';
import type { FileInfo } from "../../components/DirectoryTree";
import { invoke } from "@tauri-apps/api";
import { message } from "antd";
import type { TreeDataNode } from 'antd';

interface SearchFileProps {
  text?: string
  dir?: string
  ignoreList?: string
}

type SearchFileReturn = {
  code: number
  message: string
  data: FileInfo
}

export const useSearchingFile = (payload: SearchFileProps) => {
  const [isSearching, setSearching] = useState(false)
  const [result, setResult] = useState<TreeDataNode[]>([])
  let unSearchListen: UnlistenFn = () => {}

  const startSearch = async () => {
    if (!payload.text) {
      message.warning('请输入搜索内容')
      return
    }
    if (isSearching) {
      message.warning('正在搜索中，请勿重复操作')
      return
    }
    setSearching(true)
    setResult([])
    unSearchListen = await listen<SearchFileReturn>('searching', ({ payload }) => {
      setResult((origin) => {
        if (payload.code === 200) {
          return origin.concat({
            title: payload.data.path,
            key: payload.data.path,
            isLeaf: payload.data.file_type === 'file',
          })
        } else {
          return origin
        }
      })
    })
    console.time('search-file')
    invoke('search_file', { dir: payload.dir, text: payload.text, ignore: payload.ignoreList })
  }
  listen('search-end', () => {
    console.timeEnd('search-file')
    unSearchListen()
    setSearching(false)
  })

  return {
    isSearching,
    startSearch,
    setResult,
    result,
  }
};