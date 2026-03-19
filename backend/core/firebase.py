"""
Firebase 初期化モジュール
Firebase Admin SDK を使用して Firestore クライアントを提供する
"""

import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import Client

from core.config import settings

# Firebase アプリが既に初期化されているかチェック
_firebase_app: firebase_admin.App | None = None


def initialize_firebase() -> None:
    """Firebase Admin SDK を初期化する"""
    global _firebase_app

    # 既に初期化済みの場合はスキップ
    if _firebase_app is not None:
        return

    # サービスアカウントの認証情報を読み込み
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    _firebase_app = firebase_admin.initialize_app(cred)


def get_firestore_client() -> Client:
    """
    Firestoreクライアントを返す
    未初期化の場合は先に初期化を行う
    """
    # 未初期化であれば初期化
    if not firebase_admin._apps:
        initialize_firebase()

    return firestore.client()
