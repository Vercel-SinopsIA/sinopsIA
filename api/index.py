import sys
from pathlib import Path

# Add Frontend/SinopsIA to sys.path so it imports the FastAPI app
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "Frontend" / "SinopsIA"))

from api.index import app  # noqa: F401
