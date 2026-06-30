/**
 * hostscript.jsx - Corte Inteligente v4.1 (Bulletproof)
 *
 * Fixes:
 * - Fresh clip references on every call (no stale refs)
 * - Safe Time object creation via helper
 * - Sequential ripple with snapshot of positions
 * - Guard against zero-duration clips
 */

var TICKS_PER_SECOND = 254016000000;

function makeTime(seconds) {
    var t = new Time();
    t.seconds = seconds;
    return t;
}

function getFPS(seq) {
    var fps = 30;
    try {
        var tb = parseInt(seq.timebase, 10);
        if (tb > 0) fps = Math.round(TICKS_PER_SECOND / tb);
    } catch (e) {}
    return fps;
}

function processTrim(framesStr, trimFromStart, ripple, compensate) {
    try {
        var seq = app.project.activeSequence;
        if (!seq) return JSON.stringify({ ok: false, msg: "Nenhuma sequencia ativa." });

        var fps = getFPS(seq);
        var frames = parseInt(framesStr, 10);
        if (isNaN(frames) || frames <= 0)
            return JSON.stringify({ ok: false, msg: "Numero invalido." });

        var trimSec = frames / fps;
        var doStart = (trimFromStart === true || trimFromStart === "true");
        var doRipple = (ripple === true || ripple === "true");
        var doComp = (compensate === true || compensate === "true");

        // ── PHASE 1: Snapshot all selected clips with fresh references ──
        var snapshots = [];
        var i, j, track, clip;

        for (i = 0; i < seq.videoTracks.numTracks; i++) {
            track = seq.videoTracks[i];
            for (j = 0; j < track.clips.numItems; j++) {
                clip = track.clips[j];
                try {
                    if (clip.isSelected()) {
                        snapshots.push({
                            trackType: "video",
                            trackIdx: i,
                            clipIdx: j,
                            startSec: clip.start.seconds,
                            endSec: clip.end.seconds,
                            inSec: clip.inPoint.seconds,
                            outSec: clip.outPoint.seconds
                        });
                    }
                } catch (e) { /* skip inaccessible clips */ }
            }
        }

        for (i = 0; i < seq.audioTracks.numTracks; i++) {
            track = seq.audioTracks[i];
            for (j = 0; j < track.clips.numItems; j++) {
                clip = track.clips[j];
                try {
                    if (clip.isSelected()) {
                        snapshots.push({
                            trackType: "audio",
                            trackIdx: i,
                            clipIdx: j,
                            startSec: clip.start.seconds,
                            endSec: clip.end.seconds,
                            inSec: clip.inPoint.seconds,
                            outSec: clip.outPoint.seconds
                        });
                    }
                } catch (e) { /* skip inaccessible clips */ }
            }
        }

        if (snapshots.length === 0)
            return JSON.stringify({ ok: false, msg: "Selecione clips primeiro." });

        // Sort by start position
        snapshots.sort(function(a, b) { return a.startSec - b.startSec; });

        // ── PHASE 2: Apply trim using fresh clip references ──
        var trimmed = 0;

        for (i = 0; i < snapshots.length; i++) {
            var s = snapshots[i];
            var dur = s.endSec - s.startSec;

            // Don't trim if it would make clip disappear
            if (trimSec >= dur - (1.0 / fps)) continue;

            // Get FRESH reference to clip
            var freshClip = getClipRef(seq, s.trackType, s.trackIdx, s.clipIdx);
            if (!freshClip) continue;

            if (doComp) {
                // Slip edit mode
                if (doStart) {
                    freshClip.inPoint = makeTime(s.inSec + trimSec);
                    freshClip.outPoint = makeTime(s.outSec + trimSec);
                } else {
                    freshClip.inPoint = makeTime(Math.max(0, s.inSec - trimSec));
                    freshClip.outPoint = makeTime(s.outSec - trimSec);
                }
            } else {
                // Normal trim
                if (doStart) {
                    var newStart = s.startSec + trimSec;
                    freshClip.start = makeTime(newStart);
                    freshClip.end = makeTime(s.endSec);
                    freshClip.inPoint = makeTime(s.inSec + trimSec);
                } else {
                    freshClip.end = makeTime(s.endSec - trimSec);
                }
            }

            // Update snapshot with new values for ripple phase
            s.newStartSec = freshClip.start.seconds;
            s.newEndSec = freshClip.end.seconds;
            s.trimmed = true;
            trimmed++;
        }

        // ── PHASE 3: Smart Ripple (close gaps) ──
        if (!doComp && doRipple && trimmed > 0) {
            doSmartRipple(seq, snapshots);
        }

        var mode = doComp ? " (slip)" : "";
        return JSON.stringify({ ok: true, msg: trimmed + " clip(s) cortado(s)" + mode + "." });

    } catch (e) {
        return JSON.stringify({ ok: false, msg: "Erro: " + e.message + " (L" + e.line + ")" });
    }
}

function getClipRef(seq, trackType, trackIdx, clipIdx) {
    try {
        var track;
        if (trackType === "video") {
            track = seq.videoTracks[trackIdx];
        } else {
            track = seq.audioTracks[trackIdx];
        }
        if (clipIdx < track.clips.numItems) {
            return track.clips[clipIdx];
        }
    } catch (e) {}
    return null;
}

function doSmartRipple(seq, snapshots) {
    // Group snapshots by track
    var groups = {};
    var i;
    for (i = 0; i < snapshots.length; i++) {
        var key = snapshots[i].trackType + "_" + snapshots[i].trackIdx;
        if (!groups[key]) groups[key] = [];
        groups[key].push(snapshots[i]);
    }

    for (var key in groups) {
        var group = groups[key];
        group.sort(function(a, b) { return a.startSec - b.startSec; });

        for (i = 1; i < group.length; i++) {
            var prev = group[i - 1];
            var curr = group[i];

            // Calculate what the end of previous clip is NOW
            var prevEndNow = prev.trimmed ? prev.newEndSec : prev.endSec;

            // Get fresh reference
            var freshClip = getClipRef(seq, curr.trackType, curr.trackIdx, curr.clipIdx);
            if (!freshClip) continue;

            // Read current positions fresh
            var currStartNow = freshClip.start.seconds;
            var currEndNow = freshClip.end.seconds;
            var currDuration = currEndNow - currStartNow;

            // Calculate original gap between these two clips
            var originalGap = curr.startSec - prev.endSec;
            if (originalGap < 0) originalGap = 0;

            // Target position: right after previous clip end + original gap
            var targetStart = prevEndNow + originalGap;

            // Only move if there's a meaningful difference
            if (Math.abs(targetStart - currStartNow) > 0.001) {
                freshClip.start = makeTime(targetStart);
                freshClip.end = makeTime(targetStart + currDuration);

                // Update snapshot for next iteration
                curr.newStartSec = targetStart;
                curr.newEndSec = targetStart + currDuration;
            } else {
                curr.newStartSec = currStartNow;
                curr.newEndSec = currEndNow;
            }
        }
    }
}
