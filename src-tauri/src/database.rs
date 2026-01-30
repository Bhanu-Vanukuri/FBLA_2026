use anyhow::{Context, Result};
use sqlx::{Row};
use sqlx::sqlite::SqlitePool as SqlxPool;
use std::sync::Arc;

use crate::models::*;

/// Database wrapper that uses SQLx directly
#[derive(Clone)]
pub struct AppDatabase {
    pub pool: Arc<SqlxPool>,
}

impl AppDatabase {
    /// Create new database instance using SQLx
    pub async fn new(db_url: &str) -> Result<Self> {
        let pool = SqlxPool::connect(db_url).await
            .context("Failed to create SQLx pool")?;
        
        Ok(Self { 
            pool: Arc::new(pool)
        })
    }

    /// Initialize database with migrations
    pub async fn initialize(&self) -> Result<()> {
        // Run migrations using sqlx
        sqlx::migrate!("./migrations").run(&*self.pool).await?;

        Ok(())
    }

    // USER OPERATIONS

    /// Create a new user
    pub async fn create_user(&self, user: &User) -> Result<()> {
        sqlx::query(
            "INSERT INTO users (id, name, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)"
        )
        .bind(&user.id)
        .bind(&user.name)
        .bind(&user.email)
        .bind(user.created_at.to_rfc3339())
        .bind(user.updated_at.to_rfc3339())
        .execute(&*self.pool)
        .await
        .context("Failed to create user")?;

        Ok(())
    }

    /// Get user by ID
    pub async fn get_user_by_id(&self, user_id: &str) -> Result<Option<User>> {
                let row = sqlx::query(
            "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1"
        )
        .bind(user_id)
        .fetch_optional(&*self.pool)
        .await
        .context("Failed to get user")?;

        if let Some(row) = row {
            let user = User {
                id: row.get("id"),
                name: row.get("name"),
                email: row.get("email"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Ok(Some(user))
        } else {
            Ok(None)
        }
    }

    // BUSINESS OPERATIONS

    /// Create a new business
    pub async fn create_business(&self, business: &Business) -> Result<()> {
                sqlx::query(
            "INSERT INTO businesses (id, name, category, description, address, phone, website, average_rating, review_count, has_deals, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"
        )
        .bind(&business.id)
        .bind(&business.name)
        .bind(&business.category)
        .bind(&business.description)
        .bind(&business.address)
        .bind(&business.phone)
        .bind(&business.website)
        .bind(business.average_rating)
        .bind(business.review_count as i64)
        .bind(business.has_deals as i64)
        .bind(business.created_at.to_rfc3339())
        .bind(business.updated_at.to_rfc3339())
        .execute(&*self.pool)
        .await
        .context("Failed to create business")?;

        Ok(())
    }

    /// Get all businesses
    pub async fn get_all_businesses(&self) -> Result<Vec<Business>> {
                let rows = sqlx::query(
            "SELECT id, name, category, description, address, phone, website, average_rating, review_count, has_deals, created_at, updated_at FROM businesses"
        )
        .fetch_all(&*self.pool)
        .await
        .context("Failed to get businesses")?;

        let mut businesses = Vec::new();
        for row in rows {
            let business = Business {
                id: row.get("id"),
                name: row.get("name"),
                category: row.get("category"),
                description: row.get("description"),
                address: row.get("address"),
                phone: row.get("phone"),
                website: row.get("website"),
                average_rating: row.get("average_rating"),
                review_count: row.get::<i32, _>("review_count") as usize,
                has_deals: row.get::<i32, _>("has_deals") != 0,
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            businesses.push(business);
        }

        Ok(businesses)
    }

    /// Get business by ID
    pub async fn get_business_by_id(&self, business_id: &str) -> Result<Option<Business>> {
                let row = sqlx::query(
            "SELECT id, name, category, description, address, phone, website, average_rating, review_count, has_deals, created_at, updated_at FROM businesses WHERE id = $1"
        )
        .bind(business_id)
        .fetch_optional(&*self.pool)
        .await
        .context("Failed to get business")?;

        if let Some(row) = row {
            let business = Business {
                id: row.get("id"),
                name: row.get("name"),
                category: row.get("category"),
                description: row.get("description"),
                address: row.get("address"),
                phone: row.get("phone"),
                website: row.get("website"),
                average_rating: row.get("average_rating"),
                review_count: row.get::<i32, _>("review_count") as usize,
                has_deals: row.get::<i32, _>("has_deals") != 0,
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            Ok(Some(business))
        } else {
            Ok(None)
        }
    }

    /// Search businesses by query
    pub async fn search_businesses(&self, query: &str) -> Result<Vec<Business>> {
                let rows = sqlx::query(
            "SELECT id, name, category, description, address, phone, website, average_rating, review_count, has_deals, created_at, updated_at
             FROM businesses
             WHERE name LIKE $1 OR description LIKE $1 OR category LIKE $1"
        )
        .bind(format!("%{}%", query))
        .fetch_all(&*self.pool)
        .await
        .context("Failed to search businesses")?;

        let mut businesses = Vec::new();
        for row in rows {
            let business = Business {
                id: row.get("id"),
                name: row.get("name"),
                category: row.get("category"),
                description: row.get("description"),
                address: row.get("address"),
                phone: row.get("phone"),
                website: row.get("website"),
                average_rating: row.get("average_rating"),
                review_count: row.get::<i32, _>("review_count") as usize,
                has_deals: row.get::<i32, _>("has_deals") != 0,
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            businesses.push(business);
        }

        Ok(businesses)
    }

    // REVIEW OPERATIONS

    /// Create a new review
    pub async fn create_review(&self, review: &Review) -> Result<()> {
                sqlx::query(
            "INSERT INTO reviews (id, business_id, user_id, rating, comment, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)"
        )
        .bind(&review.id)
        .bind(&review.business_id)
        .bind(&review.user_id)
        .bind(review.rating as i64)
        .bind(&review.comment)
        .bind(review.created_at.to_rfc3339())
        .bind(review.updated_at.to_rfc3339())
        .execute(&*self.pool)
        .await
        .context("Failed to create review")?;

        // Update business rating
        self.update_business_rating(&review.business_id).await?;

        Ok(())
    }

    /// Get reviews by business ID
    pub async fn get_reviews_by_business(&self, business_id: &str) -> Result<Vec<Review>> {
                let rows = sqlx::query(
            "SELECT id, business_id, user_id, rating, comment, created_at, updated_at FROM reviews WHERE business_id = $1"
        )
        .bind(business_id)
        .fetch_all(&*self.pool)
        .await
        .context("Failed to get reviews by business")?;

        let mut reviews = Vec::new();
        for row in rows {
            let review = Review {
                id: row.get("id"),
                business_id: row.get("business_id"),
                user_id: row.get("user_id"),
                rating: row.get("rating"),
                comment: row.get("comment"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            reviews.push(review);
        }

        Ok(reviews)
    }

    /// Update business average rating based on reviews
    async fn update_business_rating(&self, business_id: &str) -> Result<()> {
        // Get all reviews for the business
        let reviews = self.get_reviews_by_business(business_id).await?;

        if reviews.is_empty() {
            // No reviews, set rating to 0
                        sqlx::query(
                "UPDATE businesses SET average_rating = 0.0, review_count = 0 WHERE id = $1"
            )
            .bind(business_id)
            .execute(&*self.pool)
            .await
            .context("Failed to update business rating")?;
        } else {
            // Calculate average rating
            let total_rating: u32 = reviews.iter().map(|r| r.rating as u32).sum();
            let average_rating = total_rating as f32 / reviews.len() as f32;

                        sqlx::query(
                "UPDATE businesses SET average_rating = $1, review_count = $2 WHERE id = $3"
            )
            .bind(average_rating)
            .bind(reviews.len() as i64)
            .bind(business_id)
            .execute(&*self.pool)
            .await
            .context("Failed to update business rating")?;
        }

        Ok(())
    }

    // DEAL OPERATIONS

    /// Create a new deal
    pub async fn create_deal(&self, deal: &Deal) -> Result<()> {
                sqlx::query(
            "INSERT INTO deals (id, business_id, title, description, discount_code, start_date, end_date, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
        )
        .bind(&deal.id)
        .bind(&deal.business_id)
        .bind(&deal.title)
        .bind(&deal.description)
        .bind(&deal.discount_code)
        .bind(deal.start_date.to_rfc3339())
        .bind(deal.end_date.to_rfc3339())
        .bind(deal.is_active as i64)
        .bind(deal.created_at.to_rfc3339())
        .bind(deal.updated_at.to_rfc3339())
        .execute(&*self.pool)
        .await
        .context("Failed to create deal")?;

        // Update business has_deals flag
                sqlx::query(
            "UPDATE businesses SET has_deals = 1 WHERE id = $1"
        )
        .bind(&deal.business_id)
        .execute(&*self.pool)
        .await
        .context("Failed to update business deals flag")?;

        Ok(())
    }

    /// Get deals by business ID
    pub async fn get_deals_by_business(&self, business_id: &str) -> Result<Vec<Deal>> {
                let rows = sqlx::query(
            "SELECT id, business_id, title, description, discount_code, start_date, end_date, is_active, created_at, updated_at FROM deals WHERE business_id = $1"
        )
        .bind(business_id)
        .fetch_all(&*self.pool)
        .await
        .context("Failed to get deals by business")?;

        let mut deals = Vec::new();
        for row in rows {
            let deal = Deal {
                id: row.get("id"),
                business_id: row.get("business_id"),
                title: row.get("title"),
                description: row.get("description"),
                discount_code: row.get("discount_code"),
                start_date: row.get("start_date"),
                end_date: row.get("end_date"),
                is_active: row.get("is_active"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            deals.push(deal);
        }

        Ok(deals)
    }

    /// Get active deals
    pub async fn get_active_deals(&self) -> Result<Vec<Deal>> {
                let rows = sqlx::query(
            "SELECT id, business_id, title, description, discount_code, start_date, end_date, is_active, created_at, updated_at FROM deals WHERE is_active = 1"
        )
        .fetch_all(&*self.pool)
        .await
        .context("Failed to get active deals")?;

        let mut deals = Vec::new();
        for row in rows {
            let deal = Deal {
                id: row.get("id"),
                business_id: row.get("business_id"),
                title: row.get("title"),
                description: row.get("description"),
                discount_code: row.get("discount_code"),
                start_date: row.get("start_date"),
                end_date: row.get("end_date"),
                is_active: row.get("is_active"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            deals.push(deal);
        }

        Ok(deals)
    }

    // FAVORITE OPERATIONS

    /// Add a business to favorites
    pub async fn add_favorite(&self, favorite: &Favorite) -> Result<()> {
                sqlx::query(
            "INSERT INTO favorites (id, user_id, business_id, created_at) VALUES ($1, $2, $3, $4)"
        )
        .bind(&favorite.id)
        .bind(&favorite.user_id)
        .bind(&favorite.business_id)
        .bind(favorite.created_at.to_rfc3339())
        .execute(&*self.pool)
        .await
        .context("Failed to add favorite")?;

        Ok(())
    }

    /// Remove a business from favorites
    pub async fn remove_favorite(&self, user_id: &str, business_id: &str) -> Result<()> {
                sqlx::query(
            "DELETE FROM favorites WHERE user_id = $1 AND business_id = $2"
        )
        .bind(user_id)
        .bind(business_id)
        .execute(&*self.pool)
        .await
        .context("Failed to remove favorite")?;

        Ok(())
    }

    /// Check if a business is favorited by a user
    pub async fn is_favorite(&self, user_id: &str, business_id: &str) -> Result<bool> {
                let row = sqlx::query(
            "SELECT 1 FROM favorites WHERE user_id = $1 AND business_id = $2"
        )
        .bind(user_id)
        .bind(business_id)
        .fetch_optional(&*self.pool)
        .await
        .context("Failed to check favorite")?;

        Ok(row.is_some())
    }

    /// Get favorites by user ID
    pub async fn get_favorites_by_user(&self, user_id: &str) -> Result<Vec<Business>> {
                let rows = sqlx::query(
            "SELECT b.id, b.name, b.category, b.description, b.address, b.phone, b.website, b.average_rating, b.review_count, b.has_deals, b.created_at, b.updated_at
             FROM favorites f
             JOIN businesses b ON f.business_id = b.id
             WHERE f.user_id = $1"
        )
        .bind(user_id)
        .fetch_all(&*self.pool)
        .await
        .context("Failed to get favorites by user")?;

        let mut businesses = Vec::new();
        for row in rows {
            let business = Business {
                id: row.get("id"),
                name: row.get("name"),
                category: row.get("category"),
                description: row.get("description"),
                address: row.get("address"),
                phone: row.get("phone"),
                website: row.get("website"),
                average_rating: row.get("average_rating"),
                review_count: row.get::<i32, _>("review_count") as usize,
                has_deals: row.get::<i32, _>("has_deals") != 0,
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            businesses.push(business);
        }

        Ok(businesses)
    }

    // CAPTCHA (kept as is since it doesn't use database)
    pub fn generate_captcha() -> (String, String) {
        use rand::Rng;
        let mut rng = rand::thread_rng();

        let num1: u8 = rng.gen_range(1..10);
        let num2: u8 = rng.gen_range(1..10);
        let operation = if rng.gen_bool(0.5) { "+" } else { "-" };
        let result = if operation == "+" {
            num1 + num2
        } else {
            num1.abs_diff(num2)
        };

        let question = format!("{} {} {} = ?", num1, operation, num2);
        (question, result.to_string())
    }
}
