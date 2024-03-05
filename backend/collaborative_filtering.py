


import numpy as np
import mysql.connector

# Function to fetch interaction data from MySQL database
def fetch_interaction_data():
    db_connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="ecommerce"
    )

    cursor = db_connection.cursor()
    cursor.execute("SELECT user_id, product_id, count_view FROM interactions")
    data = cursor.fetchall()

    cursor.close()
    db_connection.close()

    return data

# Function to create user-item matrix from interaction data
def create_user_item_matrix(interaction_data):
    user_ids, product_ids, count_views = zip(*interaction_data)
    
    # Calculate the maximum user and product IDs
    max_user_id = max(user_ids)
    max_product_id = max(product_ids)
    
    # Determine the dimensions of the matrix
    num_users = max_user_id + 1
    num_items = max_product_id + 1
    
    # Initialize user-item matrix with zeros
    user_item_matrix = np.zeros((num_users, num_items))
    
    # Fill user-item matrix with count_views
    for user_id, product_id, count_view in interaction_data:
        user_item_matrix[user_id, product_id] = count_view
    
    return user_item_matrix

# Function to perform Singular Value Decomposition (SVD)
def perform_svd(user_item_matrix):
    # Perform SVD on the user-item matrix
    U, Sigma, Vt = np.linalg.svd(user_item_matrix, full_matrices=False)
    Sigma = np.diag(Sigma)
    return U, Sigma, Vt

# Function to generate recommendations for a specific user
def generate_recommendations(user_id, user_item_matrix, U, Sigma, Vt, num_recommendations=5):
    # Predict count_views for the user using SVD
    user_count_views = np.dot(np.dot(U[user_id, :], Sigma), Vt)
    
    # Find indices of products with highest predicted count_views
    recommended_product_indices = np.argsort(user_count_views)[::-1][:num_recommendations]
    
    return recommended_product_indices

# Main function
def main():
    # Fetch interaction data from MySQL database
    interaction_data = fetch_interaction_data()

    # Create user-item matrix from interaction data
    user_item_matrix = create_user_item_matrix(interaction_data)

    # Perform Singular Value Decomposition (SVD)
    U, Sigma, Vt = perform_svd(user_item_matrix)

    # Example: Generate recommendations for user ID 1
    user_id = 10
    recommendations = generate_recommendations(user_id, user_item_matrix, U, Sigma, Vt)
    print(f"Recommendations for user {user_id}: {recommendations}")

if __name__ == "__main__":
    main()
