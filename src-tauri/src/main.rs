
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
mod handler;
use crate::handler::get_file_list::get_file_list;
use crate::handler::file_utils::open_file;
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_file, get_file_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
