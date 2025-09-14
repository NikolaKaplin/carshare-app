use crate::constants::{APP_NAME, DB_NAME};
use std::{fs, path::PathBuf};

#[derive(Debug, thiserror::Error)]
pub enum DatabaseError {
    #[error("Directory not found: {0}")]
    DirectoryNotFound(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Database path error: {0}")]
    PathError(String),

    #[error("Database file not found")]
    FileNotFound,

    #[error("Database file is empty")]
    FileEmpty,
}

impl From<DatabaseError> for String {
    fn from(error: DatabaseError) -> String {
        error.to_string()
    }
}

fn get_platform() -> &'static str {
    if cfg!(target_os = "windows") {
        "windows"
    } else if cfg!(target_os = "linux") {
        "linux"
    } else {
        "unknown"
    }
}

fn get_database_dir() -> Result<PathBuf, DatabaseError> {
    let platform = get_platform();

    let db_dir = match platform {
        "windows" => dirs::data_dir()
            .ok_or_else(|| DatabaseError::DirectoryNotFound("AppData".to_string()))?
            .join(APP_NAME),
        "linux" => dirs::data_dir()
            .ok_or_else(|| DatabaseError::DirectoryNotFound(".local/share".to_string()))?
            .join(APP_NAME),
        _ => std::env::current_dir()?.join("database"),
    };

    if !db_dir.exists() {
        fs::create_dir_all(&db_dir)?;
    }

    Ok(db_dir)
}

fn get_database_path() -> Result<PathBuf, DatabaseError> {
    let db_dir = get_database_dir()?;
    Ok(db_dir.join(DB_NAME))
}

#[tauri::command]
pub fn replace_database(new_db_data: Vec<u8>) -> Result<(), String> {
    let db_path = get_database_path().map_err(|e| e.to_string())?;

    if db_path.exists() {
        fs::remove_file(&db_path).map_err(|e| e.to_string())?;
    }

    fs::write(&db_path, new_db_data).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn download_database() -> Result<Vec<u8>, String> {
    let db_path = get_database_path().map_err(|e| e.to_string())?;

    if !db_path.exists() {
        return Err(DatabaseError::FileNotFound.to_string());
    }

    let metadata = fs::metadata(&db_path).map_err(|e| e.to_string())?;

    if metadata.len() == 0 {
        return Err(DatabaseError::FileEmpty.to_string());
    }

    let file_data = fs::read(&db_path).map_err(|e| e.to_string())?;

    println!("Файл прочитан успешно, размер: {} байт", file_data.len());

    Ok(file_data)
}
