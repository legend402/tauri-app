use std::{env, path::PathBuf, process::Command};

use super::file_struct::Message;

#[tauri::command]
pub async fn open_file(path: &str) -> Result<Message<String>, Message<String>> {
  println!("open file: {}", "D:".to_owned()+path);
  let output = match env::consts::OS {
    // 对于 Unix-like 系统（包括 Linux 和 macOS）
    "linux" | "macos" => Command::new("xdg-open").arg("D:".to_owned()+path).output().unwrap(),
    // 对于 Windows 系统
    "windows" => Command::new("explorer.exe").arg("D:".to_owned()+path).output().unwrap(),
    _ => return Err(Message {
      message: format!("Unsupported operating system: {}", env::consts::OS),
      code: 0,
      data: "".to_string(),
    }),
  };

  // 检查输出以确保程序成功启动（这只是一个简单的示例，实际情况可能需要更复杂的错误处理）
  if !output.status.success() {
    println!("Failed to start the file manager. Error: {:?}", output);
    return Ok(Message {
      message: format!("Unsupported operating system: {}", env::consts::OS),
      code: 0,
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