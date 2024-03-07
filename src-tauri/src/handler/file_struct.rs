#[derive(serde::Serialize)]
pub struct Message<T> {
    pub message: String,
    pub code: i32,
    pub data: T,
}