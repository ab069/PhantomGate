from datetime import datetime, timezone
from typing import Any


class ThreatContext(dict):
    token_type: str
    token_name: str
    environment: str
    source_ip: str | None
    user_agent: str | None
    timestamp: str
    enrichment: dict | None = None
    classification: str | None = None
    severity: str | None = None
    report: str | None = None
    recommended_action: str | None = None


def enrich_node(state: ThreatContext) -> ThreatContext:
    state["enrichment"] = {
        "ip_reputation": "unknown",
        "geo_location": "unknown",
        "known_threat_intel": False,
        "access_pattern": "direct",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
    }
    if state.get("source_ip"):
        ip_parts = state["source_ip"].split(".")
        if ip_parts[0] == "10" or ip_parts[0] == "192":
            state["enrichment"]["ip_reputation"] = "internal"
            state["enrichment"]["geo_location"] = "internal_network"
        else:
            state["enrichment"]["ip_reputation"] = "external"
            state["enrichment"]["geo_location"] = "external_source"
    return state


def classify_node(state: ThreatContext) -> ThreatContext:
    ua = (state.get("user_agent") or "").lower()
    is_scanner = any(k in ua for k in ["curl", "wget", "python", "go-http", "bot"])
    is_automated = any(k in ua for k in ["aws-sdk", "boto3", "requests"])
    if is_scanner:
        state["classification"] = "scanner"
    elif is_automated:
        state["classification"] = "automated_tool"
    elif state.get("source_ip") and state["source_ip"].startswith("10."):
        state["classification"] = "insider_threat"
    else:
        state["classification"] = "unknown_attacker"
    return state


def severity_node(state: ThreatContext) -> ThreatContext:
    token_type = (state.get("token_type") or "").lower()
    classification = state.get("classification", "")
    base_score = {"scanner": 3, "automated_tool": 5, "insider_threat": 8, "unknown_attacker": 6}
    score = base_score.get(classification, 5)
    if "aws" in token_type or "gcp" in token_type:
        score += 2
    if token_type == "jwt":
        score += 1
    if score >= 8:
        state["severity"] = "critical"
    elif score >= 6:
        state["severity"] = "high"
    elif score >= 4:
        state["severity"] = "medium"
    else:
        state["severity"] = "low"
    return state


def report_node(state: ThreatContext) -> ThreatContext:
    state["report"] = (
        f"PhantomGate detected a {state.get('severity', 'unknown')} severity incident "
        f"classified as '{state.get('classification', 'unknown')}'. "
        f"A {state.get('token_type', 'unknown')} honey token '{state.get('token_name', 'unknown')}' "
        f"deployed in '{state.get('environment', 'unknown')}' was accessed "
        f"from IP {state.get('source_ip', 'unknown')}. "
        f"Enrichment: {state.get('enrichment', {})}. "
        f"Time: {state.get('timestamp', 'unknown')}."
    )
    return state


def response_node(state: ThreatContext) -> ThreatContext:
    sev = state.get("severity", "low")
    if sev == "critical":
        state["recommended_action"] = "Immediate containment required. Isolate affected systems, rotate all credentials, and initiate incident response protocol."
    elif sev == "high":
        state["recommended_action"] = "Investigate and contain. Review access logs, rotate potentially exposed credentials, and monitor for further anomalies."
    elif sev == "medium":
        state["recommended_action"] = "Monitor and investigate. Review access patterns and update alerting rules."
    else:
        state["recommended_action"] = "Log for reference. No immediate action required."
    return state
