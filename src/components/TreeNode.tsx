import { invoke } from '@tauri-apps/api/tauri'
import { Dropdown, message } from 'antd'
import type { MenuProps, TreeDataNode } from "antd"
import type { FC } from "react"

interface TreeNodeProps {
  data: TreeDataNode
}

const openFile = async (path: string) => {
  console.log(await invoke('open_file', { path }));
}

export const TreeNode: FC<TreeNodeProps> = ({ data }) => {
  const fileName = useMemo(() => {
    return (data.key as string).replaceAll('\\', '/').split('/').pop()
  }, [data.key])

  const items: MenuProps['items'] = useMemo(() => data.isLeaf ? [
    {
    key: 'openFile',
    label: '打开文件',
  }
  ] : 
  [
    {
      key: 'openDir',
      label: '打开在文件夹中的位置',
    },
    {
      key: 'openFile',
      label: '打开文件',
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