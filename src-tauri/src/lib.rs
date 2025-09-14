use crate::{
    constants::{DB_NAME_TYPE, DEFAULT_SQL_SCHEMA},
    db::{download_database, replace_database},
};
use tauri_plugin_sql::{Migration, MigrationKind};
mod constants;
mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "init",
        sql: DEFAULT_SQL_SCHEMA,
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(DB_NAME_TYPE, migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            replace_database,
            download_database
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
