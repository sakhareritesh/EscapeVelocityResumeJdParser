"""
services/firebase_admin.py - Firebase Admin SDK initialization and token verification
"""

import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

_firebase_app = None


def init_firebase():
    """Initialize Firebase Admin SDK."""
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    # Try to load from environment variable (JSON string)
    creds_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if creds_json:
        cred_dict = json.loads(creds_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # Fallback to file path
        cred_path = os.getenv(
            "FIREBASE_SERVICE_ACCOUNT_PATH",
            os.path.join(os.path.dirname(__file__), '..', 'firebase-service-account.json')
        )
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            print("⚠️  No Firebase credentials found. Token verification will be disabled.")
            return None

    try:
        _firebase_app = firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized")
        return _firebase_app
    except Exception as e:
        print(f"⚠️  Firebase Admin SDK init failed: {e}")
        return None


def verify_firebase_token(id_token: str) -> dict | None:
    """
    Verify a Firebase ID token and return the decoded token (contains uid, email, etc).
    Returns None if verification fails.
    """
    if _firebase_app is None:
        # If Firebase not initialized, try to init
        init_firebase()
        if _firebase_app is None:
            return None

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"⚠️  Token verification failed: {e}")
        return None


def get_uid_from_request(request) -> str | None:
    """
    Extract Firebase UID from the request.
    Checks Authorization header for Bearer token first,
    then falls back to 'firebase_uid' form field.
    """
    # Check Authorization header
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        id_token = auth_header[7:]
        decoded = verify_firebase_token(id_token)
        if decoded:
            return decoded.get('uid')

    # Fallback: Accept UID directly (for dev/testing)
    uid = request.form.get('firebase_uid') or request.args.get('firebase_uid')
    return uid
