from app.agents.graph import run_agent_pipeline


def test_agent_pipeline_scanner():
    result = run_agent_pipeline(
        token_type="aws_key",
        token_name="test-aws-key",
        environment="production",
        source_ip="203.0.113.5",
        user_agent="curl/7.88.1",
    )
    assert result["classification"] == "scanner"
    assert result["severity"] in ("medium", "high")
    assert result["report"]
    assert result["recommended_action"]


def test_agent_pipeline_insider():
    result = run_agent_pipeline(
        token_type="db_url",
        token_name="prod-db",
        environment="production",
        source_ip="10.0.1.50",
        user_agent="psql",
    )
    assert result["classification"] == "insider_threat"
    assert result["severity"] == "critical"


def test_agent_pipeline_no_ip():
    result = run_agent_pipeline(
        token_type="jwt_secret",
        token_name="jwt-key",
        environment="staging",
    )
    assert result["classification"]
    assert result["severity"]
    assert result["enrichment"] is not None
