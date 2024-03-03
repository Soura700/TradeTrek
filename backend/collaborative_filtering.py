# # Python script to implement collaborative filtering with SVD

# import numpy as np
# from scipy.sparse import coo_matrix
# from scipy.sparse.linalg import svds
# import mysql.connector

# # Step 1: Retrieve interaction data from MySQL database
# def fetch_interaction_data():
#     # Connect to MySQL database
#     db_connection = mysql.connector.connect(
#         host="your_host",
#         user="your_username",
#         password="your_password",
#         database="your_database"
#     )

#     # Fetch interaction data from interactions table
#     cursor = db_connection.cursor()
#     cursor.execute("SELECT user_id, product_id, ratings, count_view FROM interactions")
#     data = cursor.fetchall()

#     # Close database connection
#     cursor.close()
#     db_connection.close()

#     return data

# # Step 2: Preprocess data and create user-item matrix
# def create_user_item_matrix(interaction_data):
#     # Preprocess interaction data and create user-item matrix
#     user_ids, product_ids, ratings, count_views = zip(*interaction_data)
#     num_users = len(set(user_ids))
#     num_items = len(set(product_ids))

#     # Create a COO sparse matrix for user-item interactions
#     interaction_matrix = coo_matrix((ratings, (user_ids, product_ids)), shape=(num_users, num_items))
#     return interaction_matrix

# # Step 3: Perform Singular Value Decomposition (SVD)
# def perform_svd(interaction_matrix):
#     # Perform SVD on the interaction matrix
#     U, sigma, Vt = svds(interaction_matrix, k=50)  # Choose the number of latent factors (k)

#     # Create diagonal matrix from singular values
#     sigma = np.diag(sigma)
#     return U, sigma, Vt

# # Step 4: Make predictions for missing entries
# def predict_ratings(U, sigma, Vt, user_id, product_id):
#     # Predict rating for a given user and product
#     predicted_rating = np.dot(np.dot(U[user_id, :], sigma), Vt[:, product_id])
#     return predicted_rating

# # Step 5: Generate recommendations
# def generate_recommendations(user_id, interaction_data, U, sigma, Vt):
#     # Find products with high predicted ratings for the user
#     recommendations = []
#     for product_id in range(Vt.shape[1]):
#         if interaction_data[user_id, product_id] == 0:  # Check if user hasn't interacted with the product
#             predicted_rating = predict_ratings(U, sigma, Vt, user_id, product_id)
#             recommendations.append((product_id, predicted_rating))
#     recommendations.sort(key=lambda x: x[1], reverse=True)  # Sort recommendations by predicted rating
#     return recommendations

# # Step 6: Integration with MERN stack project (not implemented here)

# # Main function
# def main():
#     # Step 1: Fetch interaction data from MySQL database
#     interaction_data = fetch_interaction_data()

#     # Step 2: Preprocess data and create user-item matrix
#     interaction_matrix = create_user_item_matrix(interaction_data)

#     # Step 3: Perform Singular Value Decomposition (SVD)
#     U, sigma, Vt = perform_svd(interaction_matrix)

#     # Step 5: Generate recommendations for a specific user
#     user_id = 1  # Example user ID
#     recommendations = generate_recommendations(user_id, interaction_matrix, U, sigma, Vt)
#     print("Recommendations for user", user_id, ":", recommendations)

# if __name__ == "__main__":
#     main()


# collaborative_filtering.py

# Import necessary libraries
import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.linalg import svds
import mysql.connector

# Function to fetch interaction data from MySQL database
def fetch_interaction_data():
    # Connect to MySQL database
    db_connection = mysql.connector.connect(
        host= "localhost",
        user="root",
        password= "root123",
        database="ecommerce"
        # host="your_host",
        # user="your_username",
        # password="your_password",
        # database="your_database"
    )

    # Fetch interaction data from interactions table
    cursor = db_connection.cursor()
    cursor.execute("SELECT user_id, product_id, ratings, count_view FROM interactions")
    data = cursor.fetchall()

    # Close database connection
    cursor.close()
    db_connection.close()

    return data

# Function to create user-item matrix
def create_user_item_matrix(interaction_data):
    # Preprocess interaction data and create user-item matrix
    user_ids, product_ids, ratings, count_views = zip(*interaction_data)
    num_users = len(set(user_ids))
    num_items = len(set(product_ids))

    # Create a COO sparse matrix for user-item interactions
    interaction_matrix = coo_matrix((ratings, (user_ids, product_ids)), shape=(num_users, num_items))
    return interaction_matrix

# Function to perform Singular Value Decomposition (SVD)
def perform_svd(interaction_matrix):
    # Perform SVD on the interaction matrix
    U, sigma, Vt = svds(interaction_matrix, k=50)  # Choose the number of latent factors (k)

    # Create diagonal matrix from singular values
    sigma = np.diag(sigma)
    return U, sigma, Vt

# Function to generate recommendations for a specific user
def generate_recommendations(user_id, interaction_data, U, sigma, Vt):
    # Find products with high predicted ratings for the user
    recommendations = []
    for product_id in range(Vt.shape[1]):
        if interaction_data[user_id, product_id] == 0:  # Check if user hasn't interacted with the product
            predicted_rating = predict_ratings(U, sigma, Vt, user_id, product_id)
            recommendations.append((product_id, predicted_rating))
    recommendations.sort(key=lambda x: x[1], reverse=True)  # Sort recommendations by predicted rating
    return recommendations

# Function to predict ratings for a given user and product
def predict_ratings(U, sigma, Vt, user_id, product_id):
    predicted_rating = np.dot(np.dot(U[user_id, :], sigma), Vt[:, product_id])
    return predicted_rating

# Main function
def main():
    # Fetch interaction data from MySQL database
    interaction_data = fetch_interaction_data()

    # Preprocess data and create user-item matrix
    interaction_matrix = create_user_item_matrix(interaction_data)

    # Perform Singular Value Decomposition (SVD)
    U, sigma, Vt = perform_svd(interaction_matrix)

    # Generate recommendations for a specific user
    user_id = 1  # Example user ID
    recommendations = generate_recommendations(user_id, interaction_matrix, U, sigma, Vt)
    print("Recommendations for user", user_id, ":", recommendations)

if __name__ == "__main__":
    main()
