import { Col, Input, Row } from 'antd'
import "./App.css";
import { DirectoryTree } from "./components/DirectoryTree";

function App() {
  const [searchText, setSearchText] = useState("")
  const [rootPath, setRootPath] = useState("D:\\work-space")

  const onSearch = async (value: string) => {
    setSearchText(value)
  };
  const handleRootPath = (value: string) => {
    setRootPath(value)
  };

  return (
    <div w-full>
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
      </Row>
      <DirectoryTree searchText={searchText} rootPath={rootPath} />
    </div>
  );
}

export default App;
