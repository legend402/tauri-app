import { invoke } from '@tauri-apps/api/tauri'
import { Dropdown } from 'antd'
import type { MenuProps, TreeDataNode } from "antd"
import type { FC } from "react"

interface TreeNodeProps {
  data: TreeDataNode,
  originName?: boolean,
}

const openFile = async (path: string) => {
  console.log(await invoke('open_file', { path }));
}

export const TreeNode: FC<TreeNodeProps> = ({ data, originName = false }) => {
  const fileName = useMemo(() => {
    if (originName) return data.key
    return (data.key as string).replaceAll('\\', '/').split('/').filter(Boolean).pop()
  }, [data.key])

  const items: MenuProps['items'] = useMemo(() => data.isLeaf ? [
    {
      key: 'openDir',
      label: '打开在文件夹中的位置',
    },
    {
      key: 'openFile',
      label: '打开文件',
    },
  ] : 
  [
    {
      key: 'openDir',
      label: '打开在文件夹中的位置',
    },
  ], [data.isLeaf]);
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'openDir') {
      openFile(data.key as string)
    }
  };
  return <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
    <span onClick={(e) => e.stopPropagation()}>{fileName}</span>
  </Dropdown>
}