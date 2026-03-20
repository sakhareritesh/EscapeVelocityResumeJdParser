"""
db/mongo.py - MongoDB connection and collection management
"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

load_dotenv()


class MongoDB:
    _client = None
    _db = None

    @classmethod
    def connect(cls):
        """Initialize MongoDB connection."""
        if cls._client is None:
            mongo_uri = os.getenv("MONGO_URI")
            db_name = os.getenv("MONGO_DB_NAME", "adaptive_onboarding")

            if not mongo_uri:
                raise ValueError("MONGO_URI not set in environment variables.")

            try:
                cls._client = MongoClient(
                    mongo_uri,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=5000,
                    socketTimeoutMS=30000,
                )
                # Verify connection
                cls._client.admin.command("ping")
                cls._db = cls._client[db_name]
                print(f"✅ Connected to MongoDB — database: '{db_name}'")
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                print(f"❌ MongoDB connection failed: {e}")
                raise

        return cls._db

    @classmethod
    def get_db(cls):
        """Return existing DB instance or connect."""
        if cls._db is None:
            return cls.connect()
        return cls._db

    @classmethod
    def get_collection(cls, name: str):
        """Return a named collection."""
        db = cls.get_db()
        return db[name]

    @classmethod
    def close(cls):
        """Close the MongoDB connection."""
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None
            print("🔌 MongoDB connection closed.")


def get_sessions_collection():
    """Shortcut to get the sessions collection."""
    return MongoDB.get_collection("sessions")
