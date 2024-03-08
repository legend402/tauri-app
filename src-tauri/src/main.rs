
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
mod handler;
use crate::handler::get_file_list::get_file_list;
use crate::handler::search_file::search_file;
use crate::handler::file_utils::open_file;

fn main() {
    let s1 = String::from("hello");
    let s2 = "world!";
    let compare = compare_string(&s1, &s2);
    println!("compare: {}", compare);
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_file, get_file_list, search_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn compare_string<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() {
        a
    } else {
        b
    }
}