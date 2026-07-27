mod database;
mod handlers;
mod platform;
mod services;

use std::sync::Mutex;

use tauri::Manager;
use tauri_plugin_log::Target;

use database::db::*;
use handlers::config::*;
use handlers::dns::*;
use handlers::interface::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let window = app.get_webview_window("main").expect("no main window");
            let _ = window.show();
            let _ = window.unminimize();
            let _ = window.set_focus();
        }))
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .clear_targets()
                .target(Target::new(tauri_plugin_log::TargetKind::LogDir {
                    file_name: Some("out-dns-logs".to_string()),
                }))
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .max_file_size(50_000)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        // start hidden on startup
        .setup(|app| {
            let start_minimized = std::env::args().any(|arg| arg == "--minimized");
            if start_minimized {
                let windows = app.get_webview_window("main").expect("no main window");
                windows.hide()?;
            }
            Ok(())
        })
        // initialize database connection on start
        .setup(|app| {
            let conn = init_db(&app.handle());
            app.manage(DbState(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            flush_dns,
            get_interfaces,
            get_dns_from_db,
            remove_dns,
            new_dns,
            set_dns,
            lookup,
            // configs
            get_configs,
            toggle_flush_dns_on_change,
            toggle_autostart,
            toggle_close_to_tray,
            toggle_minimize_to_tray,
            open_log_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
