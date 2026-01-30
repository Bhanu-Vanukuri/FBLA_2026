// Simplified commands module without database dependencies

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Mock commands for demonstration purposes
#[tauri::command]
pub async fn create_user(name: String, email: String) -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "id": "demo-user-123",
        "name": name,
        "email": email,
        "created_at": chrono::Utc::now().to_rfc3339(),
        "updated_at": chrono::Utc::now().to_rfc3339()
    }))
}

#[tauri::command]
pub async fn get_all_businesses() -> Result<Vec<serde_json::Value>, String> {
    Ok(vec![
        serde_json::json!({
            "id": "1",
            "name": "Tech Haven",
            "category": "Electronics",
            "description": "Your local electronics store with the latest gadgets",
            "address": "123 Main St",
            "phone": "555-0123",
            "website": "techhaven.com",
            "average_rating": 4.5,
            "review_count": 128,
            "has_deals": true,
            "created_at": chrono::Utc::now().to_rfc3339(),
            "updated_at": chrono::Utc::now().to_rfc3339()
        }),
        serde_json::json!({
            "id": "2",
            "name": "Cafe Bliss",
            "category": "Food",
            "description": "Cozy coffee shop with artisanal blends",
            "address": "456 Oak Ave",
            "phone": "555-0456",
            "website": "cafebliss.com",
            "average_rating": 4.8,
            "review_count": 89,
            "has_deals": false,
            "created_at": chrono::Utc::now().to_rfc3339(),
            "updated_at": chrono::Utc::now().to_rfc3339()
        })
    ])
}

#[tauri::command]
pub async fn generate_sample_data() -> Result<(), String> {
    println!("Sample data generation completed (mock)");
    Ok(())
}

// Additional mock commands can be added here as needed
#[tauri::command]
pub async fn get_user() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "id": "demo-user-123",
        "name": "FBLA User",
        "email": "fbla@example.com",
        "created_at": chrono::Utc::now().to_rfc3339(),
        "updated_at": chrono::Utc::now().to_rfc3339()
    }))
}
