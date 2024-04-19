# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd
# import nltk
# from nltk.corpus import stopwords
# import string
# import mysql.connector
# from sklearn.feature_extraction.text import CountVectorizer

# app = Flask(__name__)

# # Load the trained model
# model = joblib.load('Product_review_model')

# # Load NLTK resources
# nltk.download('punkt')
# nltk.download('stopwords')
# custom_stop_words = {"aren't", "doesn", "doesn't", "didn", "didn't", "aren", "aren't", "ain", "hasn",
#                      "hasn't", 'have', 'haven', "haven't", 'isn', "isn't", 'mightn', "mightn't", 'mustn',
#                      "mustn't", 'needn', 'shan', "shan't", "needn't", 'shouldn', "shouldn't", 'wasn',
#                      "wasn't", 'weren', "weren't", 'wouldn', "wouldn't"}
# stop_words = set(stopwords.words('english')) - custom_stop_words

# # Load training data
# training_data = pd.read_csv('AmazonReview.csv')



# def fetch_interaction_data():
#     db_connection = mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="root123",
#         database="ecommerce"
#     )

#     cursor = db_connection.cursor()
#     cursor.execute("SELECT review FROM reviews")
#     data = cursor.fetchall()

#     cursor.close()
#     db_connection.close()

#     return data

# print(fetch_interaction_data())

# # Drop rows with NaN values
# training_data.dropna(subset=['Review'], inplace=True)

# # Instantiate CountVectorizer
# cv = CountVectorizer(max_features=1500)

# # Fit CountVectorizer with vocabulary
# cv.fit(training_data['Review'])


# # Preprocess review function
# def preprocess_review(review):
#     tokens = nltk.word_tokenize(review)
#     tokens = [token for token in tokens if token not in string.punctuation]
#     tokens = [token.lower() for token in tokens if token.lower() not in stop_words]
#     preprocessed_review = ' '.join(tokens)
#     return preprocessed_review

# # Predict sentiment function
# def predict_sentiment(review):
#     preprocessed_review = preprocess_review(review)
#     preprocessed_review = [preprocessed_review]  # Convert to list of 1D array
#     preprocessed_review = cv.transform(preprocessed_review)  # Transform to 2D array
#     sentiment = model.predict(preprocessed_review)
#     return "Positive" if sentiment[0] == 1 else "Negative"

# @app.route('/predict', methods=['POST'])
# def predict():
#     reviews = fetch_interaction_data()  # Fetch reviews from the database
#     positive_count = 0
#     negative_count = 0
    
#     for review_tuple in reviews:
#         review = review_tuple[0]
#         sentiment = predict_sentiment(review)
#         print(sentiment);
#         if sentiment == 'Positive':
#             positive_count += 1
#         elif sentiment == 'Negative':
#             negative_count += 1

#     total_reviews = len(reviews)
#     average_positive = positive_count / total_reviews
#     average_negative = negative_count / total_reviews
    
#     return jsonify({
#         'average_positive': average_positive,
#         'average_negative': average_negative
#     })

# if __name__ == '__main__':
#     app.run(debug=True)

# Good Wroking Code 

from flask import Flask, jsonify
import os
import mysql.connector
from together import Together

app = Flask(__name__)

# Set up Together AI
together_ai_api_key = "467640218549a3d4be87863d98656e084b3904143459bd788123154d34b1124f"
os.environ['TOGETHER_AI_API_KEY'] = together_ai_api_key
client = Together(api_key=os.environ.get("TOGETHER_AI_API_KEY"))

# Function to analyze sentiment of a single review
def analyze_sentiment(review):
    prompt=f''' what is the sentiment of the following review ? 
                Give your answer as "Positive" or "Negative"
                Review : {review}'''
    response = client.chat.completions.create(        
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages= [{"role": "system","content" : "You are a helpful assistant to generate responses on the given prompt."},
                   {"role": "user", "content": prompt}
                   ],
        temperature=0.5,
        max_tokens=500
    )
    response_text = str(response.choices[0].message.content)
    sentiment_label = response_text.split(':')[-1].strip()

    # print("Response Text" + response_text)
    # sentiment_label = response_text.split(' ', 1)[1].split('.')[0].strip()
    # print("Sentiment Label" + sentiment_label)
    # Extract sentiment label and cause
    # sentiment_label = response_text.split('.')[0].strip()
    # sentiment_cause = '.'.join(response_text.split('.')[1:]).strip()
    # return sentiment_label, sentiment_cause
    return sentiment_label
    # return str(response.choices[0].message.content)   



# API route to analyze reviews
@app.route('/predict', methods=['POST'])
def analyze_reviews():
    positive_count = 0
    negative_count = 0
    
    # Connect to your MySQL database
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="ecommerce"
    )

    # Fetch reviews from the database
    cursor = connection.cursor()
    cursor.execute("SELECT review FROM reviews")
    reviews = cursor.fetchall()
    # Define positive and negative keywords
    positive_keywords = ["positive"]
    negative_keywords = ["negative"]

    # Analyze sentiment for each review
    for review in reviews:
        review_text = review[0]
        sentiment = analyze_sentiment(review_text)


        # if "positive" in sentiment.lower():
        #     positive_count += 1
        # if "negative" in sentiment.lower():
        #     negative_count += 1


        # if "positive" in sentiment.lower():
        #     if "negative" in sentiment.lower():
        #         print("Entered In the positive negative")
        #         negative_count += 1
        #     else:
        #         print("Entered In the Else of the Positive")
        #         positive_count +=1

        
        # if "negative" in sentiment.lower():
        #     if "positive" in sentiment.lower():
        #         print("Entered in the negative positive")
        #         positive_count += 1
        #     else:
        #         print("Entered in the negative else")
        #         negative_count+=1

        if "positive" in sentiment.lower():
            if "negative" in sentiment.lower():
                ("Entered in the positive negative")
                negative_count += 1
            else:
                print("Entered in the Else of the Positive")
                positive_count += 1
        elif "negative" in sentiment.lower():
            if "positive" in sentiment.lower():
                print("Entered in the negative positive")
                positive_count += 1
            else:
                print("Entered in the negative else")
                negative_count += 1

            
    
    # Close cursor and connection
    cursor.close()
    connection.close()
    
    # Return counts as JSON response
    response = {
        "positive_count": positive_count,
        "negative_count": negative_count
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
