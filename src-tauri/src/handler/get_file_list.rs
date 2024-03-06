use std::path::PathBuf;
use std::fs;

use super::file_struct::Message;

#[derive(serde::Serialize)]
pub struct FileList {
  file_type: String,
  path: String,
  file_name: String,
}

#[tauri::command]
pub async fn get_file_list(path: &str) -> Result<Message<Vec<FileList>>, Message<Vec<FileList>>> {
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