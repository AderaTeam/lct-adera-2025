import polars as pl
import psycopg2
from psycopg2.extras import execute_batch
from typing import List, Dict, Any
import os
from datetime import datetime
import dotenv


class ReviewDataUploader:
    def __init__(self, db_config: Dict[str, str]):
        """
        Initialize the uploader with database configuration
        
        Args:
            db_config: Dictionary with database connection parameters
                (host, port, database, user, password)
        """
        self.db_config = db_config
        self.connection = None
        
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = psycopg2.connect(**self.db_config)
            print("Successfully connected to the database")
        except Exception as e:
            print(f"Error connecting to database: {e}")
            raise
    
    def disconnect(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            print("Database connection closed")
    
    def get_or_create_id(self, table: str, name_column: str, name: str, return_column: str = None) -> int:
        """
        Get existing ID or create new record and return ID
        
        Args:
            table: Table name
            name_column: Column name containing the unique name
            name: Value to look for or insert
            return_column: Column to return (defaults to primary key)
            
        Returns:
            ID of the record
        """
        if return_column is None:
            return_column = f"{table.split('_')[0]}_id"  # e.g., 'source_id' for 'sources' table
        
        with self.connection.cursor() as cursor:
            # Try to get existing ID
            cursor.execute(f"""
                SELECT {return_column} FROM {table} 
                WHERE {name_column} = %s
            """, (name,))
            result = cursor.fetchone()
            
            if result:
                return result[0]
            
            # Insert new record if not exists
            cursor.execute(f"""
                INSERT INTO {table} ({name_column}) 
                VALUES (%s) 
                RETURNING {return_column}
            """, (name,))
            self.connection.commit()
            return cursor.fetchone()[0]
    
    def upload_data(self, df: pl.DataFrame, batch_size: int = 1000):
        """
        Upload data from Polars DataFrame to database
        
        Args:
            df: Polars DataFrame with the required columns
            batch_size: Number of records to process in each batch
        """
        if self.connection is None:
            self.connect()
        
        # Required columns check
        required_columns = [
            'topic_name', 'topic_mood', 'review_title', 'review_text',
            'review_date', 'raiting', 'source', 'city_name'
        ]
        
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Convert to pandas for easier iteration (optional - you can use Polars if preferred)
        pandas_df = df.to_pandas()
        
        # Process data in batches
        for i in range(0, len(pandas_df), batch_size):
            batch = pandas_df.iloc[i:i + batch_size]
            self._process_batch(batch)
            print(f"Processed batch {i//batch_size + 1}/{(len(pandas_df)-1)//batch_size + 1}")
        
        print("Data upload completed successfully!")
    
    def _process_batch(self, batch):
        """Process a single batch of records"""
        try:
            with self.connection.cursor() as cursor:
                # Process each row in the batch
                for _, row in batch.iterrows():
                    # Get or create source_id
                    source_id = self.get_or_create_id('sources', 'source_name', row['source'], return_column="source_id")
                    
                    # Get or create city_id
                    city_id = self.get_or_create_id('cities', 'city_name', row['city_name'], return_column='city_id')
                    
                    # Get or create topic_id
                    topic_id = self.get_or_create_id('topics', 'topic_name', row['topic_name'], return_column='topic_id')
                    
                    # Insert review and get review_id
                    cursor.execute("""
                        INSERT INTO reviews (
                            review_title, review_text, rating, review_date, 
                            city_id, source_id
                        ) VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING review_id
                    """, (
                        row['review_title'], 
                        row['review_text'], 
                        row['raiting'], 
                        row['review_date'], 
                        city_id, 
                        source_id
                    ))
                    
                    review_id = cursor.fetchone()[0]
                    
                    # Insert into review_topics
                    cursor.execute("""
                        INSERT INTO review_topics (review_id, topic_id, topic_mood)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (review_id, topic_id) DO UPDATE SET
                        topic_mood = EXCLUDED.topic_mood,
                        created_at = CURRENT_TIMESTAMP
                    """, (review_id, topic_id, row['topic_mood']))
                
                self.connection.commit()
                
        except Exception as e:
            self.connection.rollback()
            print(f"Error processing batch: {e}")
            raise


# Example usage
def main():
    dotenv.load_dotenv()
    # Database configuration
    db_config = {
        'host': str(os.getenv('HOST')),
        'database': str(os.getenv('POSTGRES_DATABASE')),
        'user': str(os.getenv('POSTGRES_USER')),
        'password': str(os.getenv('POSTGRES_PASSWORD')),
        'port': int(os.getenv('PORT'))
    }
    
    # Example data - replace this with your actual DataFrame
    # sample_data = {
    #     'topic_name': ['service', 'food', 'ambiance'],
    #     'topic_mood': ['positive', 'neutral', 'negative'],
    #     'review_title': ['Great service!', 'Okay food', 'Bad ambiance'],
    #     'review_text': ['Great service!', 'Okay food', 'Bad ambiance'],
    #     'review_date': ['2024-01-15', '2024-01-16', '2024-01-17'],
    #     'rating': [5, 3, 1],
    #     'source': ['Google', 'Yelp', 'TripAdvisor'],
    #     'city': ['New York', 'Los Angeles', 'Chicago']
    # }
    
    # df = pl.DataFrame(sample_data)
    df = pl.read_csv('./data/example_csv_res.csv')
    df = df.with_columns(pl.lit('banki.ru').alias('source'))
    df1 = df.group_by(["id", "topic_name"]).agg([
        pl.col('topic_mood').mean(),
    ])# Create uploader instance
    df2 = df[:, ["id", "review_text","review_title","raiting","review_date", "source"]].unique(maintain_order=True).join(df1, on='id', how="left").with_columns(
        pl.col("topic_mood").map_elements(
            lambda a: (
                    "позитивный" if  4 <= a else 
                    "негативный" if a <= 2.5 else 
                    "нейтральный"
                ),
            return_dtype=pl.String
        ),
        pl.lit('г. Москва').alias('city_name')
    )
    uploader = ReviewDataUploader(db_config)
    print(df2)
    c = df2.null_count()
    print(c)
    try:
        uploader.connect()
        uploader.upload_data(df2, batch_size=500)
    except Exception as e:
        print(f"Error during upload: {e}")
    finally:
        uploader.disconnect()


if __name__ == "__main__":
    main()