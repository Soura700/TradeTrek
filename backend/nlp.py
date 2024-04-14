# # import joblib
# # # from sklearn.feature_extraction.text import TfidfVectorizer
# # from sklearn.feature_extraction.text import CountVectorizer
# # import nltk
# # from nltk.corpus import stopwords
# # import string


# # cv = CountVectorizer(max_features = 1500)

# # # Load the trained model
# # model = joblib.load('Product_review_model')

# # # Load NLTK resources
# # nltk.download('punkt')
# # nltk.download('stopwords')
# # stop_words = set(stopwords.words('english'))

# # # Preprocess review function
# # def preprocess_review(review):
# #     tokens = nltk.word_tokenize(review)
# #     tokens = [token for token in tokens if token not in string.punctuation]
# #     tokens = [token.lower() for token in tokens]
# #     tokens = [token for token in tokens if token not in stop_words]
# #     preprocessed_review = ' '.join(tokens)
# #     return preprocessed_review

# # # Predict sentiment function
# # # Predict sentiment function
# # # Predict sentiment function
# # def predict_sentiment(review):
# #     preprocessed_review = preprocess_review(review)
# #     preprocessed_review = [preprocessed_review]  # Convert to list of 1D array
# #     preprocessed_review = cv.transform(preprocessed_review)  # Transform to 2D array
# #     sentiment = model.predict(preprocessed_review)
# #     return "Positive" if sentiment[0] == 1 else "Negative"



# # # Input review from user
# # review = input("Enter your review: ")

# # # Predict sentiment
# # sentiment = predict_sentiment(review)
# # print(f"The predicted sentiment for the review is: {sentiment}")





# from flask import Flask, request, jsonify
# import joblib
# import nltk
# from nltk.corpus import stopwords
# import string
# from sklearn.feature_extraction.text import CountVectorizer

# app = Flask(__name__)

# # Load the trained model
# model = joblib.load('Product_review_model')
# cv = CountVectorizer(max_features = 1500)

# # Load NLTK resources
# nltk.download('punkt')
# nltk.download('stopwords')
# stop_words = set(stopwords.words('english'))

# # Preprocess review function
# def preprocess_review(review):
#     tokens = nltk.word_tokenize(review)
#     tokens = [token for token in tokens if token not in string.punctuation]
#     tokens = [token.lower() for token in tokens]
#     tokens = [token for token in tokens if token not in stop_words]
#     preprocessed_review = ' '.join(tokens)
#     return preprocessed_review

# # Predict sentiment function
# # def predict_sentiment(review):
# #     preprocessed_review = preprocess_review(review)
# #     preprocessed_review = [preprocessed_review]  # Convert to list of 1D array
# #     sentiment = model.predict(preprocessed_review)
# #     return "Positive" if sentiment[0] == 1 else "Negative"
# def predict_sentiment(review):
#     preprocessed_review = preprocess_review(review)
#     preprocessed_review = [preprocessed_review]  # Convert to list of 1D array
#     preprocessed_review = cv.transform(preprocessed_review)  # Transform to 2D array
#     sentiment = model.predict(preprocessed_review)
#     return "Positive" if sentiment[0] == 1 else "Negative"


# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     review = data['review']
#     sentiment = predict_sentiment(review)
#     return jsonify({'sentiment': sentiment})

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
import joblib
import pandas as pd
import nltk
from nltk.corpus import stopwords
import string
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)

# Load the trained model
model = joblib.load('Product_review_model')

# Load NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Load training data
training_data = pd.read_csv('AmazonReview.csv')



# Drop rows with NaN values
training_data.dropna(subset=['Review'], inplace=True)

# Instantiate CountVectorizer
cv = CountVectorizer(max_features=1500)

# Fit CountVectorizer with vocabulary
cv.fit(training_data['Review'])


# Preprocess review function
def preprocess_review(review):
    tokens = nltk.word_tokenize(review)
    tokens = [token for token in tokens if token not in string.punctuation]
    tokens = [token.lower() for token in tokens]
    tokens = [token for token in tokens if token not in stop_words]
    preprocessed_review = ' '.join(tokens)
    return preprocessed_review

# Predict sentiment function
def predict_sentiment(review):
    preprocessed_review = preprocess_review(review)
    preprocessed_review = [preprocessed_review]  # Convert to list of 1D array
    preprocessed_review = cv.transform(preprocessed_review)  # Transform to 2D array
    sentiment = model.predict(preprocessed_review)
    return "Positive" if sentiment[0] == 1 else "Negative"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review = data['review']
    sentiment = predict_sentiment(review)
    return jsonify({'sentiment': sentiment})

if __name__ == '__main__':
    app.run(debug=True)
