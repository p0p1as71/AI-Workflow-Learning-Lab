.PHONY: pipeline validate structure governance status

pipeline:
	./scripts/run_pipeline.sh

validate:
	./scripts/validate_structure.sh
	./scripts/check_governance.sh

structure:
	./scripts/validate_structure.sh

governance:
	./scripts/check_governance.sh

status:
	git status