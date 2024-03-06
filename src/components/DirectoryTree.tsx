import { Tooltip, Tree } from "antd";
import { type FC } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import type { TreeDataNode } from 'antd';
import { TreeNode } from "./TreeNode";

interface Message {
  code: number
  message: string
  data: {
    file_type: 'dir' | 'file',
    path: string,
  }[]
}
export type DirectoryTreeProps = {

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
export const DirectoryTree: FC<DirectoryTreeProps> = () => {
  const [fileList, setFileList] = useState<TreeDataNode[]>([]);

  useEffect(() => {
    initDirectoryTree();
  }, []);

  async function initDirectoryTree(path: string = '/') {
    const { code, message, data } = await getFileList(path)
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
  const onloadData = useCallback((node: TreeDataNode) => {
    return new Promise<void>((resolve, reject) => {
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
          setFileList((origin) =>
            updateTreeData(origin, node.key as string, children),
          );
          resolve()
        } else {
          resolve()
        }
      })
    })
  }, [])
  return <>
    <Tree.DirectoryTree 
      loadData={onloadData}
      treeData={fileList}
      titleRender={(data) => <TreeNode data={data} />}>
    </Tree.DirectoryTree>
  </>
}