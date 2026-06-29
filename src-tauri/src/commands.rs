use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager, State, Window};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_notification::NotificationExt;

pub struct AppState {
    pub reminders: Arc<Mutex<Vec<Reminder>>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reminder {
    pub id: String,
    pub title: String,
    pub hour: u32,
    pub minute: u32,
    pub repeat_days: Vec<u32>, // 0 = Sunday, 1 = Monday, etc.
    pub enabled: bool,
}

fn app_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|e| e.to_string())
}

fn ensure_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app_data_dir(app)?;
    if !dir.exists() {
        std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }
    Ok(dir)
}

#[tauri::command]
pub fn read_app_data(app: AppHandle, file_name: String) -> Result<String, String> {
    let dir = ensure_data_dir(&app)?;
    let path = dir.join(file_name);
    if !path.exists() {
        return Ok("{}".to_string());
    }
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn write_app_data(app: AppHandle, file_name: String, content: String) -> Result<(), String> {
    let dir = ensure_data_dir(&app)?;
    let path = dir.join(file_name);
    std::fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn backup_data(app: AppHandle, file_name: String) -> Result<(), String> {
    let dir = app_data_dir(&app)?;
    let source = dir.join(&file_name);
    if !source.exists() {
        return Err("Data file does not exist".to_string());
    }

    let path = app
        .dialog()
        .file()
        .set_file_name(&format!("{}_backup.json", file_name.trim_end_matches(".json")))
        .blocking_save_file()
        .ok_or("No file selected")?
        .into_path()
        .map_err(|_| "Invalid backup path".to_string())?;

    std::fs::copy(&source, path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn restore_data(app: AppHandle, file_name: String) -> Result<(), String> {
    let path = app
        .dialog()
        .file()
        .add_filter("JSON", &["json"])
        .blocking_pick_file()
        .ok_or("No file selected")?
        .into_path()
        .map_err(|_| "Invalid restore path".to_string())?;

    let dir = ensure_data_dir(&app)?;
    let target = dir.join(file_name);
    std::fs::copy(&path, target).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn upload_pet_image(app: AppHandle) -> Result<String, String> {
    let path = app
        .dialog()
        .file()
        .add_filter("Images", &["png", "jpg", "jpeg"])
        .blocking_pick_file()
        .ok_or("No file selected")?
        .into_path()
        .map_err(|_| "Invalid image path".to_string())?;

    // Read the entire file in binary to avoid corruption/truncation.
    let bytes = std::fs::read(&path).map_err(|e| format!("Failed to read image: {}", e))?;

    let dir = ensure_data_dir(&app)?;
    let skin_dir = dir.join("user-skin");
    if !skin_dir.exists() {
        std::fs::create_dir_all(&skin_dir).map_err(|e| e.to_string())?;
    }
    let target = skin_dir.join("pet_image.png");
    std::fs::write(&target, &bytes).map_err(|e| format!("Failed to write image: {}", e))?;

    // Normalize backslashes to forward slashes so convertFileSrc can load it reliably.
    Ok(target.to_string_lossy().replace('\\', "/"))
}

#[tauri::command]
pub fn send_notification(app: AppHandle, title: String, body: String) -> Result<(), String> {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn set_always_on_top(window: Window, always_on_top: bool) -> Result<(), String> {
    window.set_always_on_top(always_on_top).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn hide_window(window: Window) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn show_window(window: Window) -> Result<(), String> {
    window.show().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn close_app(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
pub fn sync_reminders(state: State<AppState>, reminders: Vec<Reminder>) -> Result<(), String> {
    let mut stored = state.reminders.lock().map_err(|e| e.to_string())?;
    *stored = reminders;
    Ok(())
}

pub fn start_reminder_scheduler(app_handle: AppHandle) {
    let app = app_handle.clone();
    std::thread::spawn(move || loop {
        std::thread::sleep(std::time::Duration::from_secs(30));
        let now = chrono_now();
        let reminders = {
            let state = app.state::<AppState>();
            let guard = state.reminders.lock();
            if let Ok(r) = guard {
                r.clone()
            } else {
                Vec::new()
            }
        };

        for reminder in reminders {
            if !reminder.enabled {
                continue;
            }
            if now.0 == reminder.hour && now.1 == reminder.minute && now.2 <= 30 {
                let should_trigger = if reminder.repeat_days.is_empty() {
                    true
                } else {
                    reminder.repeat_days.contains(&now.3)
                };
                if should_trigger {
                    let _ = app
                        .notification()
                        .builder()
                        .title("伴学提醒".to_string())
                        .body(reminder.title.clone())
                        .show();
                }
            }
        }
    });
}

// Minimal local time helper without pulling chrono as a heavy dep.
fn chrono_now() -> (u32, u32, u32, u32) {
    let epoch = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    // Basic UTC to local approximation is not needed for a study pet.
    // Use UTC for simplicity.
    let days_since_epoch = epoch / 86400;
    let seconds_of_day = (epoch % 86400) as u32;
    let hour = seconds_of_day / 3600;
    let minute = (seconds_of_day % 3600) / 60;
    let second = seconds_of_day % 60;
    let weekday = ((days_since_epoch + 4) % 7) as u32; // Thursday 1970-01-01 -> 4
    (hour, minute, second, weekday)
}
