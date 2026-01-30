use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Business {
    pub id: String,
    pub name: String,
    pub category: String,
    pub description: String,
    pub address: String,
    pub phone: String,
    pub website: Option<String>,
    pub average_rating: f32,
    pub review_count: usize,
    pub has_deals: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Review {
    pub id: String,
    pub business_id: String,
    pub user_id: String,
    pub rating: u8,
    pub comment: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Deal {
    pub id: String,
    pub business_id: String,
    pub title: String,
    pub description: String,
    pub discount_code: Option<String>,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Favorite {
    pub id: String,
    pub user_id: String,
    pub business_id: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Business {
    pub fn new(
        name: String,
        category: String,
        description: String,
        address: String,
        phone: String,
        website: Option<String>,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            category,
            description,
            address,
            phone,
            website,
            average_rating: 0.0,
            review_count: 0,
            has_deals: false,
            created_at: now,
            updated_at: now,
        }
    }
}

impl Review {
    pub fn new(
        business_id: String,
        user_id: String,
        rating: u8,
        comment: String,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            business_id,
            user_id,
            rating,
            comment,
            created_at: now,
            updated_at: now,
        }
    }
}

impl Deal {
    pub fn new(
        business_id: String,
        title: String,
        description: String,
        discount_code: Option<String>,
        start_date: DateTime<Utc>,
        end_date: DateTime<Utc>,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            business_id,
            title,
            description,
            discount_code,
            start_date,
            end_date,
            is_active: true,
            created_at: now,
            updated_at: now,
        }
    }
}

impl Favorite {
    pub fn new(user_id: String, business_id: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            user_id,
            business_id,
            created_at: now,
        }
    }
}

impl User {
    pub fn new(name: String, email: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            email,
            created_at: now,
            updated_at: now,
        }
    }
}