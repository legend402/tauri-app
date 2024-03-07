import { Tree } from "antd";
import { type FC } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import type { TreeDataNode } from 'antd';
import { TreeNode } from "./TreeNode";
import { useSearchingFile } from "../utils/hooks/useSearchingFile";

export interface Message {
  code: number
  message: string
  data: FileInfo[]
}

export interface FileInfo {
  file_type: 'dir' | 'file',
  path: string,
  file_name: string,
}
export type DirectoryTreeProps = {
  searchText?: string
  rootPath?: string
}

function getFileList(path: string) {
  return invoke<Message>("get_file_list", { path })
}
const updateTreeData = (list: TreeDataNode[], key: string, children: TreeDataNode[]): TreeDataNode[] => 
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
export const DirectoryTree: FC<DirectoryTreeProps> = (props) => {
  const [fileList, setFileList] = useState<TreeDataNode[]>([]);
  const [mode, setMode] = useState('normal')

  useEffect(() => {
    setMode('normal')
    initDirectoryTree();
  }, [props.rootPath]);

  useEffect(() => {
    if (props.searchText) {
      setMode('searching')
      startSearch();
    }
  }, [props.searchText]);

  async function initDirectoryTree(path: string = '/') {
    const { code, message, data } = await getFileList(props.rootPath || path)
    if (code === 200) {
      const formatData = data.map(file => {
        return {
          title: file.path,
          key: file.path,
          isLeaf: file.file_type === 'file',
        }
      })
      setFileList(formatData);
    } else {
      console.log(message);
    }
  }
  const onloadData = (node: TreeDataNode) => {
    return new Promise<void>((resolve) => {
      if (node.children) {
        resolve();
        return;
      }

      getFileList(node.key as string).then(({ data, code }) => {
        if (code === 200) {
          const children = data.map(file => {
            return {
              title: file.path,
              key: file.path,
              isLeaf: file.file_type === 'file',
            } 
          })
          if (mode === 'searching') {
            setResult((origin) =>
              updateTreeData(origin, node.key as string, children),
            );
          } else {
            setFileList((origin) =>
              updateTreeData(origin, node.key as string, children),
            );
          }
          resolve()
        } else {
          resolve()
        }
      })
    })
  }
  const { result, startSearch, isSearching, setResult } = useSearchingFile({
    text: props.searchText,
    dir: props.rootPath,
  })

  const actualList = useMemo(() => mode === 'searching' ? result : fileList, [mode, result, fileList])

  return <>
    <Tree.DirectoryTree
      loadData={onloadData}
      treeData={actualList}
      height={530}
      titleRender={(data) => <TreeNode data={data} originName={ mode === 'searching' } />}>
    </Tree.DirectoryTree>
  </>
}