"""
練習履歴ルーター
Firestoreを使用してユーザーの練習履歴を保存・取得するエンドポイントを提供する
"""

import logging
import traceback
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from google.cloud.firestore_v1.base_query import FieldFilter

logger = logging.getLogger(__name__)

from core.firebase import get_firestore_client
from models.record import (
    SaveRecordRequest,
    SaveRecordResponse,
    RecordItem,
    GetRecordsResponse,
)

# ルーターの初期化
router = APIRouter()

# Firestoreのコレクション名
RECORDS_COLLECTION = "practice_records"


@router.post("/", response_model=SaveRecordResponse)
async def save_record(request: SaveRecordRequest) -> SaveRecordResponse:
    """
    練習履歴をFirestoreに保存する

    - **user_id**: ユーザーID（Firebase Authentication の UID）
    - **scenario_name**: 練習したシナリオ名
    - **scores**: 各評価項目のスコア
    - **feedback**: フィードバック内容
    - **created_at**: 練習日時（省略時は現在時刻）
    """
    try:
        db = get_firestore_client()

        # created_at が指定されていない場合は現在時刻を使用
        created_at = request.created_at or datetime.now(timezone.utc)

        # Firestoreに保存するデータを構築
        record_data = {
            "user_id": request.user_id,
            "scenario_name": request.scenario_name,
            "scores": request.scores.model_dump(),
            "feedback": request.feedback.model_dump(),
            "created_at": created_at,
        }

        # Firestoreに新規ドキュメントを追加（IDは自動生成）
        doc_ref = db.collection(RECORDS_COLLECTION).add(record_data)

        # add() は (timestamp, DocumentReference) のタプルを返す
        record_id = doc_ref[1].id

        return SaveRecordResponse(
            record_id=record_id,
            message="練習履歴を保存しました。",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"練習履歴の保存中にエラーが発生しました: {str(e)}")


@router.get("/{user_id}", response_model=GetRecordsResponse)
async def get_records(user_id: str) -> GetRecordsResponse:
    """
    指定したユーザーの練習履歴一覧を取得する

    - **user_id**: ユーザーID（Firebase Authentication の UID）
    """
    try:
        db = get_firestore_client()

        # ユーザーIDでフィルタリングし、作成日時の降順で取得
        docs = (
            db.collection(RECORDS_COLLECTION)
            .where(filter=FieldFilter("user_id", "==", user_id))
            .order_by("created_at", direction="DESCENDING")
            .stream()
        )

        records: list[RecordItem] = []
        for doc in docs:
            data = doc.to_dict()

            # Firestoreのタイムスタンプをdatetimeに変換
            created_at = data.get("created_at")
            if hasattr(created_at, "to_datetime"):
                created_at = created_at.to_datetime()
            elif not isinstance(created_at, datetime):
                created_at = datetime.now(timezone.utc)

            record = RecordItem(
                record_id=doc.id,
                user_id=data.get("user_id", ""),
                scenario_name=data.get("scenario_name", ""),
                scores=data.get("scores", {}),
                feedback=data.get("feedback", {}),
                created_at=created_at,
            )
            records.append(record)

        return GetRecordsResponse(records=records)

    except Exception as e:
        logger.error("練習履歴の取得中にエラーが発生しました:\n%s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"練習履歴の取得中にエラーが発生しました: {str(e)}")
