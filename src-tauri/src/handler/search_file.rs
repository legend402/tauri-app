use std::{env, fs, sync::{Arc, Mutex}, thread};

use crate::handler::{file_struct::Message, get_file_list::FileList};

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
        let entry = entry.unwrap();
        let path = entry.path();
        
        let file_type = String::from(if path.is_dir() { "dir" } else { "file" });
        let path_to_string = path.display().to_string();
        let file_name = path.file_name().unwrap().to_str().unwrap();
        if ignore.len() > 0 && ignore.contains(&file_name) {
          println!("ignore: {}", path_to_string);
          continue;
        }
        if path_to_string.contains(text) {
          let _ = windows.emit::<Message<FileList>>("searching", Message {
            message: "success".to_string(),
            code: 200,
            data: FileList {
              file_type,
              path: path_to_string,
              file_name: file_name.to_string(),
            }
          });
        } else if file_type == "dir" {
          search_file_inner(&path_to_string, text, ignore, windows);
        }
      }
    },
    Err(_) => {

    }
  }
}