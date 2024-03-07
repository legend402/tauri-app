use std::path::PathBuf;
use std::{env, fs, thread};

use super::file_struct::Message;

#[derive(serde::Serialize)]
pub struct FileList {
  file_type: String,
  path: String,
  file_name: String,
}
// Implement Clone for FileList
impl Clone for FileList {
    fn clone(&self) -> Self {
        Self {
            file_type: self.file_type.clone(),
            path: self.path.clone(),
            file_name: self.file_name.clone(),
        }
    }
}
// Then, implement Clone for Message<FileList>
impl Clone for Message<FileList> {
    fn clone(&self) -> Self {
        Self {
            message: self.message.clone(),
            code: self.code,
            data: self.data.clone(),
        }
    }
}

#[tauri::command]
pub async fn get_file_list(path: &str) -> Result<Message<Vec<FileList>>, Message<Vec<FileList>>> {
  if env::consts::OS == "windows" && path == "/" {
    return Ok(Message {
      message: "success".to_string(),
      code: 200,
      data: get_windows_drive_roots(),
    })
  }
  let mut file_list = Vec::new();
  let dir = String::from(path.to_owned());
  
  // 判断地址是不是文件夹
  if !fs::metadata(&dir).unwrap().is_dir() {
    return Ok(Message {
      message: "is not dir".to_string(),
      code: 0,
      data: file_list,
    })
  } 
  for entry in fs::read_dir(dir).unwrap() {
    let path = entry.unwrap().path();
    file_list.push(
      FileList {
        file_type: get_file_type(&path),
        path: path.display().to_string(),
        file_name: String::from(path.file_name().unwrap().to_string_lossy()),
      }
    );
  }
  Ok(Message {
    message: "success".to_string(),
    code: 200,
    data: file_list,
  })
}

fn get_file_type(dir: &PathBuf) -> String {
  if fs::metadata(&dir).unwrap().is_dir() {
    "dir".to_string()
  } else {
    "file".to_string()
  }
}

fn get_windows_drive_roots() -> Vec<FileList> {
  let mut roots = Vec::new();
  // 获取环境变量，包含所有驱动器
  for drive in env::var("SystemDrive").unwrap().chars().filter(|c| c.is_ascii_alphabetic()) {
      let root = PathBuf::from(String::from(drive) + ":\\");
      roots.push(
        FileList {
          file_type: "dir".to_string(),
          path: root.display().to_string(),
          file_name: root.display().to_string(),
        }
      );
  }
  roots
}

#[tauri::command]
pub fn search_file(mut dir: &str, text: &str, windows: tauri::Window) {
  dir = if env::consts::OS == "windows" && dir == "/" { "C:\\" } else { dir };
  let result = thread::spawn(move || {
    search_file_inner(&dir, &text, &windows);
    windows.emit("search-end", 0);
    println!("search-end");
  });
  result.join().unwrap();
}

pub fn search_file_inner(dir: &str, text: &str, windows: &tauri::Window) {
  for entry in fs::read_dir(&dir).unwrap() {
    let path = entry.unwrap().path();
    let is_dir = get_file_type(&path);
    if path.display().to_string().contains(text) {
      println!("{}", path.display().to_string());
      windows.emit::<Message<FileList>>("searching", Message {
        message: "success".to_string(),
        code: 200,
        data: FileList {
          file_type: is_dir,
          path: path.display().to_string(),
          file_name: path.file_name().unwrap().to_string_lossy().to_string(),
        }
      });
    } else if is_dir == "dir" {
      search_file_inner(&path.display().to_string(), text, windows);
    }
  }
}