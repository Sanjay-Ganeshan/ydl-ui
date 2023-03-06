import typing as T
import os
from dataclasses import dataclass
from yt_dlp import YoutubeDL
from pathlib import Path

DOWNLOADS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Downloads")

@dataclass
class DownloadRequest:
    url: str
    video: bool
    audio: bool
    title: str
    artist: str
    subtitles: bool
    embed_subs: bool
    thumbnail: T.Optional[str] = None
    recode: bool = True

def on_progress(progress_dict: T.Dict[str, T.Any]) -> None:
    print(progress_dict.get("status", None), progress_dict.get("max_progress", None), progress_dict.get("progress_idx", None))
    if progress_dict.get("status", None) == "finished":
        filename = progress_dict["filename"]

def on_postprocessor_progress(progress_dict: T.Dict[str, T.Any]) -> None:
    pass

def process(request: DownloadRequest) -> T.List[Path]:
    options = {}

    if request.subtitles:
        options["writesubtitles"] = True
        options["subtitleslangs"] = ["en", "en-GB", "en-US"]
    else:
        options["writesubtitles"] = False

    if request.audio and not request.video:
        options["format"] = "bestaudio"
        options["skip_download"] = False
    elif request.video:
        options["format"] = "bestvideo+bestaudio"
        options["skip_download"] = False
    elif request.subtitles:
        options["skip_download"] = True
    
    options["noprogress"] = True
    options["keepvideo"] = True
    options["progress_hooks"] = [on_progress]
    options["postprocessor_hooks"] = [on_postprocessor_progress]

    # Manually applying post-processing so we can
    # add the subtitle track

    postprocessors = []
    if request.video:
        if request.recode:
            postprocessors.append(
                {
                    "key": "FFmpegVideoConvertor",
                    "preferedformat": "mp4",
                }
            )
        else:
            postprocessors.append(
                {
                    "key": "FFmpegVideoRemuxer",
                    "preferedformat": "mp4",
                }
            )
    if request.embed_subs:
        postprocessors.append(
            {
                "key": "FFmpegEmbedSubtitle",
            },
        )
    if request.audio:
        postprocessors.append(
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            },
        )
    

    options["postprocessors"] = postprocessors
    options["outtmpl"] = os.path.join(DOWNLOADS, "%(id)s.%(ext)s")
    options["download_archive"] = os.path.join(DOWNLOADS, "archive.txt")
    
    
    with YoutubeDL(params=options) as downloader:
        downloader.download([request.url])
    
    outputs = []
    for each_generated_file in list(Path(DOWNLOADS).glob(f"{request.url}.*")):
        if each_generated_file.name in [f"{request.url}.mp4", f"{request.url}.mp3"] or each_generated_file.name.endswith(".vtt"):
            outputs.append(each_generated_file.rename(each_generated_file.parent / each_generated_file.name.replace(request.url, f"{request.title} - {request.artist}")))
        else:
            each_generated_file.unlink(missing_ok=True)
    return outputs
    

def debug() -> None:
    process(
        DownloadRequest(
            url="us0KKywnakk",
            video=True,
            audio=True,
            title="Detective, Detective",
            artist="Static-P",
            subtitles=True,
            embed_subs=True,
        )
    )

if __name__ == '__main__':
    debug()