# SkillMatch – Agent Rules

## Repository Guidelines

Prefer Spring Data derived query methods whenever they can express the query cleanly.

Use JPQL only when querying relationships (JOIN, JOIN FETCH, DISTINCT, projections, aggregate queries).

Use native SQL only when JPQL cannot express the query efficiently (CTEs, window functions, PostgreSQL-specific features, full-text search, recursive queries).

Avoid JPQL that implements optional filters using `(:param IS NULL OR ...)`; prefer selecting the appropriate repository method in the service layer instead.

Keep repository methods simple and readable. Do not introduce Criteria API, Specifications, or QueryDSL unless explicitly requested.
