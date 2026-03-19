"""
音声ルーター
音声認識（STT）と音声合成（TTS）のエンドポイントを提供する
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

import services.speech_service as speech_service

# ルーターの初期化
router = APIRouter()


class SynthesizeRequest(BaseModel):
    """音声合成リクエストモデル"""
    # 音声合成するテキスト
    text: str


class RecognizeResponse(BaseModel):
    """音声認識レスポンスモデル"""
    # 認識されたテキスト
    text: str


class SynthesizeResponse(BaseModel):
    """音声合成レスポンスモデル"""
    # base64エンコードされた音声データ（MP3形式）
    audio_base64: str


@router.post("/recognize", response_model=RecognizeResponse)
async def recognize_speech(
    audio: UploadFile = File(..., description="音声ファイル（WAV, WebM, OGG等）")
) -> RecognizeResponse:
    """
    アップロードされた音声ファイルをテキストに変換する（日本語）

    - **audio**: multipart/form-data 形式の音声ファイル
    """
    try:
        # ファイルのバイナリデータを読み込み
        audio_content = await audio.read()

        if not audio_content:
            raise HTTPException(status_code=400, detail="音声ファイルが空です。")

        # 音声認識サービスを呼び出し
        recognized_text = await speech_service.recognize_speech(audio_content=audio_content)

        return RecognizeResponse(text=recognized_text)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"音声認識中にエラーが発生しました: {str(e)}")


@router.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize_speech(request: SynthesizeRequest) -> SynthesizeResponse:
    """
    テキストを音声データに変換し、base64エンコードして返す（日本語WaveNet）

    - **text**: 音声合成するテキスト
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="テキストが空です。")

        # 音声合成サービスを呼び出し
        audio_base64 = await speech_service.synthesize_speech(text=request.text)

        return SynthesizeResponse(audio_base64=audio_base64)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"音声合成中にエラーが発生しました: {str(e)}")
