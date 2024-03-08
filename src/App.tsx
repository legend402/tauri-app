import { Col, Input, Row, Select, Spin } from 'antd'
import type { SelectProps } from 'antd'
import "./App.css";
import { DirectoryTree } from "./components/DirectoryTree";

function App() {
  const [searchText, setSearchText] = useState('')
  const [rootPath, setRootPath] = useState("D:\\")
  const [ignoreList, setIgnoreList] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const options: SelectProps['options'] = [];
  const onSearch = async (value: string) => {
    setSearchText(value)
  };
  const handleRootPath = (value: string) => {
    setRootPath(value)
  };

  const onSearching = (flag: boolean) => {
    setIsSearching(flag)
  }
  const handleChange = (value: string[]) => {
    setIgnoreList(value.join(','))
  };

  return (
    <div w-full>
      <Spin spinning={isSearching} tip="正在搜索中...">
        <Row gap="4" mb-4>
          <Col span={8}>
            <Input.Search
              placeholder="搜索文件"
              defaultValue={searchText}
              allowClear
              enterButton="确定"
              onSearch={onSearch}
            />
          </Col>
          <Col span={8}>
            <Input.Search
                placeholder="设置根目录节点"
                defaultValue={rootPath}
                allowClear
                enterButton="确定"
                onSearch={handleRootPath}
              />
          </Col>
          <Col span={8}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="请输入忽略文件，按回车确定"
              onChange={handleChange}
              options={options}
            />
          </Col>
        </Row>
      </Spin>
      <DirectoryTree searchText={searchText} rootPath={rootPath} ignoreList={ignoreList} onSearching={onSearching} />
    </div>
  );
}

export default App;
