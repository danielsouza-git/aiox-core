"""Tests for PautaBridge integration methods (Story 6.5)."""

import sys
from unittest.mock import MagicMock, patch

import pytest

# Mock webview before importing app module — must be before src imports (E402 expected)
sys.modules.setdefault("webview", MagicMock())

from src.core.models import (  # noqa: E402
    Instruction,
    InstructionType,
    NewsBlock,
    PautaResult,
    ProcessingStatus,
    TimeCode,
    VideoClip,
)
from src.gui.app import PautaBridge  # noqa: E402


@pytest.fixture
def bridge(tmp_path):
    """Create PautaBridge with a mock pauta result."""
    b = PautaBridge(root_dir=tmp_path)
    # Create a pauta result with video instructions
    instructions = [
        Instruction(
            type=InstructionType.VIDEO_SUBTITLE,
            news_block="BLOCO 1",
            order=0,
            id="vid-001",
            url="https://youtube.com/watch?v=test",
            timecode=TimeCode(start="0130", end="0230"),
            merge=False,
            enabled=True,
        ),
        Instruction(
            type=InstructionType.VIDEO_ONLY,
            news_block="BLOCO 1",
            order=1,
            id="vid-002",
            url="https://youtube.com/watch?v=test2",
            clips=[
                VideoClip(url="https://youtube.com/watch?v=test2", timecode=TimeCode(start="0000", end="0100")),
                VideoClip(url="https://youtube.com/watch?v=test2", timecode=TimeCode(start="0200", end="0300")),
            ],
            merge=True,
            enabled=True,
        ),
        Instruction(
            type=InstructionType.TARJA,
            news_block="BLOCO 2",
            order=2,
            id="tarja-001",
            tarja_title="Test Tarja",
        ),
    ]
    b._pauta_result = PautaResult(
        doc_title="Test Pauta",
        news_blocks=[
            NewsBlock(title="BLOCO 1", instructions=[instructions[0], instructions[1]]),
            NewsBlock(title="BLOCO 2", instructions=[instructions[2]]),
        ],
    )
    return b


class TestGetInstructionDetails:
    def test_returns_details_for_video_sub(self, bridge):
        result = bridge.get_instruction_details("vid-001")
        assert result["status"] == "ok"
        assert result["id"] == "vid-001"
        assert result["type"] == "video_sub"
        assert result["url"] == "https://youtube.com/watch?v=test"
        assert result["timecode"] == {"start": "0130", "end": "0230"}
        assert result["merge"] is False

    def test_returns_details_for_video_with_clips(self, bridge):
        result = bridge.get_instruction_details("vid-002")
        assert result["status"] == "ok"
        assert result["type"] == "video_only"
        assert result["merge"] is True
        assert len(result["clips"]) == 2
        assert result["clips"][0]["start"] == "0000"
        assert result["clips"][1]["end"] == "0300"

    def test_returns_error_for_invalid_id(self, bridge):
        result = bridge.get_instruction_details("nonexistent")
        assert result["status"] == "error"
        assert "nao encontrada" in result["message"]

    def test_returns_error_when_no_pauta(self, tmp_path):
        b = PautaBridge(root_dir=tmp_path)
        result = b.get_instruction_details("any-id")
        assert result["status"] == "error"
        assert "pauta" in result["message"].lower()


class TestUpdateInstructionStatus:
    def test_updates_to_completed(self, bridge):
        result = bridge.update_instruction_status("vid-001", "completed", "/output/video.mp4")
        assert result["status"] == "ok"
        instr = bridge._pauta_result.instructions[0]
        assert instr.status == ProcessingStatus.COMPLETED
        assert instr.output_path == "/output/video.mp4"

    def test_updates_to_error(self, bridge):
        result = bridge.update_instruction_status("vid-001", "error")
        assert result["status"] == "ok"
        instr = bridge._pauta_result.instructions[0]
        assert instr.status == ProcessingStatus.ERROR

    def test_invalid_status(self, bridge):
        result = bridge.update_instruction_status("vid-001", "invalid_status")
        assert result["status"] == "error"
        assert "invalido" in result["message"].lower()

    def test_invalid_instruction_id(self, bridge):
        result = bridge.update_instruction_status("nonexistent", "completed")
        assert result["status"] == "error"


class TestGetOutputPaths:
    def test_returns_tracked_paths(self, bridge):
        bridge._output_paths["vid-001"] = {
            "video": "/output/video.mp4",
            "srt": "/output/video.srt",
        }
        result = bridge.get_output_paths("vid-001")
        assert result["status"] == "ok"
        assert result["video"] == "/output/video.mp4"
        assert result["srt"] == "/output/video.srt"

    def test_returns_error_when_not_tracked(self, bridge):
        result = bridge.get_output_paths("vid-001")
        assert result["status"] == "error"


class TestDownloadVideoWithInstructionId:
    @patch("src.processors.video_downloader.engine.VideoDownloaderEngine")
    def test_accepts_instruction_id_in_params(self, mock_engine, bridge):
        """Verify download_video accepts instruction_id without errors."""
        params = {
            "url": "https://youtube.com/watch?v=test",
            "quality": "1080p",
            "clips": [],
            "merge": False,
            "video_only": True,
            "custom_name": "test_video",
            "instruction_id": "vid-001",
        }
        result = bridge.download_video(params)
        assert result["status"] == "ok"


class TestSerializeResultVideoFields:
    def test_includes_timecode_start_end(self, bridge):
        result = bridge._serialize_result(bridge._pauta_result)
        video_item = next(i for i in result["items"] if i["id"] == "vid-001")
        assert video_item["timecode_start"] == "0130"
        assert video_item["timecode_end"] == "0230"

    def test_includes_clips_array(self, bridge):
        result = bridge._serialize_result(bridge._pauta_result)
        video_item = next(i for i in result["items"] if i["id"] == "vid-002")
        assert "clips" in video_item
        assert len(video_item["clips"]) == 2
        assert video_item["clips"][0]["start"] == "0000"

    def test_includes_merge_flag(self, bridge):
        result = bridge._serialize_result(bridge._pauta_result)
        video_item = next(i for i in result["items"] if i["id"] == "vid-002")
        assert video_item["merge"] is True

        other_item = next(i for i in result["items"] if i["id"] == "vid-001")
        assert other_item["merge"] is False
