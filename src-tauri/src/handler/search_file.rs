use std::{env, fs, sync::{Arc, Mutex}, thread};

use crate::handler::{file_struct::Message, get_file_list::FileList};

use super::get_file_list::get_file_type;


#[derive(Clone)]
struct SearchTask {
  dir: String,
  text: String,
  ignore: String,
  windows: tauri::Window,
}

impl SearchTask {
  fn run(self) {
    let ignore: Vec<&str> = self.ignore.split(",")
      .into_iter()
      .filter(|it| !it.is_empty())
      .collect();
    println!("ignore: {:?}", ignore);
    search_file_inner(&self.dir, &self.text, &ignore, &self.windows);
    let _ = &self.windows.emit("search-end", 0);
    println!("search-end");
  }
}

#[tauri::command]
pub fn search_file(mut dir: &str, text: &str, ignore: &str, windows: tauri::Window) {
  dir = if env::consts::OS == "windows" && dir == "/" { "C:\\" } else { dir };
  let task = Arc::new(Mutex::new(
    SearchTask { 
      dir: dir.to_owned(),
      text: text.to_owned(),
      ignore: ignore.to_owned(),
      windows: windows.clone()
    }
  ));
  thread::spawn(move || {
    let data = task.lock().unwrap().clone();
    data.run();
  });
}

pub fn search_file_inner(dir: &str, text: &str, ignore: &Vec<&str>, windows: &tauri::Window) {
  match fs::read_dir(&dir) {
    Ok(dirs) => {
      for entry in dirs {
        let path = entry.unwrap().path();
        let is_dir = get_file_type(&path);
        let path_to_string = path.display().to_string();
        if ignore.len() > 0 && ignore.iter().any(|it| path_to_string.contains(it)) {
          continue;
        }
        if path_to_string.contains(text) {
          let _ = windows.emit::<Message<FileList>>("searching", Message {
            message: "success".to_string(),
            code: 200,
            data: FileList {
              file_type: is_dir,
              path: path_to_string,
              file_name: path.file_name().unwrap().to_string_lossy().to_string(),
            }
          });
        } else if is_dir == "dir" {
          search_file_inner(&path_to_string, text, ignore, windows);
        }
      }
    },
    Err(_) => {

    }
  }
}