use chrono::{DateTime, Utc};
use crate::models::*;
use crate::database::AppDatabase;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<Mutex<AppDatabase>>,
}

#[tauri::command]
pub async fn initialize_app(state: tauri::State<'_, AppState>) -> Result<(), String> {
    // Initialize database using the new API
    let db = state.db.lock().await;
    db.initialize().await.map_err(|e| e.to_string())?;
    Ok(())
}

// User commands
#[tauri::command]
pub async fn create_user(state: tauri::State<'_, AppState>, name: String, email: String) -> Result<User, String> {
    let user = User::new(name, email);
    let db = state.db.lock().await;
    db.create_user(&user).await.map_err(|e| e.to_string())?;
    Ok(user)
}

#[tauri::command]
pub async fn get_user(state: tauri::State<'_, AppState>, user_id: String) -> Result<Option<User>, String> {
    let db = state.db.lock().await;
    db.get_user_by_id(&user_id).await.map_err(|e| e.to_string())
}

// Business commands
#[tauri::command]
pub async fn create_business(
    state: tauri::State<'_, AppState>,
    name: String,
    category: String,
    description: String,
    address: String,
    phone: String,
    website: Option<String>,
) -> Result<Business, String> {
    let business = Business::new(name, category, description, address, phone, website);
    let db = state.db.lock().await;
    db.create_business(&business).await.map_err(|e| e.to_string())?;
    Ok(business)
}

#[tauri::command]
pub async fn get_all_businesses(state: tauri::State<'_, AppState>) -> Result<Vec<Business>, String> {
    let db = state.db.lock().await;
    db.get_all_businesses().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_business_by_id(state: tauri::State<'_, AppState>, business_id: String) -> Result<Option<Business>, String> {
    let db = state.db.lock().await;
    db.get_business_by_id(&business_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn search_businesses(state: tauri::State<'_, AppState>, query: String) -> Result<Vec<Business>, String> {
    let db = state.db.lock().await;
    db.search_businesses(&query).await.map_err(|e| e.to_string())
}

// Review commands
#[tauri::command]
pub async fn create_review(
    state: tauri::State<'_, AppState>,
    business_id: String,
    user_id: String,
    rating: u8,
    comment: String,
) -> Result<Review, String> {
    let review = Review::new(business_id, user_id, rating, comment);
    let db = state.db.lock().await;
    db.create_review(&review).await.map_err(|e| e.to_string())?;
    Ok(review)
}

#[tauri::command]
pub async fn get_reviews_by_business(state: tauri::State<'_, AppState>, business_id: String) -> Result<Vec<Review>, String> {
    let db = state.db.lock().await;
    db.get_reviews_by_business(&business_id).await.map_err(|e| e.to_string())
}

// Deal commands
#[tauri::command]
pub async fn create_deal(
    state: tauri::State<'_, AppState>,
    business_id: String,
    title: String,
    description: String,
    discount_code: Option<String>,
    start_date: String,
    end_date: String,
) -> Result<Deal, String> {
    let start_date = DateTime::parse_from_rfc3339(&start_date)
        .map_err(|e| format!("Invalid start date: {}", e))?;
    let end_date = DateTime::parse_from_rfc3339(&end_date)
        .map_err(|e| format!("Invalid end date: {}", e))?;

    let deal = Deal::new(business_id, title, description, discount_code, start_date.into(), end_date.into());
    let db = state.db.lock().await;
    db.create_deal(&deal).await.map_err(|e| e.to_string())?;
    Ok(deal)
}

#[tauri::command]
pub async fn get_deals_by_business(state: tauri::State<'_, AppState>, business_id: String) -> Result<Vec<Deal>, String> {
    let db = state.db.lock().await;
    db.get_deals_by_business(&business_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_active_deals(state: tauri::State<'_, AppState>) -> Result<Vec<Deal>, String> {
    let db = state.db.lock().await;
    db.get_active_deals().await.map_err(|e| e.to_string())
}

// Favorite commands
#[tauri::command]
pub async fn add_favorite(
    state: tauri::State<'_, AppState>,
    user_id: String,
    business_id: String,
) -> Result<Favorite, String> {
    let favorite = Favorite::new(user_id, business_id);
    let db = state.db.lock().await;
    db.add_favorite(&favorite).await.map_err(|e| e.to_string())?;
    Ok(favorite)
}

#[tauri::command]
pub async fn remove_favorite(
    state: tauri::State<'_, AppState>,
    user_id: String,
    business_id: String,
) -> Result<(), String> {
    let db = state.db.lock().await;
    db.remove_favorite(&user_id, &business_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_favorites_by_user(state: tauri::State<'_, AppState>, user_id: String) -> Result<Vec<Business>, String> {
    let db = state.db.lock().await;
    db.get_favorites_by_user(&user_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn is_favorite(
    state: tauri::State<'_, AppState>,
    user_id: String,
    business_id: String,
) -> Result<bool, String> {
    let db = state.db.lock().await;
    db.is_favorite(&user_id, &business_id).await.map_err(|e| e.to_string())
}

// CAPTCHA commands
#[tauri::command]
pub fn generate_captcha() -> (String, String) {
    AppDatabase::generate_captcha()
}

// Sample data generation for demo purposes
#[tauri::command]
pub async fn generate_sample_data(state: tauri::State<'_, AppState>) -> Result<(), String> {
    use chrono::Duration;

    let db = state.db.lock().await;

    // Create sample user
    let user = User::new("Demo User".to_string(), "demo@example.com".to_string());
    db.create_user(&user).await.map_err(|e| e.to_string())?;

        // Create sample businesses
        let categories = vec!["Food", "Retail", "Services", "Entertainment"];
        let business_names = vec![
            "Joe's Pizza", "Tech Gadgets", "Quick Clean", "Movie Theater",
            "Burger Joint", "Fashion Boutique", "Auto Repair", "Bowling Alley"
        ];

        for (i, name) in business_names.iter().enumerate() {
            let category = categories[i % categories.len()].to_string();
            let business = Business::new(
                name.to_string(),
                category.clone(),
                format!("A great {} business in town", category.to_lowercase()),
                format!("123 {} St", name.replace(' ', "-").to_lowercase()),
                format!("555-{:04}", 1000 + i),
                Some(format!("{}.com", name.replace(' ', "").to_lowercase())),
            );
        db.create_business(&business).await.map_err(|e| e.to_string())?;

        // Add some reviews
        for j in 0..3 {
            let review = Review::new(
                business.id.clone(),
                user.id.clone(),
                (3 + j) as u8, // Ratings from 3 to 5
                format!("Great {} business! {} stars!", category.to_lowercase(), 3 + j),
            );
            db.create_review(&review).await.map_err(|e| e.to_string())?;
        }

        // Add a deal for some businesses
        if i % 2 == 0 {
            let start_date = Utc::now();
            let end_date = Utc::now() + Duration::days(30);
            let deal = Deal::new(
                business.id.clone(),
                format!("{} Special Deal", name),
                format!("Get 20% off at {}!", name),
                Some(format!("DEAL{}", i)),
                start_date,
                end_date,
            );
            db.create_deal(&deal).await.map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}
