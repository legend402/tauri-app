import { invoke } from '@tauri-apps/api/tauri'
import { Dropdown } from 'antd'
import type { MenuProps, TreeDataNode } from "antd"
import type { FC } from "react"

interface TreeNodeProps {
  data: TreeDataNode,
  originName?: boolean,
}

const openFile = async (path: string) => {
  await invoke('open_file', { path, isOpen: true });
}

const handleAction = {
  openDir: async (path: string) => {
    await invoke('open_file', { path, isOpen: false });
  },
  openFile,
  copyPath: (text: string) => {
    navigator.clipboard.writeText(text)
  }
}

export const TreeNode: FC<TreeNodeProps> = ({ data, originName = false }) => {
  const fileName = useMemo(() => {
    if (originName) return data.key
    return (data.key as string).replaceAll('\\', '/').split('/').filter(Boolean).pop()
  }, [data.key])

  const items: MenuProps['items'] = useMemo(() => {
    const buttons = [
      {
        key: 'openDir',
        label: '打开在文件夹中的位置',
      },
      {
        key: 'copyPath',
        label: '复制路径',
      },
    ]
    if (data.isLeaf) {
      buttons.push({
        key: 'openFile',
        label: '打开文件',
      })
    }
    return buttons
  }, [data.isLeaf]);
  const onClick: MenuProps['onClick'] = ({ key }) => {
    handleAction[key as keyof typeof handleAction](data.key as string)
  };
  return <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
    <span onClick={(e) => e.stopPropagation()}>{fileName}</span>
  </Dropdown>
}