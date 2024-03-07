from flask import Flask, request, jsonify
import numpy as np
import mysql.connector
from scipy.sparse.linalg import svds

app = Flask(__name__)

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

# Function to fetch product categories from the product table in MySQL
def fetch_product_categories(product_ids):
    db_connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="ecommerce"
    )

    cursor = db_connection.cursor()

    # Fetch categories for the relevant product IDs
    categories = {}
    for product_id in product_ids:
        cursor.execute("SELECT categories FROM products WHERE p_id = %s", (product_id,))
        category = cursor.fetchone()
        if category:
            categories[product_id] = category[0]

    cursor.close()
    db_connection.close()

    return categories

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

# Function to generate content-based recommendations
# Function to generate content-based recommendations
# Function to generate content-based recommendations
# Function to generate content-based recommendations
def generate_content_based_recommendations(user_id, interaction_data, num_recommendations=5):
    # Fetch product categories for products with count_view > 3
    relevant_product_ids = [row[1] for row in interaction_data if row[0] == user_id and row[2] > 3]

    print("relevant_product_ids")
    print(relevant_product_ids)
    
    # Include the relevant product IDs from interaction data
    for row in interaction_data:
        if row[0] == user_id and row[1] not in relevant_product_ids:
            relevant_product_ids.append(row[1])
    
    categories = fetch_product_categories(relevant_product_ids)
    
    # Fetch similar products based on categories
    similar_products = set()
    for product_id, category in categories.items():
        # Query MySQL to find products with similar categories
        db_connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root123",
            database="ecommerce"
        )
        cursor = db_connection.cursor()
        cursor.execute("SELECT p_id FROM products WHERE categories = %s AND p_id != %s", (category, product_id))
        similar_products_query = cursor.fetchall()
        for row in similar_products_query:
            similar_products.add(row[0])
        cursor.close()
        db_connection.close()
    
    # Filter out products already interacted with by the user
    recommendations = [product_id for product_id in similar_products if product_id not in relevant_product_ids][:num_recommendations]
    recommendations += relevant_product_ids
    return recommendations




@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    # Get user_id from request body
    user_id = request.json.get('user_id')

    # Fetch interaction data
    interaction_data = fetch_interaction_data()

    # Extract unique user IDs from the interaction data
    user_ids = set(row[0] for row in interaction_data)

    # Check if the given user ID exists in the interaction data
    if user_id not in user_ids:
        return jsonify({'error': f"User {user_id} does not exist."}), 400

    # Create user-item matrix
    user_item_matrix = create_user_item_matrix(interaction_data)

    # Calculate user similarity (cosine similarity)
    similarity_matrix = cosine_similarity(user_item_matrix)

    # Generate collaborative recommendations for the user
    collaborative_recommendations = generate_recommendations(user_id, user_item_matrix, similarity_matrix)
    print(collaborative_recommendations)
   

    # Generate content-based recommendations for the user
    content_based_recommendations = generate_content_based_recommendations(user_id, interaction_data)
    print(content_based_recommendations)

    # Combine collaborative and content-based recommendations as needed
    # combined_recommendations = collaborative_recommendations + content_based_recommendations

    # Combine collaborative and content-based recommendations as needed
    combined_recommendations = [int(x) for x in collaborative_recommendations] + content_based_recommendations


    return jsonify({'user_id': user_id, 'recommendations': combined_recommendations})

# def get_recommendations():
#     # Get user_id from request body
#     user_id = request.json.get('user_id')

#     # Fetch interaction data
#     interaction_data = fetch_interaction_data()

#     # Extract unique user IDs from the interaction data
#     user_ids = set(row[0] for row in interaction_data)

#     # Check if the given user ID exists in the interaction data
#     if user_id not in user_ids:
#         return jsonify({'error': f"User {user_id} does not exist."}), 400

#     # Create user-item matrix
#     user_item_matrix = create_user_item_matrix(interaction_data)

#     # Calculate user similarity (cosine similarity)
#     similarity_matrix = cosine_similarity(user_item_matrix)

#     # Generate recommendations for the user
#     recommendations = generate_recommendations(user_id, user_item_matrix, similarity_matrix)

#     recommendations = [int(x) for x in recommendations]

#     return jsonify({'user_id': user_id, 'recommendations': recommendations})

if __name__ == "__main__":
    app.run(debug=True)
