"""
音声サービスモジュール
Google Cloud Speech-to-Text および Text-to-Speech を使って音声処理を行う
"""

import base64

from google.cloud import speech
from google.cloud import texttospeech


async def recognize_speech(audio_content: bytes) -> str:
    """
    音声データをテキストに変換する（日本語）

    Args:
        audio_content: 音声ファイルのバイナリデータ

    Returns:
        認識されたテキスト文字列

    Raises:
        RuntimeError: 音声認識に失敗した場合
    """
    # Speech-to-Text クライアントの初期化
    client = speech.SpeechClient()

    # 音声データのラッピング
    audio = speech.RecognitionAudio(content=audio_content)

    # 認識設定（日本語、WebM/OGG形式に対応）
    config = speech.RecognitionConfig(
        # 自動エンコーディング検出を使用
        encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
        # サンプリングレート（自動検出）
        sample_rate_hertz=48000,
        # 認識言語を日本語に設定
        language_code="ja-JP",
        # 複数の候補を返す場合の数
        max_alternatives=1,
        # 句読点を自動挿入
        enable_automatic_punctuation=True,
    )

    # 音声認識を実行（同期API）
    response = client.recognize(config=config, audio=audio)

    # 認識結果の取得
    if not response.results:
        return ""

    # 最初の認識結果から最も確度の高いものを取得
    transcript = response.results[0].alternatives[0].transcript
    return transcript


async def synthesize_speech(text: str) -> str:
    """
    テキストを音声データに変換し、base64エンコードして返す（日本語WaveNet）

    Args:
        text: 音声合成するテキスト

    Returns:
        base64エンコードされた音声データ（MP3形式）

    Raises:
        RuntimeError: 音声合成に失敗した場合
    """
    # Text-to-Speech クライアントの初期化
    client = texttospeech.TextToSpeechClient()

    # 合成するテキストを設定
    synthesis_input = texttospeech.SynthesisInput(text=text)

    # 音声設定（日本語WaveNet）
    voice = texttospeech.VoiceSelectionParams(
        # 日本語を指定
        language_code="ja-JP",
        # WaveNet音声を使用（自然な音声品質）
        name="ja-JP-Wavenet-B",
        # 音声の性別（NEUTRAL=自動選択）
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
    )

    # 出力音声フォーマット設定
    audio_config = texttospeech.AudioConfig(
        # MP3形式で出力
        audio_encoding=texttospeech.AudioEncoding.MP3,
        # 話す速度（1.0=標準）
        speaking_rate=1.0,
        # 音の高さ（0.0=標準）
        pitch=0.0,
    )

    # 音声合成を実行
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config,
    )

    # 音声データをbase64エンコードして返す
    audio_base64 = base64.b64encode(response.audio_content).decode("utf-8")
    return audio_base64
