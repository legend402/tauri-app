// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[derive(serde::Serialize)]
struct Message {
    message: String,
    code: i32,
    data: Vec<String>,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
async fn get_file_list(path: &str) -> Result<Message, Message> {
    let mut file_list = Vec::new();
    let mut dir = String::from(path.to_owned());
    // 判断地址是不是文件夹
    if !std::fs::metadata(&dir).unwrap().is_dir() {
        return Ok(Message {
            message: "is not dir".to_string(),
            code: 0,
            data: file_list,
        })
    } 
    for entry in std::fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        file_list.push(entry.path().display().to_string());
    }
    Ok(Message {
        message: "success".to_string(),
        code: 200,
        data: file_list,
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![get_file_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
