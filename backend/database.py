import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="universal_brain",
        user="postgres",
        password="iphonex10",
        port="5432"
    )
    return conn