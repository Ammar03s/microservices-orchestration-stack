import psycopg2
import mysql.connector
import logging
import os
from datetime import datetime
from decimal import Decimal

logger = logging.getLogger(__name__)

# PostgreSQL connection parameters
pg_params = {
    'host': os.environ.get('PG_HOST', 'postgres'),
    'database': os.environ.get('PG_DB', 'sales_db'),
    'user': os.environ.get('PG_USER', 'postgres'),
    'password': os.environ.get('PG_PASSWORD', 'password')
}

# MySQL connection parameters
mysql_params = {
    'host': os.environ.get('MYSQL_HOST', 'mysql'),
    'database': os.environ.get('MYSQL_DB', 'sales_warehouse'),
    'user': os.environ.get('MYSQL_USER', 'root'),
    'password': os.environ.get('MYSQL_PASSWORD', 'password')
}

def get_online_sales():
    """Get online sales data from PostgreSQL"""
    conn = None
    try:
        conn = psycopg2.connect(**pg_params)
        cursor = conn.cursor()
        
        sql_query = """
        SELECT sale_id, product_id, quantity, sale_amount, sale_date 
        FROM online_sales
        ORDER BY sale_date DESC
        """
        cursor.execute(sql_query)
        
        # Fetch all rows and convert to dictionaries
        columns = [desc[0] for desc in cursor.description]
        result = []
        for row in cursor.fetchall():
            item = dict(zip(columns, row))
            # Convert date objects to string for JSON serialization
            if isinstance(item['sale_date'], datetime):
                item['sale_date'] = item['sale_date'].isoformat()
            # Convert Decimal objects to float for JSON serialization
            if isinstance(item['sale_amount'], Decimal):
                item['sale_amount'] = float(item['sale_amount'])
            result.append(item)
        
        return result
    except Exception as e:
        logger.error(f"Error connecting to PostgreSQL: {str(e)}")
        raise
    finally:
        if conn:
            conn.close()

def get_sales_summary():
    """Get sales summary data from MySQL"""
    conn = None
    try:
        conn = mysql.connector.connect(**mysql_params)
        cursor = conn.cursor(dictionary=True)
        
        sql_query = """
        SELECT product_id, total_quantity, total_sale_amount, last_updated
        FROM product_sales_summary
        ORDER BY total_sale_amount DESC
        """
        cursor.execute(sql_query)
        result = cursor.fetchall()
        
        # Convert datetime and Decimal objects for JSON serialization
        for row in result:
            if isinstance(row['last_updated'], datetime):
                row['last_updated'] = row['last_updated'].isoformat()
            if isinstance(row['total_sale_amount'], Decimal):
                row['total_sale_amount'] = float(row['total_sale_amount'])
        
        return result
    except Exception as e:
        logger.error(f"Error connecting to MySQL: {str(e)}")
        raise
    finally:
        if conn:
            conn.close() 