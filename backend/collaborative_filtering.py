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

# Function to create user-item matrix from count_view data
def create_user_item_matrix(interaction_data):
    user_ids, product_ids, count_views = zip(*interaction_data)
    
    # Calculate the maximum user and product IDs
    max_user_id = max(user_ids)
    max_product_id = max(product_ids)
    
    # Create an empty user-item matrix
    user_item_matrix = np.zeros((max_user_id + 1, max_product_id + 1))
    
    # Fill the user-item matrix with count_view values
    for user_id, product_id, count_view in interaction_data:
        user_item_matrix[user_id, product_id] = count_view
    
    return user_item_matrix

# Function to calculate similarity between users (cosine similarity)
def cosine_similarity(user_item_matrix):
    # Compute the dot product of the user-item matrix with its transpose
    dot_product = np.dot(user_item_matrix, user_item_matrix.T)
    # Compute the norms of the user-item matrix rows
    norms = np.linalg.norm(user_item_matrix, axis=1)
    # Compute the cosine similarity matrix
    similarity_matrix = dot_product / np.outer(norms, norms)
    return similarity_matrix

# Function to generate recommendations for a specific user based on user similarity
# Function to generate recommendations for a specific user based on user similarity
def generate_recommendations(user_id, user_item_matrix, similarity_matrix, num_recommendations=5):
    # Get the similarity scores of the target user with all other users
    user_similarity_scores = similarity_matrix[user_id]
    # Sort the users by similarity score in descending order
    similar_users = np.argsort(user_similarity_scores)[::-1]
    
    # Find the products that the target user has not interacted with
    unseen_products = np.where(user_item_matrix[user_id] == 0)[0]
    
    # Set to store unique recommendations
    unique_recommendations = set()
    
    # Generate recommendations by aggregating the preferences of similar users
    for user in similar_users:
        if user == user_id:
            continue
        for product in unseen_products:
            if user_item_matrix[user, product] > 0:
                unique_recommendations.add(product)
                if len(unique_recommendations) >= num_recommendations:
                    return list(unique_recommendations)
    
    return list(unique_recommendations)


# Main function
def main():
    # Fetch interaction data
    interaction_data = fetch_interaction_data()

    # Extract unique user IDs from the interaction data
    user_ids = set(row[0] for row in interaction_data)

    # Example user ID
    user_id = 10
    
    # Check if the given user ID exists in the interaction data
    if user_id not in user_ids:
        print(f"User {user_id} does not exist.")
        return

    # Create user-item matrix
    user_item_matrix = create_user_item_matrix(interaction_data)

    # Calculate user similarity (cosine similarity)
    similarity_matrix = cosine_similarity(user_item_matrix)

    # Generate recommendations for the user
    recommendations = generate_recommendations(user_id, user_item_matrix, similarity_matrix)
    print(f"Recommendations for user {user_id}: {recommendations}")

if __name__ == "__main__":
    main()

