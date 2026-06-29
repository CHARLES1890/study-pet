mod commands;
mod tray;

use commands::AppState;
use std::sync::{Arc, Mutex};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            reminders: Arc::new(Mutex::new(Vec::new())),
        })
        .setup(|app| {
            let app_handle = app.handle().clone();
            tray::create_tray(&app_handle)?;
            commands::start_reminder_scheduler(app_handle);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::read_app_data,
            commands::write_app_data,
            commands::backup_data,
            commands::restore_data,
            commands::upload_pet_image,
            commands::send_notification,
            commands::set_always_on_top,
            commands::hide_window,
            commands::show_window,
            commands::close_app,
            commands::sync_reminders,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
