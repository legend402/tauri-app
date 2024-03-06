import "./App.css";
import { DirectoryTree } from "./components/DirectoryTree";

function App() {
  return (
    <div w-full>
      {/* <p text-lg text-blue>file list:</p>
      <div flex="~ gap-4" pl-4>
        <div i-carbon-skip-back-filled cursor-pointer text-blue></div>
        <div i-carbon-skip-forward-filled cursor-pointer text-blue></div>
      </div> */}
      <DirectoryTree />
    </div>
  );
}

export default App;
