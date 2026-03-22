import logging

from app.api.schemas import (
    CompareRequest,
    CompareResponse,
    EditPreset,
    TrackCompareResult,
)
from app.services.orchestration.analyzer import analyse_link

logger = logging.getLogger(__name__)


async def compare_tracks(request: CompareRequest) -> CompareResponse:
    """Analyse multiple tracks and produce a side-by-side comparison."""
    urls = [str(u) for u in request.urls]
    preset = request.preset

    results = []
    for url in urls:
        try:
            result = await analyse_link(url, preset=preset)
            results.append(result)
        except Exception as exc:
            logger.error("Failed to analyse %s for comparison: %s", url, exc)

    if not results:
        raise ValueError("No tracks could be analysed for comparison.")

    compare_items: list[TrackCompareResult] = []
    for rank, r in enumerate(results, start=1):
        hook = r.hookWindow
        best_15 = next((bc for bc in r.bestCuts if "15" in bc.durationLabel), None)
        voiceover_sections = r.voiceoverSafeSections

        best_voiceover = "No quiet sections found"
        if voiceover_sections:
            best_vs = voiceover_sections[0]
            level = best_vs.safetyLevel
            level_label = {"great": "Great for talking over", "okay": "Could work", "risky": "Music may compete"}.get(level, level)
            best_voiceover = f"{level_label} at {best_vs.range.start}–{best_vs.range.end}"

        top_scene = r.sceneFits[0] if r.sceneFits else None
        emotional = top_scene.reason if top_scene else "No scene-fit data"

        compare_items.append(TrackCompareResult(
            rank=rank,
            songTitle=r.songTitle,
            artistName=r.artistName,
            thumbnailUrl=r.thumbnailUrl,
            sourceUrl=urls[rank - 1],
            bestOpeningMoment=f"{hook.range.start}–{hook.range.end}: {hook.reason[:120]}",
            best15sCut=f"{best_15.start}–{best_15.end}: {best_15.reason[:100]}" if best_15 else None,
            voiceoverSuitability=best_voiceover,
            emotionalPayoff=emotional[:140],
            overallFitScore=_score(r, preset),
            overallFitReason=r.summary[:180],
            summary=r.summary,
        ))

    compare_items.sort(key=lambda x: x.overallFitScore, reverse=True)
    for i, item in enumerate(compare_items):
        object.__setattr__(item, "rank", i + 1)

    winner = compare_items[0]
    return CompareResponse(
        preset=preset,
        winnerTitle=winner.songTitle,
        winnerReason=f'"{winner.songTitle}" by {winner.artistName} scored highest for your selected edit type. {winner.overallFitReason}',
        tracks=compare_items,
    )


def _score(result, preset: EditPreset) -> float:
    """Heuristic overall fit score for the preset."""
    score = 0.6

    if result.hookWindow:
        score += 0.1

    if result.bestCuts:
        avg_conf = sum(bc.confidence for bc in result.bestCuts) / len(result.bestCuts)
        score += avg_conf * 0.15

    if result.sceneFits:
        top_conf = result.sceneFits[0].confidence if result.sceneFits else 0
        score += top_conf * 0.1

    voiceover_friendly_presets = {"podcast_intro", "vlog", "product_ad", "documentary", "slideshow"}
    if preset in voiceover_friendly_presets and result.voiceoverSafeSections:
        great_sections = [v for v in result.voiceoverSafeSections if v.safetyLevel == "great"]
        if great_sections:
            score += 0.05

    return min(round(score, 2), 1.0)
