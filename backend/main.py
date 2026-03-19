"""
FastAPI アプリケーションエントリーポイント
全ルーターの登録とミドルウェアの設定を行う
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import conversation, evaluation, speech, records, scenarios
from core.config import settings
from core.firebase import initialize_firebase

# FastAPIアプリケーションの初期化
app = FastAPI(
    title="日本語コミュニケーション練習 API",
    description="ロールプレイを通じて日本語コミュニケーションスキルを練習するAPIサーバー",
    version="1.0.0",
)

# CORSミドルウェアの設定（全オリジン許可）
app.add_middleware(
    CORSMiddleware,
    # 全てのオリジンを許可
    allow_origins=["*"],
    # 認証情報（Cookie等）を含むリクエストを許可
    allow_credentials=True,
    # 全てのHTTPメソッドを許可
    allow_methods=["*"],
    # 全てのリクエストヘッダーを許可
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    """アプリケーション起動時の初期化処理"""
    # Google Cloud 認証情報を環境変数に設定（Speech-to-Text / Text-to-Speech用）
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS
    # Firebase Admin SDK を初期化
    initialize_firebase()
    print("Firebase 初期化完了")


# 全ルーターを /api プレフィックスで登録
# 各ルーターにはさらにリソース別のプレフィックスを付与する

app.include_router(
    conversation.router,
    prefix="/api/conversation",
    tags=["conversation"],
)

app.include_router(
    evaluation.router,
    prefix="/api/evaluation",
    tags=["evaluation"],
)

app.include_router(
    speech.router,
    prefix="/api/speech",
    tags=["speech"],
)

app.include_router(
    records.router,
    prefix="/api/records",
    tags=["records"],
)

app.include_router(
    scenarios.router,
    prefix="/api/scenarios",
    tags=["scenarios"],
)


@app.get("/", tags=["health"])
async def root() -> dict:
    """ヘルスチェックエンドポイント"""
    return {"status": "ok", "message": "日本語コミュニケーション練習 API が稼働中です"}


@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """詳細なヘルスチェックエンドポイント"""
    return {
        "status": "healthy",
        "version": "1.0.0",
    }
