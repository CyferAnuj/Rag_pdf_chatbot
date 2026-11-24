from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from app.auth.auth_bearer import JWTBearer

from app.services.rag_pipeline import (
    process_pdf,
    ask_question,
    clear_pdf,
    get_pipeline_status
)

router = APIRouter()


@router.get(
    "/status",
    dependencies=[Depends(JWTBearer())]
)
async def pipeline_status():
    return get_pipeline_status()


@router.post(
    "/clear-pdf",
    dependencies=[Depends(JWTBearer())]
)
async def clear_uploaded_pdf():
    msg = clear_pdf()
    return {
        "message": msg,
        "has_pdf": False
    }


@router.post(
    "/upload",
    dependencies=[Depends(JWTBearer())]
)
async def upload_pdf(
    file: UploadFile = File(...)
):

    response = process_pdf(file)

    return {
        "message": response,
        "filename": file.filename,
        "has_pdf": "successfully" in response.lower()
    }


@router.post(
    "/ask",
    dependencies=[Depends(JWTBearer())]
)
async def ask(data: dict):

    question = data.get("question", "")
    history = data.get("history", [])

    response = ask_question(question, history)

    return response
