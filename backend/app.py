from flask import Flask, jsonify
from flask_cors import CORS
import db_utils
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/sales', methods=['GET'])
def get_sales():
    try:
        # Get online sales from PostgreSQL
        online_sales = db_utils.get_online_sales()
        return jsonify(online_sales)
    except Exception as e:
        logger.error(f"Error fetching sales data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    try:
        # Get sales summary from MySQL
        summary = db_utils.get_sales_summary()
        return jsonify(summary)
    except Exception as e:
        logger.error(f"Error fetching summary data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 