from typing import TypedDict

from app.agents.nodes import (
    ThreatContext,
    enrich_node,
    classify_node,
    severity_node,
    report_node,
    response_node,
)


class GraphState(TypedDict):
    token_type: str
    token_name: str
    environment: str
    source_ip: str | None
    user_agent: str | None
    timestamp: str
    enrichment: dict | None
    classification: str | None
    severity: str | None
    report: str | None
    recommended_action: str | None


def run_agent_pipeline(
    token_type: str,
    token_name: str,
    environment: str,
    source_ip: str | None = None,
    user_agent: str | None = None,
) -> ThreatContext:
    state: ThreatContext = ThreatContext(
        token_type=token_type,
        token_name=token_name,
        environment=environment,
        source_ip=source_ip,
        user_agent=user_agent,
        timestamp=__import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
    )
    state = enrich_node(state)
    state = classify_node(state)
    state = severity_node(state)
    state = report_node(state)
    state = response_node(state)
    return state
