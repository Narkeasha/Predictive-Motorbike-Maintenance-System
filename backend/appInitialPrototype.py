# app.py 
# INITIAL PROTOTYE 
# standalone backend.
# doesnt get called or would be uvicorn app:app
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
import os

#load supabase keys 
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

#if missing it stops there n then
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")


#connects to supabase
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


#creates fastapi and allows react to call it.
app = FastAPI()

# allow local React dev servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#reads the user from the KWT token
def get_user_id_from_bearer(authorization: str) -> str:
    """
    Phase 1: verify token by asking Supabase who it belongs to.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ", 1)[1].strip()

    try:
        res = supabase.auth.get_user(token)
        user = res.user
    except Exception:
        user = None

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user.id


#is this server still alvie ?
@app.get("/health")
def health():
    return {"status": "ok"}

#created dummy outputs 
@app.post("/predict")
def predict(payload: dict, authorization: str = Header(None)):
    user_id = get_user_id_from_bearer(authorization)

    # Dummy outputs (Phase 1). Keep shape final.
    outputs = {
        "oil": {"estimate_miles_remaining": 1000, "status": "green", "reason": "Dummy output (Phase 1)"},
        "tyres": {"estimate_miles_remaining": 1200, "status": "green", "reason": "Dummy output (Phase 1)"},
        "chain_sprocket": {"estimate_miles_remaining": 900, "status": "amber", "reason": "Dummy output (Phase 1)"},
        "brakes": {"status": "green", "reason": "Dummy output (Phase 1)"},
        "coolant": {"due_date": "2026-12-01", "status": "green", "reason": "Dummy output (Phase 1)"},
        "brake_fluid": {"due_date": "2026-08-01", "status": "green", "reason": "Dummy output (Phase 1)"},
    }

    # Save to Supabase
    insert_res = supabase.table("maintenance_records").insert({
        "user_id": user_id,
        "inputs": payload,
        "outputs": outputs
    }).execute()

    if not insert_res.data:
        raise HTTPException(status_code=500, detail="Failed to insert record")

    row = insert_res.data[0]
    return {"id": row["id"], "created_at": row["created_at"], "outputs": outputs}


#select only rows with same user id 
@app.get("/logs")
def logs(limit: int = 10, authorization: str = Header(None)):
    user_id = get_user_id_from_bearer(authorization)

    res = (
        supabase.table("maintenance_records")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return res.data
