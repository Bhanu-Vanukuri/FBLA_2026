// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Simple setup without database initialization
            println!("App starting up successfully");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            create_user,
            get_user,
            get_all_businesses,
            generate_sample_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Keep the original greet function for compatibility
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
