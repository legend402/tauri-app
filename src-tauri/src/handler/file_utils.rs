use std::{env, path::PathBuf, process::Command};

use super::file_struct::Message;

#[tauri::command]
pub async fn open_file(path: &str) -> Result<Message<String>, Message<String>> {
  let mut path_buf = PathBuf::from("D:\\");
  path_buf.push(&path);
  let output = match env::consts::OS {
    // 对于 Unix-like 系统（包括 Linux 和 macOS）
    "linux" | "macos" => Command::new("xdg-open").arg(path_buf).output().unwrap(),
    // 对于 Windows 系统
    "windows" => Command::new("explorer.exe").arg(path_buf).output().unwrap(),
    _ => return Err(Message {
      message: format!("Unsupported operating system: {}", env::consts::OS),
      code: 01,
      data: "".to_string(),
    }),
  };

  // 检查输出以确保程序成功启动（这只是一个简单的示例，实际情况可能需要更复杂的错误处理）
  if !output.status.success() {
    println!("Failed to start the file manager. Error: {:?}", output);
    return Ok(Message {
      message: format!("Unsupported operating system: {}", env::consts::OS),
      code: 02,
      data: "".to_string(),
    })
  } else {
    Ok(Message {
      message: "success".to_string(),
      code: 0,
      data: "".to_string(),
    })
  }
}