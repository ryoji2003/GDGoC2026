"""
アプリケーション設定モジュール
pydantic_settings の BaseSettings を使用して環境変数を管理する
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """アプリケーション全体の設定クラス"""

    # Gemini API キー
    GEMINI_API_KEY: str

    # Google Cloud プロジェクトID
    GOOGLE_CLOUD_PROJECT: str

    # Firebase サービスアカウント認証情報のファイルパス
    FIREBASE_CREDENTIALS_PATH: str

    # Google Cloud サービスアカウントキーのファイルパス（Speech-to-Text / Text-to-Speech用）
    GOOGLE_APPLICATION_CREDENTIALS: str

    class Config:
        # .env ファイルから自動読み込み
        env_file = ".env"
        env_file_encoding = "utf-8"


# シングルトンインスタンス（アプリ全体で共有）
settings = Settings()
